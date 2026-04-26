'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { blogService } from '@/services/blogService';
import BlogContent from './blog-content';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import { BlogResponse } from '@/types/site/blog';

export default function BlogDetailClient() {
    const params = useParams();
    const slug = params.slug as string;

    const [blog, setBlog] = useState<BlogResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBySlug(slug);
                setBlog(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching blog:', err);
                setError(err.message || 'Failed to load blog');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-serif mb-4 text-red-500">Article Not Found</h2>
                    <p className="text-gray-500">{error || 'The requested article could not be found.'}</p>
                </div>
            </div>
        );
    }

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
            "name": blog.author || "MythToy Team"
        },
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
