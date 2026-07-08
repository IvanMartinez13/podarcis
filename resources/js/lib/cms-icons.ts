import {
    BarChart3,
    BookOpen,
    CheckCircle2,
    ClipboardCheck,
    GraduationCap,
    Leaf,
    Map,
    MonitorCog,
    Recycle,
    ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const serviceIcons: Record<string, LucideIcon> = {
    'bar-chart-3': BarChart3,
    'book-open': BookOpen,
    'check-circle-2': CheckCircle2,
    'clipboard-check': ClipboardCheck,
    'graduation-cap': GraduationCap,
    leaf: Leaf,
    map: Map,
    'monitor-cog': MonitorCog,
    recycle: Recycle,
    'shield-check': ShieldCheck,
};

function getServiceIcon(icon: string | null | undefined): LucideIcon {
    return icon ? (serviceIcons[icon] ?? Leaf) : Leaf;
}

export { getServiceIcon };
