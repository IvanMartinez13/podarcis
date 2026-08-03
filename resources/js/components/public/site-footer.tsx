import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

import logoWhite from '@/assets/logo-blanco.png';
import { Container } from '@/components/public/container';
import { PublicLink } from '@/components/public/public-link';
import type { SiteSettings } from '@/types';

export function SiteFooter({ site }: { site: SiteSettings }) {
    const contactItems = [
        site.contact?.email
            ? {
                  icon: Mail,
                  label: site.contact.email,
                  href: `mailto:${site.contact.email}`,
              }
            : null,
        site.contact?.phone
            ? {
                  icon: Phone,
                  label: site.contact.phone,
                  href: `tel:${site.contact.phone.replace(/\s/g, '')}`,
              }
            : null,
    ].filter(Boolean);

    return (
        <footer className="relative overflow-hidden bg-podarcis-ink text-white">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-podarcis-green/70 to-transparent" />
            <div className="pointer-events-none absolute -top-48 right-0 size-96 rounded-full bg-podarcis-green/8 blur-3xl" />
            <Container className="relative py-14 sm:py-18">
                <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_2fr]">
                    <div>
                        <img
                            src={logoWhite}
                            alt="PODARCIS Consultores Auditores"
                            className="h-auto w-52"
                            width="634"
                            height="192"
                        />
                        <p className="mt-5 max-w-md text-sm leading-6 text-white/62">
                            {site.brandDescription}
                        </p>
                        <div className="mt-6 grid gap-3 text-sm text-white/70">
                            {contactItems.map((item) => {
                                if (!item) {
                                    return null;
                                }

                                const Icon = item.icon;

                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 transition hover:text-white"
                                    >
                                        <Icon
                                            className="size-4 text-podarcis-green"
                                            aria-hidden="true"
                                        />
                                        {item.label}
                                    </a>
                                );
                            })}
                            {site.contact?.address && (
                                <p className="flex items-start gap-3">
                                    <MapPin
                                        className="mt-0.5 size-4 shrink-0 text-podarcis-green"
                                        aria-hidden="true"
                                    />
                                    {site.contact.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-9 sm:grid-cols-2 xl:grid-cols-3">
                        {site.footerGroups.map((group) => (
                            <div key={group.id ?? group.title}>
                                <h2 className="text-sm font-semibold text-white">
                                    {group.title}
                                </h2>
                                <ul className="mt-4 grid gap-2.5 text-sm text-white/60">
                                    {group.links.map((link) => (
                                        <li key={link.id ?? link.href}>
                                            <PublicLink
                                                href={link.href}
                                                className="transition hover:text-podarcis-green"
                                            >
                                                {link.label}
                                            </PublicLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-5 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} PODARCIS SL. Todos los
                        derechos reservados.
                    </p>
                    {site.socialLinks.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {site.socialLinks.map((link) => (
                                <PublicLink
                                    key={link.id ?? link.href}
                                    href={link.href}
                                    className="inline-flex items-center gap-1.5 transition hover:text-white"
                                >
                                    {link.label}
                                    <ArrowUpRight
                                        className="size-3"
                                        aria-hidden="true"
                                    />
                                </PublicLink>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </footer>
    );
}
