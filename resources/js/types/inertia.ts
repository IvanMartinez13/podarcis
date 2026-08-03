import type { Auth } from './auth';
import type { SiteSettings } from './cms';

export type SharedPageProps = {
    name: string;
    auth: Auth;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    site?: SiteSettings;
    sidebarOpen: boolean;
};
