// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { getAuthor } from '@/lib/constants/authors';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// ✅ 服务端获取博客数据
async function getBlogData(slug: string) {
    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog?slug=${encodeURIComponent(slug)}`;
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // 缓存1小时
        });
        
        if (!response.ok) {
            console.error('[BlogDetail] Failed to fetch blog:', response.status);
            return null;
        }
        
        const result = await response.json();
        
        if (!result?.success) {
            console.error('[BlogDetail] Blog not found:', slug);
            return null;
        }
        
        return result.data;
    } catch (error) {
        console.error('[BlogDetail] Error fetching blog:', error);
        return null;
    }
}

// ✅ SEO: Dynamic Metadata (必须保持服务端)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const blog = await getBlogData(resolvedParams.slug);
    
    if (!blog) {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
        };
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    
    return {
        title: {
            absolute: `${blog.title} | MythToy Blog`,
        },
        description: blog.summary || blog.content.substring(0, 155),
        openGraph: {
            title: blog.title,
            description: blog.summary || blog.content.substring(0, 155),
            images: blog.coverImage ? [blog.coverImage] : [],
            type: 'article',
            publishedTime: blog.createdAt,
            modifiedTime: blog.updatedAt,
            authors: [getAuthor(blog.author).name],
        },
        alternates: {
            canonical: `${baseUrl}/blog/${blog.slug}`,
        },
    };
}

// ✅ 服务端组件：在服务端获取数据并传递给客户端
export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const blog = await getBlogData(resolvedParams.slug);
    
    return <BlogDetailClient initialBlog={blog} />;
}
