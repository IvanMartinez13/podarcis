<?php

namespace App\Support;

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Models\Testimonial;
use Illuminate\Support\Str;

class PublicContentData
{
    public function __construct(
        private CmsImageStorage $images,
        private PublicUrl $urls,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function page(Page $page): array
    {
        return [
            'title' => $page->title,
            'slug' => $page->slug,
            'excerpt' => $page->excerpt,
            'content' => $page->content,
            'blocks' => $this->pageBlocks($page->blocks),
            'seoTitle' => $page->seo_title,
            'seoDescription' => $page->seo_description,
            'ogImage' => $this->image($page->og_image),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function service(Service $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'kind' => $service->kind,
            'isFeatured' => $service->is_featured,
            'excerpt' => $service->excerpt,
            'icon' => $service->icon,
            'featuredImage' => $this->image($service->featured_image),
            'imageAlt' => $service->featured_image_alt,
            'logoImage' => $this->image($service->logo_image),
            'logoImageAlt' => $service->logo_image_alt,
            'href' => $this->urls->for($service),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function post(Post $post): array
    {
        return [
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'featuredImage' => $this->image($post->featured_image),
            'imageAlt' => $post->featured_image_alt,
            'publishedAt' => $post->published_at?->toDateString(),
            'updatedAt' => $post->updated_at?->toDateString(),
            'href' => $this->urls->for($post),
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function successCase(SuccessCase $successCase): array
    {
        return [
            'title' => $successCase->title,
            'slug' => $successCase->slug,
            'clientName' => $this->clientName($successCase->client_name),
            'sector' => $successCase->sector,
            'excerpt' => $successCase->challenge ?: $successCase->solution,
            'result' => $successCase->result,
            'featuredImage' => $this->image($successCase->featured_image),
            'imageAlt' => $successCase->featured_image_alt,
            'href' => route('success-cases.show', $successCase),
            'service' => $successCase->service ? [
                'title' => $successCase->service->title,
                'slug' => $successCase->service->slug,
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function testimonial(Testimonial $testimonial): array
    {
        return [
            'name' => $testimonial->name,
            'position' => $testimonial->position,
            'company' => $testimonial->company,
            'quote' => $testimonial->quote,
            'avatar' => $this->image($testimonial->avatar),
        ];
    }

    public function image(?string $path): ?string
    {
        if ($path === null || Str::contains(Str::lower($path), 'placehold.co')) {
            return null;
        }

        return $this->images->url($path);
    }

    private function clientName(?string $clientName): ?string
    {
        if ($clientName === null || Str::lower(trim($clientName)) === 'cliente podarcis') {
            return null;
        }

        return $clientName;
    }

    /**
     * @param  array<string, mixed>|null  $blocks
     * @return array<string, mixed>|null
     */
    private function pageBlocks(?array $blocks): ?array
    {
        if ($blocks === null) {
            return null;
        }

        foreach (['hero', 'digital', 'finalCta'] as $section) {
            if (is_string($blocks[$section]['image'] ?? null)) {
                $blocks[$section]['image'] = $this->image($blocks[$section]['image']);
            }
        }

        if (is_string($blocks['testimonials']['backgroundImage'] ?? null)) {
            $blocks['testimonials']['backgroundImage'] = $this->image($blocks['testimonials']['backgroundImage']);
        }

        if (is_array($blocks['digital'] ?? null)) {
            $blocks['digital']['features'] ??= $blocks['digital']['benefits'] ?? [];
            $blocks['digital']['primaryCta'] ??= $blocks['digital']['cta'] ?? null;
            unset($blocks['digital']['benefits'], $blocks['digital']['cta']);
        }

        if (is_string($blocks['teamCoverImage'] ?? null)) {
            $blocks['teamCoverImage'] = $this->image($blocks['teamCoverImage']);
        }

        if (is_array($blocks['teamMembers'] ?? null)) {
            $blocks['teamMembers'] = array_map(function (mixed $member): mixed {
                if (! is_array($member)) {
                    return $member;
                }

                return [
                    'name' => $member['name'] ?? '',
                    'title' => $member['title'] ?? null,
                    'handle' => $member['handle'] ?? null,
                    'status' => $member['status'] ?? null,
                    'linkedinUrl' => $member['linkedinUrl'] ?? null,
                    'avatarUrl' => $this->image(
                        is_string($member['avatarUrl'] ?? null) ? $member['avatarUrl'] : null,
                    ),
                ];
            }, $blocks['teamMembers']);
        }

        return $blocks;
    }
}
