import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { TestimonialForm } from '@/components/admin/testimonial-form';
import type { AdminTestimonialFormData } from '@/components/admin/testimonial-form';

type CreateTestimonialProps = {
    testimonial: AdminTestimonialFormData;
};

export default function CreateTestimonial({
    testimonial,
}: CreateTestimonialProps) {
    return (
        <>
            <Head title="Nuevo testimonio" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nuevo testimonio"
                    description="Crea una cita destacable para la sección de confianza."
                />
                <TestimonialForm mode="create" testimonial={testimonial} />
            </div>
        </>
    );
}
