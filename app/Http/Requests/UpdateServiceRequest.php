<?php

namespace App\Http\Requests;

use App\Models\Service;
use App\Rules\SafePublicUrl;
use App\Support\CmsHtmlSanitizer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateServiceRequest extends FormRequest
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
        $blocks = $this->input('blocks');
        /** @var Service $service */
        $service = $this->route('service');

        if (is_array($blocks)) {
            $blocks['detail'] = CmsHtmlSanitizer::cleanNullable($blocks['detail'] ?? null);
            $blocks['localContext'] = CmsHtmlSanitizer::cleanNullable($blocks['localContext'] ?? null);
            $faqs = $blocks['faqs'] ?? [];

            if (is_array($faqs)) {
                $blocks['faqs'] = array_map(function (mixed $faq): mixed {
                    if (! is_array($faq)) {
                        return $faq;
                    }

                    $faq['answer'] = CmsHtmlSanitizer::cleanNullable($faq['answer'] ?? null);

                    return $faq;
                }, $faqs);
            }
        }

        $this->merge([
            'slug' => Str::slug($slug !== '' ? $slug : $title),
            'kind' => $this->input('kind', $service->kind),
            'excerpt' => CmsHtmlSanitizer::cleanNullable($this->input('excerpt')),
            'description' => CmsHtmlSanitizer::cleanNullable($this->input('description')),
            'blocks' => $blocks,
            'is_featured' => $this->boolean('is_featured'),
            'remove_featured_image' => $this->boolean('remove_featured_image'),
            'remove_logo_image' => $this->boolean('remove_logo_image'),
            'sort_order' => $this->input('sort_order') === null ? 0 : $this->input('sort_order'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Service $service */
        $service = $this->route('service');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('services', 'slug')->ignore($service->id)],
            'kind' => ['required', 'string', Rule::in(['consulting', 'digital'])],
            'excerpt' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:255'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'featured_image_alt' => ['nullable', 'string', 'max:255'],
            'featured_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_featured_image' => ['boolean'],
            'logo_image' => ['nullable', 'string', 'max:255'],
            'logo_image_alt' => ['nullable', 'string', 'max:255'],
            'logo_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(3 * 1024)],
            'remove_logo_image' => ['boolean'],
            'blocks' => ['nullable', 'array:benefits,detail,cta,localContext,faqs'],
            'blocks.benefits' => ['nullable', 'array', 'max:8'],
            'blocks.benefits.*' => ['array:id,title,description'],
            'blocks.benefits.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.benefits.*.title' => ['required', 'string', 'max:255'],
            'blocks.benefits.*.description' => ['nullable', 'string', 'max:1000'],
            'blocks.detail' => ['nullable', 'string'],
            'blocks.localContext' => ['nullable', 'string'],
            'blocks.faqs' => ['nullable', 'array', 'max:12'],
            'blocks.faqs.*' => ['array:id,question,answer'],
            'blocks.faqs.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.faqs.*.question' => ['required', 'string', 'max:255'],
            'blocks.faqs.*.answer' => ['required', 'string', 'max:2000'],
            'blocks.cta' => ['nullable', 'array:label,href'],
            'blocks.cta.label' => ['required_with:blocks.cta', 'string', 'max:80'],
            'blocks.cta.href' => ['required_with:blocks.cta', 'string', 'max:2048', new SafePublicUrl],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'is_featured' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ];
    }
}
