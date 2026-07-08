import { ImageIcon, Trash2, UploadCloud } from 'lucide-react';
import type { ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ImageUploadFieldProps = {
    id: string;
    label: string;
    currentImageUrl?: string | null;
    error?: string;
    help?: string;
    progress?: number | null;
    remove: boolean;
    onFileChange: (file: File | null) => void;
    onRemoveChange: (remove: boolean) => void;
};

export function ImageUploadField({
    id,
    label,
    currentImageUrl,
    error,
    help = 'JPG, PNG o WebP. Se optimizará automáticamente al guardar.',
    progress,
    remove,
    onFileChange,
    onRemoveChange,
}: ImageUploadFieldProps) {
    function selectFile(event: ChangeEvent<HTMLInputElement>) {
        onFileChange(event.target.files?.[0] ?? null);
        onRemoveChange(false);
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor={id}
                >
                    {label}
                </label>
                {currentImageUrl && !remove && (
                    <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onFileChange(null);
                            onRemoveChange(true);
                        }}
                    >
                        <Trash2 className="size-4" />
                        Quitar imagen
                    </Button>
                )}
            </div>

            <div className="mt-2 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                {currentImageUrl && !remove ? (
                    <img
                        alt=""
                        className="aspect-[16/9] w-full rounded-md border border-slate-200 bg-white object-cover"
                        src={currentImageUrl}
                    />
                ) : (
                    <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md border border-dashed border-slate-300 bg-white text-slate-400">
                        <ImageIcon className="size-7" aria-hidden="true" />
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <UploadCloud
                        className="size-5 text-slate-500"
                        aria-hidden="true"
                    />
                    <Input
                        id={id}
                        accept="image/jpeg,image/png,image/webp"
                        type="file"
                        onChange={selectFile}
                    />
                </div>

                {progress !== null && progress !== undefined && (
                    <progress className="h-2 w-full" value={progress} max="100">
                        {progress}%
                    </progress>
                )}

                <p className="text-xs text-slate-500">
                    {remove
                        ? 'La imagen actual se eliminará al guardar.'
                        : help}
                </p>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
