<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Illuminate\Translation\PotentiallyTranslatedString;

class SafePublicUrl implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('El campo :attribute debe contener una URL válida.');

            return;
        }

        if (Str::startsWith($value, '/') && ! Str::startsWith($value, '//')) {
            return;
        }

        $scheme = parse_url($value, PHP_URL_SCHEME);

        if (is_string($scheme) && in_array(Str::lower($scheme), ['http', 'https', 'mailto', 'tel'], true)) {
            return;
        }

        $fail('El campo :attribute debe ser una ruta interna o usar http, https, mailto o tel.');
    }
}
