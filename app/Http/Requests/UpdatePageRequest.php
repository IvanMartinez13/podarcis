<?php

namespace App\Http\Requests;

use App\Models\Page;
use App\Rules\LinkedInUrl;
use App\Rules\SafePublicUrl;
use App\Support\CmsHtmlSanitizer;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdatePageRequest extends FormRequest
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
        $blocks = $this->sanitizeBlocks($this->input('blocks'));
        $removeTeamMemberAvatars = $this->input('remove_team_member_avatars', []);

        if (is_array($removeTeamMemberAvatars)) {
            $removeTeamMemberAvatars = array_map(
                fn (mixed $value): bool => filter_var($value, FILTER_VALIDATE_BOOLEAN),
                $removeTeamMemberAvatars,
            );
        }

        $this->merge([
            'slug' => Str::slug($slug !== '' ? $slug : $title),
            'excerpt' => CmsHtmlSanitizer::cleanNullable($this->input('excerpt')),
            'content' => CmsHtmlSanitizer::cleanNullable($this->input('content')),
            'seo_description' => CmsHtmlSanitizer::cleanNullable($this->input('seo_description')),
            'blocks' => $blocks,
            'published_at' => $status === 'published' && blank($this->input('published_at'))
                ? now()
                : $this->input('published_at'),
            'remove_og_image' => $this->boolean('remove_og_image'),
            'remove_team_cover_image' => $this->boolean('remove_team_cover_image'),
            'remove_hero_image' => $this->boolean('remove_hero_image'),
            'remove_digital_image' => $this->boolean('remove_digital_image'),
            'remove_success_cases_background_image' => $this->boolean('remove_success_cases_background_image'),
            'remove_testimonials_background_image' => $this->boolean('remove_testimonials_background_image'),
            'remove_team_member_avatars' => $removeTeamMemberAvatars,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Page $page */
        $page = $this->route('page');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('pages', 'slug')->ignore($page->id)],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'blocks' => ['nullable', 'array:hero,metrics,services,methodology,digital,successCases,testimonials,posts,finalCta,values,team,teamCoverImage,teamMembers,response'],
            'blocks.hero' => ['nullable', 'array:eyebrow,title,highlightText,primaryCta,secondaryCta,image,imageAlt'],
            'blocks.hero.eyebrow' => ['nullable', 'string', 'max:120'],
            'blocks.hero.title' => ['nullable', 'string', 'max:500'],
            'blocks.hero.highlightText' => ['nullable', 'string', 'max:255'],
            'blocks.hero.image' => ['nullable', 'string', 'max:255'],
            'blocks.hero.imageAlt' => ['nullable', 'string', 'max:255'],
            'blocks.hero.primaryCta' => ['nullable', 'array:label,href'],
            'blocks.hero.secondaryCta' => ['nullable', 'array:label,href'],
            'blocks.hero.primaryCta.label' => ['required_with:blocks.hero.primaryCta', 'string', 'max:80'],
            'blocks.hero.primaryCta.href' => ['required_with:blocks.hero.primaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.hero.secondaryCta.label' => ['required_with:blocks.hero.secondaryCta', 'string', 'max:80'],
            'blocks.hero.secondaryCta.href' => ['required_with:blocks.hero.secondaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.metrics' => ['nullable', 'array', 'max:6'],
            'blocks.metrics.*' => ['array:id,value,label'],
            'blocks.metrics.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.metrics.*.value' => ['required', 'string', 'max:80'],
            'blocks.metrics.*.label' => ['required', 'string', 'max:160'],
            'blocks.services' => ['nullable', 'array:eyebrow,title,description,limit'],
            'blocks.services.limit' => ['nullable', 'integer', 'min:1', 'max:12'],
            'blocks.methodology' => ['nullable', 'array:eyebrow,title,description,steps'],
            'blocks.methodology.steps' => ['nullable', 'array', 'max:6'],
            'blocks.methodology.steps.*' => ['array:id,title,description'],
            'blocks.methodology.steps.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.methodology.steps.*.title' => ['required', 'string', 'max:255'],
            'blocks.methodology.steps.*.description' => ['nullable', 'string', 'max:1000'],
            'blocks.digital' => ['nullable', 'array:eyebrow,title,description,features,benefits,image,imageAlt,primaryCta,secondaryCta,cta'],
            'blocks.digital.features' => ['nullable', 'array', 'max:8'],
            'blocks.digital.features.*' => ['array:id,title,description,icon'],
            'blocks.digital.features.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.digital.features.*.title' => ['required', 'string', 'max:255'],
            'blocks.digital.features.*.description' => ['nullable', 'string', 'max:1000'],
            'blocks.digital.features.*.icon' => ['nullable', 'string', Rule::in(['chart', 'file', 'shield'])],
            'blocks.digital.benefits' => ['nullable', 'array', 'max:8'],
            'blocks.digital.benefits.*' => ['array:id,title,description,icon'],
            'blocks.digital.benefits.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.digital.benefits.*.title' => ['required', 'string', 'max:255'],
            'blocks.digital.benefits.*.description' => ['nullable', 'string', 'max:1000'],
            'blocks.digital.benefits.*.icon' => ['nullable', 'string', Rule::in(['chart', 'file', 'shield'])],
            'blocks.digital.image' => ['nullable', 'string', 'max:255'],
            'blocks.digital.imageAlt' => ['nullable', 'string', 'max:255'],
            'blocks.digital.cta' => ['nullable', 'array:id,label,href'],
            'blocks.digital.cta.label' => ['required_with:blocks.digital.cta', 'string', 'max:80'],
            'blocks.digital.cta.href' => ['required_with:blocks.digital.cta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.digital.primaryCta' => ['nullable', 'array:id,label,href'],
            'blocks.digital.primaryCta.label' => ['required_with:blocks.digital.primaryCta', 'string', 'max:80'],
            'blocks.digital.primaryCta.href' => ['required_with:blocks.digital.primaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.digital.secondaryCta' => ['nullable', 'array:id,label,href'],
            'blocks.digital.secondaryCta.label' => ['required_with:blocks.digital.secondaryCta', 'string', 'max:80'],
            'blocks.digital.secondaryCta.href' => ['required_with:blocks.digital.secondaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.successCases' => ['nullable', 'array:eyebrow,title,description,backgroundImage'],
            'blocks.successCases.backgroundImage' => ['nullable', 'string', 'max:255'],
            'blocks.testimonials' => ['nullable', 'array:eyebrow,title,description,autoplay,backgroundImage'],
            'blocks.testimonials.autoplay' => ['nullable', 'boolean'],
            'blocks.testimonials.backgroundImage' => ['nullable', 'string', 'max:255'],
            'blocks.posts' => ['nullable', 'array:eyebrow,title,description'],
            'blocks.finalCta' => ['nullable', 'array:eyebrow,title,description,primaryCta,secondaryCta,image'],
            'blocks.finalCta.primaryCta' => ['nullable', 'array:label,href'],
            'blocks.finalCta.secondaryCta' => ['nullable', 'array:label,href'],
            'blocks.finalCta.primaryCta.label' => ['required_with:blocks.finalCta.primaryCta', 'string', 'max:80'],
            'blocks.finalCta.primaryCta.href' => ['required_with:blocks.finalCta.primaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.finalCta.secondaryCta.label' => ['required_with:blocks.finalCta.secondaryCta', 'string', 'max:80'],
            'blocks.finalCta.secondaryCta.href' => ['required_with:blocks.finalCta.secondaryCta', 'string', 'max:2048', new SafePublicUrl],
            'blocks.finalCta.image' => ['nullable', 'string', 'max:255'],
            'blocks.values' => ['nullable', 'array', 'max:8'],
            'blocks.values.*' => ['string', 'max:1000'],
            'blocks.team' => ['nullable', 'array:eyebrow,title,description'],
            'blocks.response' => ['nullable', 'array:eyebrow,title,description,steps'],
            'blocks.response.steps' => ['nullable', 'array', 'max:8'],
            'blocks.response.steps.*' => ['array:id,title,description'],
            'blocks.response.steps.*.id' => ['required', 'string', 'max:80', 'distinct'],
            'blocks.response.steps.*.title' => ['required', 'string', 'max:255'],
            'blocks.response.steps.*.description' => ['nullable', 'string', 'max:1000'],
            'blocks.teamCoverImage' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers' => ['nullable', 'array'],
            'blocks.teamMembers.*' => ['array:name,title,handle,status,linkedinUrl,avatarUrl'],
            'blocks.teamMembers.*.name' => ['required', 'string', 'max:255'],
            'blocks.teamMembers.*.title' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.handle' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.status' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.linkedinUrl' => ['nullable', 'string', 'max:2048', new LinkedInUrl],
            'blocks.teamMembers.*.avatarUrl' => ['nullable', 'string', 'max:255'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'og_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_og_image' => ['boolean'],
            'team_cover_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_team_cover_image' => ['boolean'],
            'hero_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_hero_image' => ['boolean'],
            'digital_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_digital_image' => ['boolean'],
            'success_cases_background_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_success_cases_background_image' => ['boolean'],
            'testimonials_background_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_testimonials_background_image' => ['boolean'],
            'team_member_avatar_uploads' => ['nullable', 'array'],
            'team_member_avatar_uploads.*' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(3 * 1024)],
            'remove_team_member_avatars' => ['nullable', 'array'],
            'remove_team_member_avatars.*' => ['boolean'],
            'status' => ['required', 'string', Rule::in(['draft', 'published'])],
            'published_at' => ['nullable', 'date'],
        ];
    }

    private function sanitizeBlocks(mixed $blocks): mixed
    {
        if (! is_array($blocks)) {
            return $blocks;
        }

        if (is_array($blocks['hero'] ?? null)) {
            $blocks['hero']['title'] = CmsHtmlSanitizer::cleanNullable($blocks['hero']['title'] ?? null);
        }

        foreach (['services', 'methodology', 'digital', 'successCases', 'testimonials', 'posts', 'finalCta', 'team', 'response'] as $copyPath) {
            if (is_array($blocks[$copyPath] ?? null)) {
                $blocks[$copyPath]['description'] = CmsHtmlSanitizer::cleanNullable($blocks[$copyPath]['description'] ?? null);
            }
        }

        if (is_array($blocks['methodology']['steps'] ?? null)) {
            $blocks['methodology']['steps'] = array_map(function (mixed $step): mixed {
                if (! is_array($step)) {
                    return $step;
                }

                $step['description'] = CmsHtmlSanitizer::cleanNullable($step['description'] ?? null);

                return $step;
            }, $blocks['methodology']['steps']);
        }

        if (is_array($blocks['response']['steps'] ?? null)) {
            $blocks['response']['steps'] = array_map(function (mixed $step): mixed {
                if (! is_array($step)) {
                    return $step;
                }

                $step['description'] = CmsHtmlSanitizer::cleanNullable($step['description'] ?? null);

                return $step;
            }, $blocks['response']['steps']);
        }

        foreach (['features', 'benefits'] as $featurePath) {
            if (! is_array($blocks['digital'][$featurePath] ?? null)) {
                continue;
            }

            $blocks['digital'][$featurePath] = array_map(function (mixed $feature): mixed {
                if (! is_array($feature)) {
                    return $feature;
                }

                $feature['description'] = CmsHtmlSanitizer::cleanNullable($feature['description'] ?? null);

                return $feature;
            }, $blocks['digital'][$featurePath]);
        }

        if (! is_array($blocks['teamMembers'] ?? null)) {
            return $blocks;
        }

        $allowedMemberKeys = array_fill_keys([
            'name',
            'title',
            'handle',
            'status',
            'linkedinUrl',
            'avatarUrl',
        ], true);

        $blocks['teamMembers'] = array_map(
            fn (mixed $member): mixed => is_array($member) ? array_intersect_key($member, $allowedMemberKeys) : $member,
            $blocks['teamMembers'],
        );

        return $blocks;
    }
}
