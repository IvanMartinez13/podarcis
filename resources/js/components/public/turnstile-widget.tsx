import { useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';

type TurnstileOptions = {
    sitekey: string;
    callback: (token: string) => void;
    'expired-callback': () => void;
    'error-callback': () => void;
    theme: 'light' | 'dark' | 'auto';
};

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: TurnstileOptions,
            ) => string;
            remove: (widgetId: string) => void;
            reset: (widgetId?: string) => void;
        };
    }
}

type TurnstileWidgetProps = {
    siteKey: string;
    resetKey: number;
    onVerify: (token: string) => void;
    onExpire: () => void;
    onError: () => void;
};

export function TurnstileWidget({
    siteKey,
    resetKey,
    onVerify,
    onExpire,
    onError,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const callbacksRef = useRef({ onVerify, onExpire, onError });

    useEffect(() => {
        callbacksRef.current = { onVerify, onExpire, onError };
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        let cancelled = false;
        let script: HTMLScriptElement | null = document.getElementById(
            TURNSTILE_SCRIPT_ID,
        ) as HTMLScriptElement | null;

        function renderWidget() {
            if (
                cancelled ||
                !containerRef.current ||
                !window.turnstile ||
                widgetIdRef.current
            ) {
                return;
            }

            widgetIdRef.current = window.turnstile.render(
                containerRef.current,
                {
                    sitekey: siteKey,
                    theme: 'light',
                    callback: (token) => callbacksRef.current.onVerify(token),
                    'expired-callback': () => callbacksRef.current.onExpire(),
                    'error-callback': () => callbacksRef.current.onError(),
                },
            );
        }

        if (window.turnstile) {
            renderWidget();
        } else {
            if (!script) {
                script = document.createElement('script');
                script.id = TURNSTILE_SCRIPT_ID;
                script.src =
                    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }

            script.addEventListener('load', renderWidget);
        }

        return () => {
            cancelled = true;

            if (script) {
                script.removeEventListener('load', renderWidget);
            }

            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey]);

    useEffect(() => {
        if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
        }
    }, [resetKey]);

    return <div ref={containerRef} />;
}
