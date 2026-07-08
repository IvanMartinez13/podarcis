import { Head, Link, router } from '@inertiajs/react';
import { Edit3, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminTable } from '@/components/admin/admin-table';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as posts from '@/routes/admin/posts';

type AdminPost = {
    id: number;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    previewUrl: string | null;
    category: { name: string } | null;
    author: { name: string } | null;
};

type PostCategory = {
    id: number;
    name: string;
};

type PostsIndexProps = {
    posts: AdminPost[];
    categories: PostCategory[];
    filters: {
        search: string;
        status: string;
        category_id: string;
    };
};

export default function PostsIndex({
    posts: items,
    categories,
    filters,
}: PostsIndexProps) {
    function updateFilter(
        key: keyof PostsIndexProps['filters'],
        value: string,
    ) {
        router.get(
            posts.index().url,
            { ...filters, [key]: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function destroyPost(post: AdminPost) {
        if (!window.confirm(`¿Eliminar el post "${post.title}"?`)) {
            return;
        }

        router.delete(posts.destroy({ post: post.slug }).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Posts" />

            <div className="grid gap-8">
                <AdminPageHeader
                    actions={
                        <Button
                            asChild
                            className="bg-[#163247] text-white hover:bg-[#0f2638]"
                        >
                            <Link href={posts.create()}>
                                <Plus className="size-4" />
                                Nuevo post
                            </Link>
                        </Button>
                    }
                    title="Posts"
                    description="Gestiona artículos del blog y noticias corporativas."
                />

                <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 md:grid-cols-[1fr_180px_220px] dark:border-white/10 dark:bg-slate-950">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            placeholder="Buscar por título o slug"
                            value={filters.search}
                            onChange={(event) =>
                                updateFilter('search', event.target.value)
                            }
                        />
                    </div>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={filters.status}
                        onChange={(event) =>
                            updateFilter('status', event.target.value)
                        }
                    >
                        <option value="">Todos</option>
                        <option value="published">Publicado</option>
                        <option value="draft">Borrador</option>
                    </select>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={filters.category_id}
                        onChange={(event) =>
                            updateFilter('category_id', event.target.value)
                        }
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </section>

                <AdminTable
                    columns={[
                        'Post',
                        'Categoría',
                        'Estado',
                        'Autor',
                        'Publicado',
                        'Acciones',
                    ]}
                    empty="Todavía no hay posts con estos filtros."
                    isEmpty={items.length === 0}
                >
                    {items.map((post) => (
                        <tr
                            className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                            key={post.id}
                        >
                            <td className="px-5 py-4">
                                <p className="font-medium text-[#163247] dark:text-white">
                                    {post.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    /{post.slug}
                                </p>
                            </td>
                            <td className="px-5 py-4">
                                {post.category?.name ?? 'Sin categoría'}
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={post.status} />
                            </td>
                            <td className="px-5 py-4">
                                {post.author?.name ?? 'Sin autor'}
                            </td>
                            <td className="px-5 py-4">
                                {post.publishedAt ?? 'Sin fecha'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {post.previewUrl && (
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <a
                                                href={post.previewUrl}
                                                target="_blank"
                                            >
                                                <Eye className="size-4" />
                                                Ver
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild size="sm" variant="outline">
                                        <Link
                                            href={posts.edit({
                                                post: post.slug,
                                            })}
                                        >
                                            <Edit3 className="size-4" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <Button
                                        onClick={() => destroyPost(post)}
                                        size="sm"
                                        type="button"
                                        variant="destructive"
                                    >
                                        <Trash2 className="size-4" />
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            </div>
        </>
    );
}
