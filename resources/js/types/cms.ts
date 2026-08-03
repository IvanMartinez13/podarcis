export type CmsLink = {
    id?: string;
    label: string;
    href: string;
};

export type CmsSectionCopy = {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
};

export type HomeMetric = {
    id: string;
    value: string;
    label: string;
};

export type HomeStep = {
    id: string;
    title: string;
    description?: string | null;
};

export type HomeFeature = {
    id: string;
    title: string;
    description?: string | null;
    icon?: string | null;
};

export type HomePageBlocks = {
    hero?: {
        eyebrow?: string | null;
        title?: string | null;
        highlightText?: string | null;
        primaryCta?: CmsLink | null;
        secondaryCta?: CmsLink | null;
        image?: string | null;
        imageAlt?: string | null;
    };
    metrics?: HomeMetric[];
    services?: CmsSectionCopy & { limit?: number };
    methodology?: CmsSectionCopy & { steps?: HomeStep[] };
    digital?: CmsSectionCopy & {
        features?: HomeFeature[];
        image?: string | null;
        imageAlt?: string | null;
        primaryCta?: CmsLink | null;
        secondaryCta?: CmsLink | null;
        /** Legacy fields kept only while previously saved content is read. */
        benefits?: HomeFeature[];
        cta?: CmsLink | null;
    };
    successCases?: CmsSectionCopy & {
        backgroundImage?: string | null;
    };
    testimonials?: CmsSectionCopy & {
        autoplay?: boolean;
        backgroundImage?: string | null;
    };
    posts?: CmsSectionCopy;
    finalCta?: CmsSectionCopy & {
        primaryCta?: CmsLink | null;
        secondaryCta?: CmsLink | null;
        image?: string | null;
    };
};

export type TeamMember = {
    name: string;
    title: string | null;
    handle: string | null;
    status: string | null;
    linkedinUrl: string | null;
    avatarUrl: string | null;
};

export type AboutPageBlocks = {
    teamCoverImage?: string | null;
    teamMembers?: TeamMember[];
    values?: string[];
    team?: CmsSectionCopy;
    finalCta?: CmsSectionCopy & { primaryCta?: CmsLink | null };
};

export type ContactPageBlocks = {
    response?: CmsSectionCopy & { steps?: HomeStep[] };
    services?: CmsSectionCopy;
};

export type ServiceBlocks = {
    detail?: string | null;
    benefits?: Array<{
        id: string;
        title: string;
        description?: string | null;
    }>;
    cta?: CmsLink | null;
};

export type PageBlocks =
    | HomePageBlocks
    | AboutPageBlocks
    | ContactPageBlocks
    | Record<string, unknown>;

export type CmsCategory = {
    name: string;
    slug: string;
};

export type CmsService = {
    id: number;
    title: string;
    slug: string;
    isFeatured?: boolean;
    excerpt: string | null;
    description?: string | null;
    icon: string | null;
    featuredImage: string | null;
    imageAlt?: string | null;
    logoImage?: string | null;
    logoImageAlt?: string | null;
    kind?: 'consulting' | 'digital';
    blocks?: ServiceBlocks | null;
    href: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
};

export type CmsPost = {
    title: string;
    slug: string;
    excerpt: string | null;
    content?: string;
    featuredImage: string | null;
    imageAlt?: string | null;
    publishedAt: string | null;
    href: string;
    category: CmsCategory | null;
    author?: { name: string } | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
};

export type CmsSuccessCase = {
    title: string;
    slug: string;
    clientName: string | null;
    sector: string | null;
    excerpt?: string | null;
    challenge?: string | null;
    solution?: string | null;
    result: string | null;
    featuredImage?: string | null;
    imageAlt?: string | null;
    href: string;
    service?: { title: string; slug: string } | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
};

export type CmsTestimonial = {
    name: string;
    position: string | null;
    company: string | null;
    quote: string;
    avatar?: string | null;
};

export type CmsPage = {
    title: string;
    slug?: string;
    excerpt: string | null;
    content: string | null;
    blocks?: PageBlocks | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
};

export type SiteSettings = {
    brandDescription: string | null;
    navigation: CmsLink[];
    headerCta: CmsLink | null;
    contact: {
        email?: string | null;
        phone?: string | null;
        address?: string | null;
    } | null;
    socialLinks: CmsLink[];
    footerGroups: Array<{
        id?: string;
        title: string;
        links: CmsLink[];
    }>;
};
