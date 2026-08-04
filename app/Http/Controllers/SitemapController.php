<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use App\Support\PublicUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class SitemapController extends Controller
{
    public function __invoke(PublicUrl $urls): Response
    {
        $models = collect()
            ->concat(Page::query()->published()->get())
            ->concat(Service::query()->published()->get())
            ->concat(Post::query()->published()->get())
            ->concat(SuccessCase::query()->published()->get());

        return response()
            ->view('sitemap', [
                'urls' => collect($this->urls($models, $urls))->concat([
                    ['location' => route('legal.notice'), 'lastModified' => null],
                    ['location' => route('legal.privacy'), 'lastModified' => null],
                    ['location' => route('legal.cookies'), 'lastModified' => null],
                ])->unique('location')->sortBy('location')->values(),
            ])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * @param  Collection<int, Model>  $models
     * @return array<int, array{location: string, lastModified: string|null}>
     */
    private function urls(Collection $models, PublicUrl $urls): array
    {
        return $models
            ->map(fn (Model $model): array => [
                'location' => $urls->for($model),
                'lastModified' => ($updatedAt = $model->getAttribute('updated_at')) instanceof Carbon
                    ? $updatedAt->toAtomString()
                    : null,
            ])
            ->unique('location')
            ->sortBy('location')
            ->values()
            ->all();
    }
}
