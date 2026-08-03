<?php

namespace App\Support;

use Mews\Purifier\Facades\Purifier;

class CmsHtmlSanitizer
{
    /**
     * @return array<string, mixed>
     */
    private static function strictConfig(): array
    {
        return [
            'HTML.Allowed' => 'p,br,strong,b,em,i,u,ul,ol,li,h2,h3,h4,blockquote,a[href|title|target|rel]',
            'CSS.AllowedProperties' => '',
            'URI.AllowedSchemes' => [
                'http' => true,
                'https' => true,
                'mailto' => true,
                'tel' => true,
            ],
            'AutoFormat.RemoveEmpty' => true,
            'Attr.AllowedFrameTargets' => ['_blank', '_self'],
            'HTML.SafeIframe' => false,
        ];
    }

    public static function cleanNullable(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $clean = trim(Purifier::clean($value, self::strictConfig()));

        if (self::isEffectivelyEmpty($clean)) {
            return null;
        }

        return $clean;
    }

    private static function isEffectivelyEmpty(string $html): bool
    {
        $normalized = str_replace(['&nbsp;', "\xc2\xa0"], ' ', $html);

        return trim(strip_tags($normalized)) === '';
    }
}
