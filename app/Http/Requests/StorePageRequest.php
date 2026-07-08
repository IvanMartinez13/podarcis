<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StorePageRequest extends FormRequest
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
            'blocks' => $blocks,
            'published_at' => $status === 'published' && blank($this->input('published_at'))
                ? now()
                : $this->input('published_at'),
            'remove_og_image' => $this->boolean('remove_og_image'),
            'remove_team_cover_image' => $this->boolean('remove_team_cover_image'),
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('pages', 'slug')],
            'excerpt' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'blocks' => ['nullable', 'array:teamCoverImage,teamMembers'],
            'blocks.teamCoverImage' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers' => ['nullable', 'array'],
            'blocks.teamMembers.*' => ['array:name,title,handle,status,contactText,avatarUrl'],
            'blocks.teamMembers.*.name' => ['required', 'string', 'max:255'],
            'blocks.teamMembers.*.title' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.handle' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.status' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.contactText' => ['nullable', 'string', 'max:255'],
            'blocks.teamMembers.*.avatarUrl' => ['nullable', 'string', 'max:255'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string'],
            'og_image' => ['nullable', 'string', 'max:255'],
            'og_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_og_image' => ['boolean'],
            'team_cover_image_upload' => ['nullable', File::image()->types(['jpg', 'jpeg', 'png', 'webp'])->max(5 * 1024)],
            'remove_team_cover_image' => ['boolean'],
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
        if (! is_array($blocks) || ! is_array($blocks['teamMembers'] ?? null)) {
            return $blocks;
        }

        $allowedMemberKeys = array_fill_keys([
            'name',
            'title',
            'handle',
            'status',
            'contactText',
            'avatarUrl',
        ], true);

        $blocks['teamMembers'] = array_map(
            fn (mixed $member): mixed => is_array($member) ? array_intersect_key($member, $allowedMemberKeys) : $member,
            $blocks['teamMembers'],
        );

        return $blocks;
    }
}
