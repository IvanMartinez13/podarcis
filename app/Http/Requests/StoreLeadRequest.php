<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;
use Throwable;

class StoreLeadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'service_id' => ['nullable', 'integer', Rule::exists('services', 'id')->where('status', 'published')],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'privacy_accepted' => ['accepted'],
            'cf_turnstile_response' => ['required', 'string'],
            'source' => ['nullable', 'string', 'max:255', 'regex:/^(contact_page|digital_solution_demo|team_card:[A-Za-z0-9_-]{1,80})$/'],
            'website' => ['prohibited'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->has('cf_turnstile_response')) {
                    return;
                }

                $secretKey = config('services.turnstile.secret_key');

                if (! is_string($secretKey) || trim($secretKey) === '') {
                    $validator->errors()->add('cf_turnstile_response', 'Turnstile no está configurado correctamente.');

                    return;
                }

                try {
                    $response = Http::asForm()
                        ->timeout(5)
                        ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                            'secret' => $secretKey,
                            'response' => $this->string('cf_turnstile_response')->toString(),
                            'remoteip' => $this->ip(),
                        ]);
                } catch (Throwable) {
                    $validator->errors()->add('cf_turnstile_response', 'No hemos podido verificar el captcha. Inténtalo de nuevo.');

                    return;
                }

                if (! $response->successful() || $response->json('success') !== true) {
                    $validator->errors()->add('cf_turnstile_response', 'No hemos podido verificar el captcha. Inténtalo de nuevo.');
                }
            },
        ];
    }
}
