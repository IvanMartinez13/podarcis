import { ArrowRight } from 'lucide-react';

import { Container } from '@/components/public/container';
import { PublicLink } from '@/components/public/public-link';
import { Button } from '@/components/ui/button';

type CTASectionProps = {
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    title: string;
};

function CTASection({
    description,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    title,
}: CTASectionProps) {
    return (
        <section
            id="contacto"
            className="relative overflow-hidden bg-podarcis-navy-dark py-16 text-white sm:py-20"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,227,49,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_48%)]" />
            <div className="absolute right-10 bottom-8 hidden h-36 w-36 rounded-full border border-podarcis-green/20 lg:block" />
            <Container>
                <div className="relative grid gap-8 rounded-2xl border border-white/12 bg-white/6 p-7 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-11">
                    <div className="max-w-3xl">
                        <p className="text-sm font-semibold text-podarcis-green">
                            Contacto
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-base leading-7 text-white/75 sm:text-lg">
                            {description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                        <Button
                            asChild
                            className="bg-podarcis-green text-podarcis-navy shadow-lg shadow-podarcis-green/25 transition duration-300 hover:-translate-y-0.5 hover:bg-podarcis-green/90"
                            size="lg"
                        >
                            <PublicLink href={primaryHref}>
                                {primaryLabel}
                                <ArrowRight
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </PublicLink>
                        </Button>
                        {secondaryHref && secondaryLabel && (
                            <Button
                                asChild
                                className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                                size="lg"
                                variant="outline"
                            >
                                <PublicLink href={secondaryHref}>
                                    {secondaryLabel}
                                </PublicLink>
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}

export { CTASection };
