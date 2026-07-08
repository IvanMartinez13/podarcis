import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import type { AdminTestimonialFormData } from '@/components/admin/testimonial-form';

type EditTestimonialProps = {
    testimonial: AdminTestimonialFormData;
};

export default function EditTestimonial({ testimonial }: EditTestimonialProps) {
    return (
        <>
            <Head title={`Editar ${testimonial.name}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar testimonio"
                    description="Actualiza contenido, destacado y orden de aparición."
                />
                <TestimonialForm mode="edit" testimonial={testimonial} />
            </div>
        </>
    );
}
