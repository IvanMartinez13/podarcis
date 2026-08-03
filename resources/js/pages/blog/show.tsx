import { Link } from '@inertiajs/react';

import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
import { RichText } from '@/components/public/rich-text';
import { SeoHead } from '@/components/public/seo-head';
import { Badge } from '@/components/ui/badge';
import * as blog from '@/routes/blog';
import * as contact from '@/routes/contact';
import type { CmsPost } from '@/types';

type BlogShowProps = {
    post: CmsPost;
};

export default function BlogShow({ post }: BlogShowProps) {
    return (
        <>
            <SeoHead
                title={post.seoTitle ?? post.title}
                description={post.seoDescription ?? post.excerpt}
                image={post.featuredImage}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: post.title,
                    description: post.seoDescription ?? post.excerpt,
                    datePublished: post.publishedAt,
                    author: post.author
                        ? { '@type': 'Person', name: post.author.name }
                        : { '@type': 'Organization', name: 'PODARCIS' },
                }}
            />

            <article>
                <PublicHero as="header">
                    <Container className="max-w-4xl py-16 sm:py-20 lg:py-24">
                        <Link
                            className="text-sm font-semibold text-podarcis-green"
                            href={blog.index()}
                        >
                            Blog
                        </Link>
                        <Badge className="mt-6 bg-white/5 text-white backdrop-blur-[2px]">
                            {post.category?.name ?? 'Artículo'}
                        </Badge>
                        <h1 className="mt-6 text-4xl font-semibold text-balance sm:text-5xl">
                            {post.title}
                        </h1>
                        <RichText
                            className="mt-6 text-lg leading-8 text-white/75 [&_a]:text-white [&_a]:decoration-white/50"
                            html={post.excerpt}
                        />
                    </Container>
                </PublicHero>

                <Container className="py-12 sm:py-16">
                    {post.featuredImage && (
                        <img
                            alt={post.imageAlt ?? ''}
                            className="aspect-[16/8] w-full rounded-3xl object-cover shadow-xl shadow-slate-950/10"
                            src={post.featuredImage}
                            width="1200"
                            height="600"
                            fetchPriority="high"
                        />
                    )}
                    <RichText
                        className="mx-auto mt-10 max-w-3xl text-lg leading-8 text-podarcis-muted"
                        html={post.content}
                    />
                </Container>
            </article>

            <CTASection
                title="¿Quieres aterrizar este criterio en tu organización?"
                description="PODARCIS puede ayudarte a convertir obligaciones y datos técnicos en un sistema de trabajo claro."
                primaryHref={contact.index().url}
                primaryLabel="Contactar"
            />
        </>
    );
}
