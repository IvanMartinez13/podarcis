import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

type FormFieldProps = {
    label: string;
    htmlFor?: string;
    error?: string;
    hint?: string;
    children: ReactNode;
};

export function FormField({
    label,
    htmlFor,
    error,
    hint,
    children,
}: FormFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {hint && !error && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {hint}
                </p>
            )}
            <InputError message={error} />
        </div>
    );
}
