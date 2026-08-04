import { Container } from '@/components/public/container';
import { Pagination } from '@/components/public/pagination';
import type { PaginationLink } from '@/components/public/pagination';
import { PostCard } from '@/components/public/post-card';
import { PublicHero } from '@/components/public/public-hero';
import { Reveal } from '@/components/public/reveal';
import { Section } from '@/components/public/section';
import { SeoHead } from '@/components/public/seo-head';
import * as blog from '@/routes/blog';
import type { CmsPage, CmsPost } from '@/types';

type BlogIndexProps = {
    page?: CmsPage | null;
    posts: {
        data: CmsPost[];
        links: PaginationLink[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
};

export default function BlogIndex({ page, posts }: BlogIndexProps) {
    const title =
        page?.title ??
        'Criterio técnico para anticipar obligaciones ambientales';
    const excerpt =
        page?.excerpt ??
        'Análisis y recursos sobre normativa, sostenibilidad, auditoría y gestión ambiental.';

    return (
        <>
            <SeoHead
                title={page?.seoTitle ?? 'Recursos'}
                description={page?.seoDescription ?? excerpt}
                image={page?.ogImage}
                canonical={
                    posts.current_page > 1
                        ? blog.index({ query: { page: posts.current_page } })
                              .url
                        : blog.index().url
                }
                next={posts.next_page_url}
                previous={posts.prev_page_url}
            />
            <PublicHero as="header">
                <Container className="py-16 sm:py-20 lg:py-24">
                    <p className="text-xs font-semibold tracking-[0.16em] text-podarcis-green uppercase">
                        Recursos
                    </p>
                    <h1 className="mt-5 max-w-4xl text-4xl leading-tight font-semibold text-balance sm:text-5xl lg:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                        {excerpt}
                    </p>
                </Container>
            </PublicHero>

            {posts.data.length > 0 && (
                <Section>
                    <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </Reveal>
                    <Pagination links={posts.links} />
                </Section>
            )}
        </>
    );
}
