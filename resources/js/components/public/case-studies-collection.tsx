import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CaseStudyCard } from '@/components/public/case-study-card';
import { Button } from '@/components/ui/button';
import type { CmsSuccessCase } from '@/types';

export function CaseStudiesCollection({
    successCases,
}: {
    successCases: CmsSuccessCase[];
}) {
    const [viewportRef, api] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
    });

    if (successCases.length <= 3) {
        return (
            <div className="grid gap-5 lg:grid-cols-3">
                {successCases.map((successCase) => (
                    <CaseStudyCard
                        key={successCase.slug}
                        successCase={successCase}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            aria-label="Casos de éxito"
            className="relative"
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                    api?.scrollPrev();
                }

                if (event.key === 'ArrowRight') {
                    api?.scrollNext();
                }
            }}
            role="region"
        >
            <div className="overflow-hidden" ref={viewportRef}>
                <div className="-ml-5 flex touch-pan-y">
                    {successCases.map((successCase) => (
                        <div
                            className="min-w-0 flex-[0_0_88%] pl-5 md:flex-[0_0_52%] xl:flex-[0_0_34%]"
                            key={successCase.slug}
                        >
                            <CaseStudyCard successCase={successCase} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <Button
                    aria-label="Caso anterior"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                    onClick={() => api?.scrollPrev()}
                    size="icon"
                    type="button"
                    variant="outline"
                >
                    <ChevronLeft className="size-4" />
                </Button>
                <Button
                    aria-label="Caso siguiente"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-white"
                    onClick={() => api?.scrollNext()}
                    size="icon"
                    type="button"
                    variant="outline"
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
