<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $name = config('admin.name');
        $email = config('admin.email');
        $password = config('admin.password');

        if (! is_string($name) || blank($name) || ! is_string($email) || blank($email) || ! is_string($password) || blank($password)) {
            if (app()->isProduction()) {
                throw new RuntimeException('Define PODARCIS_ADMIN_NAME, PODARCIS_ADMIN_EMAIL y PODARCIS_ADMIN_PASSWORD antes de ejecutar los seeders en producción.');
            }

            return;
        }

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $password,
            ],
        );

        if ($user->wasRecentlyCreated) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }
    }
}
