import { Head, Link } from '@inertiajs/react';

import { Container } from '@/components/public/container';
import { CTASection } from '@/components/public/cta-section';
import { PublicHero } from '@/components/public/public-hero';
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
            <Head title={post.seoTitle ?? post.title}>
                {post.seoDescription && (
                    <meta
                        content={post.seoDescription}
                        head-key="description"
                        name="description"
                    />
                )}
            </Head>

            <article>
                <PublicHero as="header" className="py-16 sm:py-20">
                    <Container className="max-w-4xl">
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
                        <p className="mt-6 text-lg leading-8 text-white/75">
                            {post.excerpt}
                        </p>
                    </Container>
                </PublicHero>

                <Container className="py-12 sm:py-16">
                    <img
                        alt=""
                        className="aspect-[16/8] w-full rounded-lg object-cover shadow-xl shadow-slate-950/10"
                        src={
                            post.featuredImage ??
                            'https://placehold.co/1200x680/F4F7F8/163247?text=Blog+PODARCIS'
                        }
                    />
                    <div className="mx-auto mt-10 max-w-3xl text-lg leading-8 text-podarcis-muted">
                        {(post.content ?? '')
                            .split('\n')
                            .filter(Boolean)
                            .map((paragraph) => (
                                <p className="mt-6" key={paragraph}>
                                    {paragraph}
                                </p>
                            ))}
                    </div>
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
