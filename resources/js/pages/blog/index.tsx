import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { EmptyState } from '@/components/public/empty-state';
import { Section } from '@/components/public/section';
import { Badge } from '@/components/ui/badge';
import type { CmsPost } from '@/types';

type BlogIndexProps = {
    posts: CmsPost[];
};

export default function BlogIndex({ posts }: BlogIndexProps) {
    return (
        <>
            <Head title="Blog" />

            <Section
                eyebrow="Blog"
                title="Criterio técnico para anticipar obligaciones ambientales y de calidad"
                description="Artículos publicados desde el CMS para convertir normativa, auditorías e indicadores en decisiones útiles."
                className="bg-podarcis-surface"
            >
                {posts.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Link
                                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                href={post.href}
                                key={post.slug}
                            >
                                <img
                                    alt=""
                                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
                                    src={
                                        post.featuredImage ??
                                        'https://placehold.co/900x620/F4F7F8/163247?text=Blog+PODARCIS'
                                    }
                                />
                                <div className="p-6">
                                    <Badge className="bg-podarcis-surface text-podarcis-navy">
                                        {post.category?.name ?? 'Blog'}
                                    </Badge>
                                    <h2 className="mt-4 text-xl font-semibold text-podarcis-navy">
                                        {post.title}
                                    </h2>
                                    <p className="mt-3 text-sm leading-6 text-podarcis-muted">
                                        {post.excerpt}
                                    </p>
                                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-podarcis-navy">
                                        Leer artículo
                                        <ArrowRight
                                            className="size-4 transition group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No hay artículos publicados"
                        description="Cuando el CMS tenga artículos publicados se mostrarán aquí."
                    />
                )}
            </Section>
        </>
    );
}
