<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\SuccessCase;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<SuccessCase>
 */
class SuccessCaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'client_name' => fake()->company(),
            'sector' => fake()->randomElement(['Industria', 'Obra civil', 'Servicios', 'Administracion']),
            'challenge' => fake()->paragraph(),
            'solution' => fake()->paragraph(),
            'result' => fake()->paragraph(),
            'featured_image' => null,
            'service_id' => Service::factory(),
            'status' => 'draft',
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now()->subDay(),
        ]);
    }
}
