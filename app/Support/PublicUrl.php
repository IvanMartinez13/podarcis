<?php

namespace App\Support;

use App\Models\Page;
use App\Models\Post;
use App\Models\Service;
use App\Models\SuccessCase;
use Illuminate\Database\Eloquent\Model;

class PublicUrl
{
    public function for(Model $model): string
    {
        return match (true) {
            $model instanceof Service && $model->kind === 'digital' => route('digital-solutions.show', $model),
            $model instanceof Service => route('services.show', $model),
            $model instanceof Post => route('blog.show', $model),
            $model instanceof SuccessCase => route('success-cases.show', $model),
            $model instanceof Page => $this->page($model),
            default => throw new \InvalidArgumentException('Unsupported public model: '.$model::class),
        };
    }

    private function page(Page $page): string
    {
        return match ($page->slug) {
            'inicio' => route('home'),
            'servicios' => route('services.index'),
            'soluciones-digitales' => route('digital-solutions.index'),
            'blog' => route('blog.index'),
            'casos-de-exito' => route('success-cases.index'),
            'quienes-somos' => route('pages.about'),
            'contacto' => route('contact.index'),
            default => route('seo-landings.show', ['path' => $page->slug]),
        };
    }
}
