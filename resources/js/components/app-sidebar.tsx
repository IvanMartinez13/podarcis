import { Link } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    ExternalLink,
    FolderTree,
    LayoutGrid,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home } from '@/routes';
import * as admin from '@/routes/admin';
import * as categories from '@/routes/admin/categories';
import * as services from '@/routes/admin/services';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Admin',
        href: admin.index(),
        icon: LayoutGrid,
    },
    {
        title: 'Servicios',
        href: services.index(),
        icon: BriefcaseBusiness,
    },
    {
        title: 'Categorías',
        href: categories.index(),
        icon: FolderTree,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Web pública',
        href: home(),
        icon: ExternalLink,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={admin.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
