<?php

namespace App\Http\Requests;

use App\Rules\SafePublicUrl;
use App\Support\CmsHtmlSanitizer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $hero = $this->input('hero');

        if (is_array($hero)) {
            $hero['title'] = CmsHtmlSanitizer::cleanNullable($hero['title'] ?? null);
        }

        $this->merge([
            'brand_description' => CmsHtmlSanitizer::cleanNullable($this->input('brand_description')),
            'hero' => $hero,
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
            'brand_description' => ['nullable', 'string', 'max:1000'],
            'hero' => ['nullable', 'array:eyebrow,title,highlightText,primaryCta,secondaryCta'],
            'hero.eyebrow' => ['nullable', 'string', 'max:120'],
            'hero.title' => ['nullable', 'string', 'max:500'],
            'hero.highlightText' => ['nullable', 'string', 'max:255'],
            'hero.primaryCta' => ['nullable', 'array:label,href'],
            'hero.primaryCta.label' => ['nullable', 'string', 'max:80', 'required_with:hero.primaryCta.href'],
            'hero.primaryCta.href' => ['nullable', 'string', 'max:2048', new SafePublicUrl, 'required_with:hero.primaryCta.label'],
            'hero.secondaryCta' => ['nullable', 'array:label,href'],
            'hero.secondaryCta.label' => ['nullable', 'string', 'max:80', 'required_with:hero.secondaryCta.href'],
            'hero.secondaryCta.href' => ['nullable', 'string', 'max:2048', new SafePublicUrl, 'required_with:hero.secondaryCta.label'],
            'navigation' => ['nullable', 'array', 'max:10'],
            'navigation.*' => ['array:id,label,href'],
            'navigation.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'navigation.*.label' => ['required', 'string', 'max:80'],
            'navigation.*.href' => ['required', 'string', 'max:2048', new SafePublicUrl],
            'header_cta' => ['nullable', 'array:label,href'],
            'header_cta.label' => ['required_with:header_cta', 'string', 'max:80'],
            'header_cta.href' => ['required_with:header_cta', 'string', 'max:2048', new SafePublicUrl],
            'contact' => ['nullable', 'array:email,phone,address,legal_name,street_address,postal_code,locality,region,country,latitude,longitude'],
            'contact.email' => ['nullable', 'email:rfc', 'max:255'],
            'contact.phone' => ['nullable', 'string', 'max:80'],
            'contact.address' => ['nullable', 'string', 'max:500'],
            'contact.legal_name' => ['nullable', 'string', 'max:255'],
            'contact.street_address' => ['nullable', 'string', 'max:255'],
            'contact.postal_code' => ['nullable', 'string', 'max:20'],
            'contact.locality' => ['nullable', 'string', 'max:120'],
            'contact.region' => ['nullable', 'string', 'max:120'],
            'contact.country' => ['nullable', 'string', 'size:2'],
            'contact.latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'contact.longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'social_links' => ['nullable', 'array', 'max:10'],
            'social_links.*' => ['array:id,label,href'],
            'social_links.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'social_links.*.label' => ['required', 'string', 'max:80'],
            'social_links.*.href' => ['required', 'string', 'max:2048', new SafePublicUrl],
            'footer_groups' => ['nullable', 'array', 'max:6'],
            'footer_groups.*' => ['array:id,title,links'],
            'footer_groups.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'footer_groups.*.title' => ['required', 'string', 'max:80'],
            'footer_groups.*.links' => ['required', 'array', 'max:10'],
            'footer_groups.*.links.*' => ['array:id,label,href'],
            'footer_groups.*.links.*.id' => ['required', 'string', 'max:80'],
            'footer_groups.*.links.*.label' => ['required', 'string', 'max:80'],
            'footer_groups.*.links.*.href' => ['required', 'string', 'max:2048', new SafePublicUrl],
        ];
    }
}
