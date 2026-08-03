<?php

namespace App\Models;

use Database\Factories\SiteSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $singleton_key
 * @property string|null $brand_description
 * @property array<int, array<string, mixed>>|null $navigation
 * @property array<string, mixed>|null $header_cta
 * @property array<string, mixed>|null $contact
 * @property array<int, array<string, mixed>>|null $social_links
 * @property array<int, array<string, mixed>>|null $footer_groups
 */
#[Fillable(['singleton_key', 'brand_description', 'navigation', 'header_cta', 'contact', 'social_links', 'footer_groups'])]
class SiteSetting extends Model
{
    /** @use HasFactory<SiteSettingFactory> */
    use HasFactory;

    protected $attributes = [
        'singleton_key' => 'site',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'navigation' => 'array',
            'header_cta' => 'array',
            'contact' => 'array',
            'social_links' => 'array',
            'footer_groups' => 'array',
        ];
    }
}
