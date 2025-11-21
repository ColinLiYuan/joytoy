// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogServiceServer } from '@/services/servers/blog-service-server';
import BlogContent from './blog-content';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const blog = await blogServiceServer.getBySlug(resolvedParams.slug);

        return {
            title: `${blog.title} - 博客文章`,
            description: blog.summary || blog.content.substring(0, 150) + '...',
            openGraph: {
                title: blog.title,
                description: blog.summary || blog.content.substring(0, 150) + '...',
                images: blog.coverImage ? [blog.coverImage] : [],
                type: 'article',
                publishedTime: blog.createdAt,
                modifiedTime: blog.updatedAt,
                authors: [blog.author],
            },
        };
    } catch (error) {
        return {
            title: '博客不存在',
            description: '请求的博客文章不存在或已被删除',
        };
    }
}

export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;

    try {
        const blog = await blogServiceServer.getBySlug(resolvedParams.slug);

        return <BlogContent blog={blog} />;
    } catch (error) {
        console.error('获取博客失败:', error);
        notFound();
    }
}