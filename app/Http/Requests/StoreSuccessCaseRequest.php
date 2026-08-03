<?php

namespace App\Http\Requests;

use App\Support\CmsHtmlSanitizer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreSuccessCaseRequest extends FormRequest
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
            'challenge' => CmsHtmlSanitizer::cleanNullable($this->input('challenge')),
            'solution' => CmsHtmlSanitizer::cleanNullable($this->input('solution')),
            'result' => CmsHtmlSanitizer::cleanNullable($this->input('result')),
            'seo_description' => CmsHtmlSanitizer::cleanNullable($this->input('seo_description')),
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('success_cases', 'slug')],
            'client_name' => ['nullable', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'challenge' => ['nullable', 'string'],
            'solution' => ['nullable', 'string'],
            'result' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'featured_image_alt' => ['nullable', 'string', 'max:255'],
            'featured_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_featured_image' => ['boolean'],
            'service_id' => ['nullable', 'integer', Rule::exists('services', 'id')],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
