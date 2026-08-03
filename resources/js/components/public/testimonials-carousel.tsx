import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CmsTestimonial } from '@/types';

type TestimonialsCarouselProps = {
    autoplay?: boolean;
    testimonials: CmsTestimonial[];
};

export function TestimonialsCarousel({
    autoplay = false,
    testimonials,
}: TestimonialsCarouselProps) {
    const [viewportRef, api] = useEmblaCarousel({
        align: 'start',
        loop: testimonials.length > 2,
    });
    const [selected, setSelected] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocusedWithin, setIsFocusedWithin] = useState(false);
    const paused = hasInteracted || isHovered || isFocusedWithin;

    const sync = useCallback(() => {
        if (!api) {
            return;
        }

        setSelected(api.selectedScrollSnap());
        setScrollSnaps(api.scrollSnapList());
    }, [api]);

    useEffect(() => {
        if (!api) {
            return;
        }

        const animationFrame = window.requestAnimationFrame(sync);
        const pauseAfterInteraction = () => setHasInteracted(true);
        api.on('select', sync)
            .on('reInit', sync)
            .on('pointerDown', pauseAfterInteraction);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            api.off('select', sync)
                .off('reInit', sync)
                .off('pointerDown', pauseAfterInteraction);
        };
    }, [api, sync]);

    useEffect(() => {
        if (
            !api ||
            !autoplay ||
            paused ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        const interval = window.setInterval(() => {
            if (document.visibilityState === 'visible') {
                api.scrollNext();
            }
        }, 6500);

        return () => window.clearInterval(interval);
    }, [api, autoplay, paused]);

    return (
        <div
            className="relative"
            role="region"
            aria-label="Testimonios de clientes"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocusedWithin(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsFocusedWithin(false);
                }
            }}
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                    setHasInteracted(true);
                    api?.scrollPrev();
                }

                if (event.key === 'ArrowRight') {
                    setHasInteracted(true);
                    api?.scrollNext();
                }
            }}
        >
            <div className="overflow-hidden" ref={viewportRef}>
                <div className="-ml-5 flex touch-pan-y">
                    {testimonials.map((testimonial) => (
                        <div
                            key={`${testimonial.name}-${testimonial.company}`}
                            className="min-w-0 flex-[0_0_100%] pl-5 md:flex-[0_0_50%] xl:flex-[0_0_33.333%]"
                        >
                            <article className="flex h-full min-h-80 flex-col rounded-2xl border border-white/12 bg-white p-7 text-podarcis-navy shadow-2xl shadow-black/10">
                                <Quote
                                    className="size-7 fill-podarcis-green/20 text-emerald-600"
                                    aria-hidden="true"
                                />
                                <blockquote className="mt-5 flex-1 text-base leading-7 text-slate-600">
                                    “{testimonial.quote}”
                                </blockquote>
                                <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    {testimonial.avatar ? (
                                        <img
                                            src={testimonial.avatar}
                                            alt=""
                                            className="size-11 rounded-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span
                                            className="flex size-11 items-center justify-center rounded-full bg-podarcis-navy text-sm font-semibold text-podarcis-green"
                                            aria-hidden="true"
                                        >
                                            {testimonial.name
                                                .split(' ')
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join('')}
                                        </span>
                                    )}
                                    <div>
                                        <p className="font-semibold">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {[
                                                testimonial.position,
                                                testimonial.company,
                                            ]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            {scrollSnaps.length > 1 && (
                <div className="mt-7 flex items-center justify-between gap-5">
                    <div
                        className="flex gap-2"
                        aria-label="Seleccionar testimonio"
                    >
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={cn(
                                    'h-1.5 rounded-full transition-all focus-visible:ring-3 focus-visible:ring-podarcis-green/50 focus-visible:outline-none',
                                    selected === index
                                        ? 'w-8 bg-podarcis-green'
                                        : 'w-3 bg-white/25 hover:bg-white/50',
                                )}
                                onClick={() => {
                                    setHasInteracted(true);
                                    api?.scrollTo(index);
                                }}
                                aria-label={`Ir al testimonio ${index + 1}`}
                                aria-current={
                                    selected === index ? 'true' : undefined
                                }
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                setHasInteracted(true);
                                api?.scrollPrev();
                            }}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                            aria-label="Testimonio anterior"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                setHasInteracted(true);
                                api?.scrollNext();
                            }}
                            className="border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                            aria-label="Testimonio siguiente"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
