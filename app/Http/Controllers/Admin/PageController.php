<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Models\Page;
use App\Support\CmsImageStorage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private CmsImageStorage $images) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
        ];

        return Inertia::render('admin/pages/index', [
            'filters' => $filters,
            'pages' => Page::query()
                ->when($filters['search'] !== '', function (Builder $query) use ($filters): void {
                    $query->where(function (Builder $query) use ($filters): void {
                        $query
                            ->where('title', 'like', "%{$filters['search']}%")
                            ->orWhere('slug', 'like', "%{$filters['search']}%");
                    });
                })
                ->when(in_array($filters['status'], ['draft', 'published'], true), function (Builder $query) use ($filters): void {
                    $query->where('status', $filters['status']);
                })
                ->orderBy('title')
                ->get()
                ->map(fn (Page $page): array => $this->pageIndexData($page)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/pages/create', [
            'page' => $this->pageFormDefaults(),
        ]);
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $data = $request->safe()->except([
            'og_image_upload',
            'remove_og_image',
            'team_cover_image_upload',
            'remove_team_cover_image',
            'team_member_avatar_uploads',
            'remove_team_member_avatars',
            'hero_image_upload',
            'remove_hero_image',
            'digital_image_upload',
            'remove_digital_image',
            'success_cases_background_image_upload',
            'remove_success_cases_background_image',
            'testimonials_background_image_upload',
            'remove_testimonials_background_image',
        ]);

        if ($request->hasFile('og_image_upload')) {
            $data['og_image'] = $this->images->store($request->file('og_image_upload'), 'cms/pages');
        } elseif (blank($data['og_image'] ?? null)) {
            $data['og_image'] = null;
        }

        $data['blocks'] = $this->processBlocks($request, $data['blocks'] ?? null, null);

        Page::query()->create($data);

        return to_route('admin.pages.index')->with('success', 'Página creada correctamente.');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('admin/pages/edit', [
            'page' => $this->pageFormData($page),
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $data = $request->safe()->except([
            'og_image_upload',
            'remove_og_image',
            'team_cover_image_upload',
            'remove_team_cover_image',
            'team_member_avatar_uploads',
            'remove_team_member_avatars',
            'hero_image_upload',
            'remove_hero_image',
            'digital_image_upload',
            'remove_digital_image',
            'success_cases_background_image_upload',
            'remove_success_cases_background_image',
            'testimonials_background_image_upload',
            'remove_testimonials_background_image',
        ]);

        if ($request->hasFile('og_image_upload')) {
            $data['og_image'] = $this->images->store($request->file('og_image_upload'), 'cms/pages', $page->og_image);
        } elseif ($request->boolean('remove_og_image')) {
            $this->images->delete($page->og_image);
            $data['og_image'] = null;
        } else {
            unset($data['og_image']);
        }

        $data['blocks'] = $this->processBlocks($request, $data['blocks'] ?? null, $page->blocks);

        $page->update($data);

        return to_route('admin.pages.index')->with('success', 'Página actualizada correctamente.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->images->delete($page->og_image);
        $this->deleteBlockImages($page->blocks);

        $page->delete();

        return to_route('admin.pages.index')->with('success', 'Página eliminada correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function pageIndexData(Page $page): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'status' => $page->status,
            'publishedAt' => $page->published_at?->format('d/m/Y H:i'),
            'previewUrl' => $page->status === 'published' ? $this->previewUrl($page) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function pageFormData(Page $page): array
    {
        return [
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'excerpt' => $page->excerpt,
            'content' => $page->content,
            'blocks' => $this->displayBlocks($page->blocks),
            'seoTitle' => $page->seo_title,
            'seoDescription' => $page->seo_description,
            'ogImage' => $this->images->url($page->og_image),
            'status' => $page->status,
            'publishedAt' => $page->published_at?->format('Y-m-d\TH:i'),
            'previewUrl' => $page->status === 'published' ? $this->previewUrl($page) : null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function pageFormDefaults(): array
    {
        return [
            'id' => null,
            'title' => '',
            'slug' => '',
            'excerpt' => '',
            'content' => '',
            'blocks' => null,
            'seoTitle' => '',
            'seoDescription' => '',
            'ogImage' => '',
            'status' => 'draft',
            'publishedAt' => '',
            'previewUrl' => null,
        ];
    }

    private function previewUrl(Page $page): ?string
    {
        return match ($page->slug) {
            'quienes-somos' => route('pages.about'),
            'contacto' => route('contact.index'),
            'soluciones-digitales' => route('digital-solutions.index'),
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>|null  $blocks
     * @param  array<string, mixed>|null  $oldBlocks
     * @return array<string, mixed>|null
     */
    private function processBlocks(Request $request, ?array $blocks, ?array $oldBlocks): ?array
    {
        $hasFixedBlockUpload = $request->hasAny([
            'hero_image_upload',
            'digital_image_upload',
            'success_cases_background_image_upload',
            'testimonials_background_image_upload',
        ]);

        if ($blocks === null && ! $hasFixedBlockUpload) {
            return null;
        }

        $blocks ??= [];
        $oldBlocks ??= [];
        $blocks = $this->processFixedBlockImage($request, $blocks, $oldBlocks, 'hero.image', 'hero_image_upload', 'remove_hero_image', 'cms/pages/home/hero');
        $blocks = $this->processFixedBlockImage($request, $blocks, $oldBlocks, 'digital.image', 'digital_image_upload', 'remove_digital_image', 'cms/pages/home/digital');
        $blocks = $this->processFixedBlockImage(
            $request,
            $blocks,
            $oldBlocks,
            'successCases.backgroundImage',
            'success_cases_background_image_upload',
            'remove_success_cases_background_image',
            'cms/pages/home/success-cases',
        );
        $blocks = $this->processFixedBlockImage(
            $request,
            $blocks,
            $oldBlocks,
            'testimonials.backgroundImage',
            'testimonials_background_image_upload',
            'remove_testimonials_background_image',
            'cms/pages/home/testimonials',
        );

        $oldTeamCoverImage = is_string($oldBlocks['teamCoverImage'] ?? null) ? $oldBlocks['teamCoverImage'] : null;

        if ($request->hasFile('team_cover_image_upload')) {
            $blocks['teamCoverImage'] = $this->images->store($request->file('team_cover_image_upload'), 'cms/pages/team', $oldTeamCoverImage);
        } elseif ($request->boolean('remove_team_cover_image')) {
            $this->images->delete($oldTeamCoverImage);
            $blocks['teamCoverImage'] = null;
        } elseif ($oldTeamCoverImage !== null) {
            $blocks['teamCoverImage'] = $oldTeamCoverImage;
        }

        $oldMembers = is_array($oldBlocks['teamMembers'] ?? null) ? $oldBlocks['teamMembers'] : [];
        $members = is_array($blocks['teamMembers'] ?? null) ? $blocks['teamMembers'] : [];

        $blocks['teamMembers'] = collect($members)
            ->map(function (array $member, int $index) use ($request, $oldMembers): array {
                $oldMember = is_array($oldMembers[$index] ?? null) ? $oldMembers[$index] : [];
                $oldAvatar = is_string($oldMember['avatarUrl'] ?? null) ? $oldMember['avatarUrl'] : null;
                $avatarUploadPath = "team_member_avatar_uploads.{$index}";

                if ($request->hasFile($avatarUploadPath)) {
                    $member['avatarUrl'] = $this->images->store($request->file($avatarUploadPath), 'cms/pages/team/avatars', $oldAvatar, preservePng: true);
                } elseif ((bool) data_get($request->input(), "remove_team_member_avatars.{$index}")) {
                    $this->images->delete($oldAvatar);
                    $member['avatarUrl'] = null;
                } elseif ($oldAvatar !== null) {
                    $member['avatarUrl'] = $oldAvatar;
                }

                return $member;
            })
            ->values()
            ->all();

        return $blocks;
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

        foreach (['hero.image', 'digital.image', 'successCases.backgroundImage', 'testimonials.backgroundImage'] as $path) {
            $image = data_get($blocks, $path);

            if (is_string($image)) {
                data_set($blocks, $path, $this->images->url($image));
            }
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
     * @param  array<string, mixed>|null  $blocks
     */
    private function deleteBlockImages(?array $blocks): void
    {
        if ($blocks === null) {
            return;
        }

        $this->images->delete(is_string($blocks['teamCoverImage'] ?? null) ? $blocks['teamCoverImage'] : null);

        foreach (['hero.image', 'digital.image', 'successCases.backgroundImage', 'testimonials.backgroundImage', 'finalCta.image'] as $path) {
            $image = data_get($blocks, $path);
            $this->images->delete(is_string($image) ? $image : null);
        }

        foreach ($blocks['teamMembers'] ?? [] as $member) {
            if (is_array($member)) {
                $this->images->delete(is_string($member['avatarUrl'] ?? null) ? $member['avatarUrl'] : null);
            }
        }
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
            'linkedinUrl' => $member['linkedinUrl'] ?? null,
            'avatarUrl' => $member['avatarUrl'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $blocks
     * @param  array<string, mixed>  $oldBlocks
     * @return array<string, mixed>
     */
    private function processFixedBlockImage(
        Request $request,
        array $blocks,
        array $oldBlocks,
        string $blockPath,
        string $uploadField,
        string $removeField,
        string $directory,
    ): array {
        $oldImage = data_get($oldBlocks, $blockPath);
        $oldImage = is_string($oldImage) ? $oldImage : null;

        if ($request->hasFile($uploadField)) {
            data_set($blocks, $blockPath, $this->images->store($request->file($uploadField), $directory, $oldImage));
        } elseif ($request->boolean($removeField)) {
            $this->images->delete($oldImage);
            data_set($blocks, $blockPath, null);
        } elseif ($oldImage !== null) {
            data_set($blocks, $blockPath, $oldImage);
        }

        return $blocks;
    }
}
