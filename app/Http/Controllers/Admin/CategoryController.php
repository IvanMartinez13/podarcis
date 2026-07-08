<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => Category::query()
                ->withCount('posts')
                ->orderBy('type')
                ->orderBy('name')
                ->get()
                ->map(fn (Category $category): array => $this->categoryIndexData($category)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/categories/create', [
            'category' => $this->categoryFormDefaults(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::query()->create($request->validated());

        return to_route('admin.categories.index')->with('success', 'Categoría creada correctamente.');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $this->categoryFormData($category),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update($request->validated());

        return to_route('admin.categories.index')->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->posts()->exists()) {
            return back()->with('error', 'No puedes eliminar una categoría con artículos asociados.');
        }

        $category->delete();

        return to_route('admin.categories.index')->with('success', 'Categoría eliminada correctamente.');
    }

    /**
     * @return array<string, mixed>
     */
    private function categoryIndexData(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'type' => $category->type,
            'postsCount' => $category->posts_count,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function categoryFormData(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'type' => $category->type,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function categoryFormDefaults(): array
    {
        return [
            'id' => null,
            'name' => '',
            'slug' => '',
            'description' => '',
            'type' => 'post',
        ];
    }
}
