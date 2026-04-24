// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { blogService } from '@/services/blogService';
import BlogDetailClient from './BlogDetailClient';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// ✅ SEO: Dynamic Metadata (必须保持服务端)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const blog = await blogService.getBySlug(resolvedParams.slug);
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
