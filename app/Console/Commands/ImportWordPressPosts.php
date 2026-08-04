<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use App\Support\CmsHtmlSanitizer;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

#[Signature('seo:import-wordpress-posts {--source=https://www.podarcis.com : URL of the WordPress site}')]
#[Description('Import published WordPress articles into the local CMS without duplicating slugs')]
class ImportWordPressPosts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $source = rtrim((string) $this->option('source'), '/');
        $client = Http::acceptJson()->timeout(30)->retry(3, 500);
        $page = 1;
        $totalPages = 1;
        $imported = 0;

        do {
            $response = $client->get($source.'/wp-json/wp/v2/posts', [
                'per_page' => 100,
                'page' => $page,
                '_embed' => 1,
                'status' => 'publish',
            ])->throw();

            $totalPages = max(1, (int) $response->header('X-WP-TotalPages'));

            foreach ($response->json() as $wordpressPost) {
                if (is_array($wordpressPost) && $this->import($wordpressPost)) {
                    $imported++;
                }
            }

            $page++;
        } while ($page <= $totalPages);

        $this->info("Imported or updated {$imported} published articles.");

        return self::SUCCESS;
    }

    /** @param array<string, mixed> $wordpressPost */
    private function import(array $wordpressPost): bool
    {
        $slug = Str::slug((string) ($wordpressPost['slug'] ?? ''));

        if ($slug === '' || in_array($slug, ['hola-mundo', 'podarcis-adquiere-un-club-de-futbol'], true)) {
            return false;
        }

        $title = $this->plainText(data_get($wordpressPost, 'title.rendered'));
        $content = CmsHtmlSanitizer::cleanNullable(data_get($wordpressPost, 'content.rendered'));

        if ($title === '' || $content === null) {
            return false;
        }

        $excerpt = $this->plainText(data_get($wordpressPost, 'excerpt.rendered'));
        $category = $this->category($wordpressPost);
        $featuredImage = data_get($wordpressPost, '_embedded.wp:featuredmedia.0.source_url');

        Post::query()->updateOrCreate(['slug' => $slug], [
            'title' => $title,
            'excerpt' => $excerpt !== '' ? Str::limit($excerpt, 320) : Str::limit(strip_tags($content), 320),
            'content' => $content,
            'featured_image' => is_string($featuredImage) ? $featuredImage : null,
            'featured_image_alt' => $this->plainText(data_get($wordpressPost, '_embedded.wp:featuredmedia.0.alt_text')) ?: $title,
            'category_id' => $category?->id,
            'author_id' => User::query()->value('id'),
            'seo_title' => Str::limit($title, 60, ''),
            'seo_description' => Str::limit($excerpt !== '' ? $excerpt : strip_tags($content), 155, ''),
            'status' => 'published',
            'published_at' => Carbon::parse((string) ($wordpressPost['date_gmt'] ?? $wordpressPost['date'] ?? now()))->utc(),
        ]);

        return true;
    }

    /** @param array<string, mixed> $wordpressPost */
    private function category(array $wordpressPost): ?Category
    {
        $terms = data_get($wordpressPost, '_embedded.wp:term', []);

        foreach (is_array($terms) ? $terms : [] as $termGroup) {
            foreach (is_array($termGroup) ? $termGroup : [] as $term) {
                if (! is_array($term) || ($term['taxonomy'] ?? null) !== 'category') {
                    continue;
                }

                $name = $this->plainText($term['name'] ?? null);
                $slug = Str::slug((string) ($term['slug'] ?? $name));

                if ($name !== '' && $slug !== '') {
                    return Category::query()->firstOrCreate(['slug' => $slug], [
                        'name' => $name,
                        'type' => 'post',
                    ]);
                }
            }
        }

        return null;
    }

    private function plainText(mixed $value): string
    {
        return trim(html_entity_decode(strip_tags(is_string($value) ? $value : ''), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }
}
