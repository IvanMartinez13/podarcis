import type { Auth } from './auth';
import type { SiteSettings } from './cms';

export type SeoSharedData = {
    baseUrl: string;
    siteName: string;
    organization: Record<string, unknown>;
    website: Record<string, unknown>;
};

export type SharedPageProps = {
    name: string;
    auth: Auth;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    site?: SiteSettings;
    seo: SeoSharedData;
    sidebarOpen: boolean;
};
