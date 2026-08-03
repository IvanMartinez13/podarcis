import { cn } from '@/lib/utils';

type RichTextProps = {
    className?: string;
    html?: string | null;
};

export function RichText({ className, html }: RichTextProps) {
    if (!html || html.trim() === '') {
        return null;
    }

    return (
        <div
            className={cn(
                '[&_a]:font-semibold [&_a]:text-podarcis-green [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-podarcis-green/40 [&_blockquote]:pl-4 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-5 [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
