import { Metadata } from 'next';
import BlogListClient from './BlogListClient';
import { BACKEND_CONFIG } from '@/lib/api-config';

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

// ✅ SEO: Dynamic Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Journal - Pleasure & Wellness | MythToy',
        description: 'Explorations in intimacy, education, and the art of living well.',
    };
}

// ✅ 服务端获取博客列表数据
async function getBlogData(page: number) {
    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog/list?page=${page}&size=12`;
        console.log('[BlogList] Fetching blogs from:', url);
        
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // 缓存1小时
        });
        
        if (!response.ok) {
            console.error('[BlogList] Failed to fetch blogs:', response.status);
            return {
                content: [],
                currentPage: page,
                pageSize: 12,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        }
        
        const result = await response.json();
        
        if (!result?.success) {
            console.error('[BlogList] API returned error');
            return {
                content: [],
                currentPage: page,
                pageSize: 12,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        }
        
        return result.data;
    } catch (error) {
        console.error('[BlogList] Error fetching blogs:', error);
        return {
            content: [],
            currentPage: page,
            pageSize: 12,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
        };
    }
}

// ✅ 服务端组件：在服务端获取数据并传递给客户端
export default async function BlogListPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;
    
    const blogData = await getBlogData(currentPage);
    
    return <BlogListClient initialBlogData={blogData} currentPage={currentPage} />;
}
