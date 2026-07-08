import { Head } from '@inertiajs/react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { PostForm } from '@/components/admin/post-form';
import type {
    AdminPostCategory,
    AdminPostFormData,
} from '@/components/admin/post-form';

type CreatePostProps = {
    post: AdminPostFormData;
    categories: AdminPostCategory[];
};

export default function CreatePost({ post, categories }: CreatePostProps) {
    return (
        <>
            <Head title="Nuevo post" />

            <div className="grid gap-8">
                <AdminPageHeader
                    title="Nuevo post"
                    description="Crea un artículo del blog corporativo de PODARCIS."
                />
                <PostForm categories={categories} mode="create" post={post} />
            </div>
        </>
    );
}
