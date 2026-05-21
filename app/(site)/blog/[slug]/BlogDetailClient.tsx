'use client';

import BlogContent from './blog-content';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import { BlogResponse } from '@/types/site/blog';
import { getAuthor } from '@/lib/constants/authors';

interface BlogDetailClientProps {
    initialBlog: BlogResponse | null;
}

export default function BlogDetailClient({ initialBlog }: BlogDetailClientProps) {
    // 如果服务端没有获取到数据，显示错误页面
    if (!initialBlog) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-serif mb-4 text-red-500">Article Not Found</h2>
                    <p className="text-gray-500">The requested article could not be found.</p>
                </div>
            </div>
        );
    }

    const blog = initialBlog;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: blog.title, path: null }
    ];

    const articleStructuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.summary || blog.content.substring(0, 155),
        "image": blog.coverImage ? [blog.coverImage] : [],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt,
        "author": {
            "@type": "Person",
            "name": getAuthor(blog.author).name
        },
        ...(blog.topic ? { "articleSection": blog.topic } : {}),
        "publisher": {
            "@type": "Organization",
            "name": "MythToy",
            "logo": {
                "@type": "ImageObject",
                "url": "https://mythtoy.com/icon_v2.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://mythtoy.com/blog/${blog.slug}`
        }
    };

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
            />
            
            <div className="min-h-screen bg-white w-full overflow-x-hidden">
                {/* Breadcrumb Container */}
                <div className="container mx-auto px-4 max-w-4xl py-6">
                    <Breadcrumb items={breadcrumbs} showLastItem={false} />
                </div>

                {/* Content Component */}
                <BlogContent blog={blog} />
            </div>
        </>
    );
}
