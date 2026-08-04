import type { LucideIcon } from 'lucide-react';
import {
    Award,
    BarChart3,
    BookOpen,
    ChartNoAxesColumn,
    ChartSpline,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    Leaf,
    Map as MapIcon,
    MonitorCog,
    Recycle,
    Scale,
    ShieldCheck,
} from 'lucide-react';

const serviceIcons: Record<string, LucideIcon> = {
    award: Award,
    'bar-chart-3': BarChart3,
    'book-open': BookOpen,
    'check-circle-2': CheckCircle2,
    'clipboard-check': ClipboardCheck,
    'chart-no-axes-column': ChartNoAxesColumn,
    'chart-spline': ChartSpline,
    'graduation-cap': GraduationCap,
    leaf: Leaf,
    map: MapIcon,
    'monitor-cog': MonitorCog,
    recycle: Recycle,
    scale: Scale,
    'shield-check': ShieldCheck,
};

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
): string | null {
    if (!icon) {
        return null;
    }

    const normalized = normalizeServiceIconName(icon);

    return serviceIcons[normalized] ? normalized : null;
}

function getServiceIcon(icon: string | null | undefined): LucideIcon {
    const resolved = resolveServiceIconName(icon);

    if (!resolved) {
        return Leaf;
    }

    return serviceIcons[resolved];
}

export { getServiceIcon, normalizeServiceIconName, resolveServiceIconName };
