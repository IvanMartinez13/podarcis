import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PostForm } from '@/components/admin/post-form';
import type {
    AdminPostCategory,
    AdminPostFormData,
} from '@/components/admin/post-form';

type EditPostProps = {
    post: AdminPostFormData;
    categories: AdminPostCategory[];
};

export default function EditPost({ post, categories }: EditPostProps) {
    return (
        <>
            <Head title={`Editar ${post.title}`} />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Editar post"
                    description="Actualiza contenido, publicación y metadatos SEO."
                />
                <PostForm categories={categories} mode="edit" post={post} />
            </div>
        </>
    );
}
