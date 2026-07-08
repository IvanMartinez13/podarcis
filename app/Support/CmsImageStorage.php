<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class CmsImageStorage
{
    public function store(UploadedFile $file, string $directory, ?string $oldPath = null, bool $preservePng = false): string
    {
        $extension = $preservePng && $file->getMimeType() === 'image/png' ? 'png' : 'webp';
        $path = trim($directory, '/').'/'.Str::uuid().'.'.$extension;

        Storage::disk('public')->put($path, $this->encode($file, $extension));

        $this->delete($oldPath);

        return $path;
    }

    public function delete(?string $path): void
    {
        if (! $this->isLocalCmsPath($path)) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    public function url(?string $path): ?string
    {
        if ($path === null || trim($path) === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/storage/'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    private function isLocalCmsPath(?string $path): bool
    {
        return is_string($path) && Str::startsWith($path, 'cms/');
    }

    private function encode(UploadedFile $file, string $extension): string
    {
        $contents = file_get_contents($file->getRealPath());

        if ($contents === false) {
            throw new RuntimeException('No se pudo leer la imagen subida.');
        }

        $image = imagecreatefromstring($contents);

        if (! $image instanceof \GdImage) {
            throw new RuntimeException('No se pudo procesar la imagen subida.');
        }

        imagepalettetotruecolor($image);
        imagealphablending($image, false);
        imagesavealpha($image, true);

        ob_start();

        try {
            $encoded = $extension === 'png'
                ? imagepng($image, null, 8)
                : imagewebp($image, null, 82);

            $output = ob_get_clean();
        } finally {
            imagedestroy($image);
        }

        if ($encoded !== true || ! is_string($output)) {
            throw new RuntimeException('No se pudo optimizar la imagen subida.');
        }

        return $output;
    }
}
