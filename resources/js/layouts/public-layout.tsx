import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { home } from '@/routes';
import * as blog from '@/routes/blog';
import * as contact from '@/routes/contact';
import * as legal from '@/routes/legal';
import * as pages from '@/routes/pages';
import * as services from '@/routes/services';
import * as successCases from '@/routes/success-cases';
import type { SharedPageProps, SiteSettings } from '@/types';

const fallbackSite: SiteSettings = {
    brandDescription:
        'Consultoría ambiental, calidad, sostenibilidad y herramientas digitales para tomar decisiones con rigor.',
    navigation: [
        { id: 'home', label: 'Inicio', href: home().url },
        {
            id: 'services',
            label: 'Servicios',
            href: services.index().url,
        },
        {
            id: 'cases',
            label: 'Casos de éxito',
            href: successCases.index().url,
        },
        { id: 'blog', label: 'Recursos', href: blog.index().url },
        {
            id: 'about',
            label: 'Quiénes somos',
            href: pages.about().url,
        },
        { id: 'contact', label: 'Contacto', href: contact.index().url },
    ],
    headerCta: {
        id: 'header-cta',
        label: 'Hablemos de tu proyecto',
        href: contact.index().url,
    },
    contact: {},
    socialLinks: [],
    footerGroups: [
        {
            id: 'services',
            title: 'Servicios',
            links: [
                {
                    label: 'Todos los servicios',
                    href: services.index().url,
                },
                {
                    label: 'Casos de éxito',
                    href: successCases.index().url,
                },
            ],
        },
        {
            id: 'company',
            title: 'Empresa',
            links: [
                { label: 'Quiénes somos', href: pages.about().url },
                { label: 'Contacto', href: contact.index().url },
            ],
        },
        {
            id: 'resources',
            title: 'Recursos',
            links: [
                { label: 'Blog', href: blog.index().url },
                { label: 'Aviso legal', href: legal.notice().url },
                {
                    label: 'Política de privacidad',
                    href: legal.privacy().url,
                },
                {
                    label: 'Política de cookies',
                    href: legal.cookies().url,
                },
            ],
        },
    ],
};

export default function PublicLayout({ children }: PropsWithChildren) {
    const { site = fallbackSite } = usePage<SharedPageProps>().props;

    return (
        <div className="min-h-screen overflow-x-clip bg-white text-slate-950 selection:bg-podarcis-green selection:text-podarcis-ink">
            <SiteHeader cta={site.headerCta} navigation={site.navigation} />
            <main>{children}</main>
            <SiteFooter site={site} />
        </div>
    );
}
