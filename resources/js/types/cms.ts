export type CmsCategory = {
    name: string;
    slug: string;
};

export type CmsService = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    description?: string | null;
    icon: string | null;
    featuredImage: string | null;
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
    publishedAt: string | null;
    href: string;
    category: CmsCategory | null;
    author?: {
        name: string;
    } | null;
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
    href: string;
    service?: {
        title: string;
        slug: string;
    } | null;
};

export type CmsTestimonial = {
    name: string;
    position: string | null;
    company: string | null;
    quote: string;
};

export type TeamMember = {
    name: string;
    title: string | null;
    handle: string | null;
    status: string | null;
    contactText: string | null;
    avatarUrl: string | null;
};

export type PageBlocks = {
    teamCoverImage?: string | null;
    teamMembers?: TeamMember[];
};

export type CmsPage = {
    title: string;
    slug?: string;
    excerpt: string | null;
    content: string | null;
    blocks?: PageBlocks | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
};
