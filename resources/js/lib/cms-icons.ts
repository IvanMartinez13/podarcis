import type { LucideIcon, LucideProps } from 'lucide-react';
import {
    BarChart3,
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    Leaf,
    Map as MapIcon,
    MonitorCog,
    Recycle,
    ShieldCheck,
} from 'lucide-react';
import { dynamicIconImports, iconNames } from 'lucide-react/dynamic';
import type { IconName } from 'lucide-react/dynamic';
import { createElement, forwardRef, useEffect, useState } from 'react';

const serviceIcons: Record<string, LucideIcon> = {
    'bar-chart-3': BarChart3,
    'book-open': BookOpen,
    'check-circle-2': CheckCircle2,
    'clipboard-check': ClipboardCheck,
    'graduation-cap': GraduationCap,
    leaf: Leaf,
    map: MapIcon,
    'monitor-cog': MonitorCog,
    recycle: Recycle,
    'shield-check': ShieldCheck,
};

const iconAliases: Record<string, string> = {
    // Common check variants not available in the installed Lucide version.
    'message-circle-check': 'message-circle',
    'message-square-check': 'message-square',
};

const validDynamicIcons = new Set<string>(iconNames);
const dynamicIconCache = new Map<string, LucideIcon>();

function normalizeServiceIconName(icon: string): string {
    return icon
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
}

function resolveServiceIconName(
    icon: string | null | undefined,
): IconName | null {
    if (!icon) {
        return null;
    }

    const normalized = normalizeServiceIconName(icon);
    const resolved = iconAliases[normalized] ?? normalized;

    return validDynamicIcons.has(resolved) ? (resolved as IconName) : null;
}

async function loadServiceIcon(iconName: IconName): Promise<LucideIcon> {
    const module = await dynamicIconImports[iconName]();

    return module.default;
}

function resolveLucideIcon(iconName: IconName): LucideIcon {
    const cached = dynamicIconCache.get(iconName);

    if (cached) {
        return cached;
    }

    const DynamicServiceIcon = forwardRef<SVGSVGElement, LucideProps>(
        (props, ref) => {
            const [LoadedIcon, setLoadedIcon] = useState<LucideIcon | null>(
                null,
            );

            useEffect(() => {
                let isMounted = true;

                loadServiceIcon(iconName)
                    .then((resolvedIcon) => {
                        if (isMounted) {
                            setLoadedIcon(() => resolvedIcon);
                        }
                    })
                    .catch(() => {
                        if (isMounted) {
                            setLoadedIcon(() => Leaf);
                        }
                    });

                return () => {
                    isMounted = false;
                };
            }, []);

            const IconComponent = LoadedIcon ?? Leaf;

            return createElement(IconComponent, {
                ...props,
                ref,
            });
        },
    );

    DynamicServiceIcon.displayName = `ServiceIcon(${iconName})`;
    dynamicIconCache.set(iconName, DynamicServiceIcon as LucideIcon);

    return DynamicServiceIcon as LucideIcon;
}

function getServiceIcon(icon: string | null | undefined): LucideIcon {
    const resolved = resolveServiceIconName(icon);

    if (!resolved) {
        return Leaf;
    }

    const staticIcon = serviceIcons[resolved];

    if (staticIcon) {
        return staticIcon;
    }

    return resolveLucideIcon(resolved);
}

export {
    getServiceIcon,
    loadServiceIcon,
    normalizeServiceIconName,
    resolveServiceIconName,
};
