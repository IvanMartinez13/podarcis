<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Support\CmsImageStorage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function about(): Response
    {
        $page = Page::query()->published()->where('slug', 'quienes-somos')->firstOrFail();

        return Inertia::render('pages/about', [
            'page' => [
                'title' => $page->title,
                'slug' => $page->slug,
                'excerpt' => $page->excerpt,
                'content' => $page->content,
                'blocks' => $this->displayBlocks($page->blocks),
                'seoTitle' => $page->seo_title,
                'seoDescription' => $page->seo_description,
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $blocks
     * @return array<string, mixed>|null
     */
    private function displayBlocks(?array $blocks): ?array
    {
        if ($blocks === null) {
            return null;
        }

        if (is_string($blocks['teamCoverImage'] ?? null)) {
            $blocks['teamCoverImage'] = $this->images->url($blocks['teamCoverImage']);
        }

        $members = is_array($blocks['teamMembers'] ?? null) ? $blocks['teamMembers'] : [];

        $blocks['teamMembers'] = collect($members)
            ->map(function (array $member): array {
                if (is_string($member['avatarUrl'] ?? null)) {
                    $member['avatarUrl'] = $this->images->url($member['avatarUrl']);
                }

                return $this->teamMemberData($member);
            })
            ->values()
            ->all();

        return $blocks;
    }

    /**
     * @param  array<string, mixed>  $member
     * @return array<string, mixed>
     */
    private function teamMemberData(array $member): array
    {
        return [
            'name' => $member['name'] ?? '',
            'title' => $member['title'] ?? null,
            'handle' => $member['handle'] ?? null,
            'status' => $member['status'] ?? null,
            'contactText' => $member['contactText'] ?? null,
            'avatarUrl' => $member['avatarUrl'] ?? null,
        ];
    }
}
