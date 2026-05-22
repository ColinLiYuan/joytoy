import { Metadata } from 'next';
import BlogListClient from './BlogListClient';
import { BACKEND_CONFIG } from '@/lib/api-config';

interface PageProps {
    searchParams: Promise<{
        page?: string;
        topic?: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    return {
        title: 'Journal - Pleasure & Wellness',
        description: 'Explorations in intimacy, education, and the art of living well.',
        alternates: {
            canonical: `${baseUrl}/blog`,
        },
        openGraph: {
            title: 'Journal - Pleasure & Wellness',
            description: 'Explorations in intimacy, education, and the art of living well.',
            url: `${baseUrl}/blog`,
            type: 'website',
        },
    };
}

async function getBlogData(page: number, topic?: string) {
    try {
        const params = new URLSearchParams({ page: String(page), size: '12' });
        if (topic) params.set('topic', topic);
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog/list?${params.toString()}`;
        const response = await fetch(url, { next: { revalidate: 3600 } });
        if (!response.ok) return { content: [], totalElements: 0, totalPages: 0 };
        const result = await response.json();
        if (!result?.success) return { content: [], totalElements: 0, totalPages: 0 };
        return result.data;
    } catch (error) {
        console.error('[BlogList] Error:', error);
        return { content: [], totalElements: 0, totalPages: 0 };
    }
}

export default async function BlogListPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;
    const activeTopic = resolvedSearchParams.topic || '';

    const blogData = await getBlogData(currentPage, activeTopic || undefined);

    return (
        <BlogListClient
            initialBlogData={blogData}
            currentPage={currentPage}
            activeTopic={activeTopic}
        />
    );
}
