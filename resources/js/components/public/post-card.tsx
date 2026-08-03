import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CmsPost } from '@/types';

export function PostCard({ post }: { post: CmsPost }) {
    const date = post.publishedAt
        ? new Intl.DateTimeFormat('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          }).format(new Date(post.publishedAt))
        : null;

    return (
        <Link
            href={post.href}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_50px_-36px_rgba(7,25,35,.4)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-38px_rgba(7,25,35,.45)] focus-visible:ring-3 focus-visible:ring-podarcis-green/40 focus-visible:outline-none motion-reduce:hover:translate-y-0"
        >
            {post.featuredImage ? (
                <div className="overflow-hidden">
                    <img
                        src={post.featuredImage}
                        alt={post.imageAlt ?? ''}
                        className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            ) : (
                <div className="aspect-[16/9] bg-[radial-gradient(circle_at_75%_25%,rgba(37,227,49,.22),transparent_28%),linear-gradient(145deg,#f4f7f8,#dfeaec)]" />
            )}
            <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-podarcis-muted">
                    <Badge className="bg-emerald-50 text-emerald-800">
                        {post.category?.name ?? 'Actualidad'}
                    </Badge>
                    {date && <span>{date}</span>}
                </div>
                <h3 className="mt-4 text-xl leading-snug font-semibold text-balance text-podarcis-navy">
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-podarcis-muted">
                        {post.excerpt}
                    </p>
                )}
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-podarcis-navy transition group-hover:text-emerald-700">
                    Leer artículo
                    <ArrowRight
                        className="size-4 transition group-hover:translate-x-1"
                        aria-hidden="true"
                    />
                </span>
            </div>
        </Link>
    );
}
