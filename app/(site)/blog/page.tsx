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
    return {
        title: 'Journal - Pleasure & Wellness | MythToy',
        description: 'Explorations in intimacy, education, and the art of living well.',
    };
}

async function getBlogData(page: number) {
    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog/list?page=${page}&size=12`;
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

    const blogData = await getBlogData(currentPage);

    return (
        <BlogListClient
            initialBlogData={blogData}
            currentPage={currentPage}
            activeTopic={activeTopic}
        />
    );
}
