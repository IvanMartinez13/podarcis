<?php

$isProduction = env('APP_ENV', 'production') === 'production';

return [
    'name' => env('PODARCIS_ADMIN_NAME', $isProduction ? null : 'Administrador PODARCIS'),
    'email' => env('PODARCIS_ADMIN_EMAIL', $isProduction ? null : 'admin@podarcis.test'),
    'password' => env('PODARCIS_ADMIN_PASSWORD', $isProduction ? null : 'change-me-local-only'),
];
