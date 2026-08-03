<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Illuminate\Translation\PotentiallyTranslatedString;

class LinkedInUrl implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || filter_var($value, FILTER_VALIDATE_URL) === false) {
            $fail('El campo :attribute debe contener una URL válida de LinkedIn.');

            return;
        }

        $scheme = parse_url($value, PHP_URL_SCHEME);
        $host = parse_url($value, PHP_URL_HOST);

        if (
            ! is_string($scheme)
            || ! in_array(Str::lower($scheme), ['http', 'https'], true)
            || ! is_string($host)
        ) {
            $fail('El campo :attribute debe contener una URL válida de LinkedIn.');

            return;
        }

        $normalizedHost = Str::lower($host);

        if ($normalizedHost !== 'linkedin.com' && ! Str::endsWith($normalizedHost, '.linkedin.com')) {
            $fail('El campo :attribute debe pertenecer al dominio linkedin.com.');
        }
    }
}
