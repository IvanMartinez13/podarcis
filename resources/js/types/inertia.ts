import type { Auth } from './auth';

export type SharedPageProps = {
    name: string;
    auth: Auth;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    sidebarOpen: boolean;
};
