import { useEffect, useRef } from 'react';

import { FormField } from '@/components/admin/form-field';

import 'summernote/dist/summernote-lite.css';

type SummernoteFieldProps = {
    disabled?: boolean;
    error?: string;
    height?: number;
    hint?: string;
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
};

export function SummernoteField({
    disabled = false,
    error,
    height = 220,
    hint,
    id,
    label,
    value,
    onChange,
}: SummernoteFieldProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const jqueryEditorRef = useRef<any>(null);
    const latestOnChangeRef = useRef(onChange);
    const initialValueRef = useRef(value);

    useEffect(() => {
        latestOnChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let isCancelled = false;

        async function setupEditor() {
            if (!editorRef.current) {
                return;
            }

            const jqueryModule = await import('jquery');
            const $ = jqueryModule.default;
            (window as any).$ = $;
            (window as any).jQuery = $;

            await import('summernote/dist/summernote-lite.js');

            if (isCancelled || !editorRef.current) {
                return;
            }

            const $editor = $(editorRef.current) as any;
            $editor.summernote({
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['insert', ['link']],
                    ['view', ['codeview']],
                ],
                height,
                disableDragAndDrop: true,
                callbacks: {
                    onChange: (contents: string) => {
                        latestOnChangeRef.current(contents);
                    },
                },
            });

            $editor.summernote('code', initialValueRef.current);

            if (disabled) {
                $editor.summernote('disable');
            }

            jqueryEditorRef.current = $editor;
        }

        void setupEditor();

        return () => {
            isCancelled = true;

            if (jqueryEditorRef.current) {
                jqueryEditorRef.current.summernote('destroy');
                jqueryEditorRef.current = null;
            }
        };
    }, [disabled, height]);

    useEffect(() => {
        initialValueRef.current = value;

        if (!jqueryEditorRef.current) {
            return;
        }

        const currentContent = String(
            jqueryEditorRef.current.summernote('code') ?? '',
        );

        if (currentContent !== value) {
            jqueryEditorRef.current.summernote('code', value);
        }
    }, [value]);

    useEffect(() => {
        if (!jqueryEditorRef.current) {
            return;
        }

        if (disabled) {
            jqueryEditorRef.current.summernote('disable');

            return;
        }

        jqueryEditorRef.current.summernote('enable');
    }, [disabled]);

    return (
        <FormField error={error} hint={hint} htmlFor={id} label={label}>
            <div id={id} ref={editorRef} />
        </FormField>
    );
}
