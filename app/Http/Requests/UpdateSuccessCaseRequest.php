<?php

namespace App\Http\Requests;

use App\Models\SuccessCase;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateSuccessCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $title = (string) $this->input('title');
        $slug = (string) $this->input('slug');
        $status = (string) $this->input('status', 'draft');

        $this->merge([
            'slug' => Str::slug($slug !== '' ? $slug : $title),
            'published_at' => $status === 'published' && blank($this->input('published_at'))
                ? now()
                : $this->input('published_at'),
            'remove_featured_image' => $this->boolean('remove_featured_image'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var SuccessCase $successCase */
        $successCase = $this->route('success_case');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('success_cases', 'slug')->ignore($successCase->id)],
            'client_name' => ['nullable', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'challenge' => ['nullable', 'string'],
            'solution' => ['nullable', 'string'],
            'result' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'featured_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_featured_image' => ['boolean'],
            'service_id' => ['nullable', 'integer', Rule::exists('services', 'id')],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
