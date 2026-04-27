// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { blogService } from '@/services/blogService';
import BlogDetailClient from './BlogDetailClient';
import { BACKEND_CONFIG } from '@/lib/api-config';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// ✅ SEO: Dynamic Metadata (必须保持服务端)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        // ✅ 使用原生 fetch，带上完整 URL（服务端不能使用 axiosClient）
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog?slug=${encodeURIComponent(resolvedParams.slug)}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (!result?.success) {
            return {
                title: 'Article Not Found | MythToy',
                description: 'The requested article could not be found.',
            };
        }
        
        const blog = result.data;
        
        return {
            title: `${blog.title} | MythToy Blog`,
            description: blog.summary || blog.content.substring(0, 155),
            openGraph: {
                title: blog.title,
                description: blog.summary || blog.content.substring(0, 155),
                images: blog.coverImage ? [blog.coverImage] : [],
                type: 'article',
                publishedTime: blog.createdAt,
                modifiedTime: blog.updatedAt,
                authors: [blog.author || 'MythToy'],
            },
            alternates: {
                canonical: `https://mythtoy.com/blog/${blog.slug}`,
            },
        };
    } catch (error) {
        return {
            title: 'Article Not Found | MythToy',
            description: 'The requested article could not be found.',
        };
    }
}

// ✅ 主体内容使用客户端组件
export default function BlogDetailPage() {
    return <BlogDetailClient />;
}
