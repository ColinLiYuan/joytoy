// app/blog/[slug]/route.ts
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogServiceServer } from '@/services/servers/blog-service-server';
import BlogContent from './blog-content';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// ✅ SEO: Dynamic Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        const blog = await blogServiceServer.getBySlug(resolvedParams.slug);
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

export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;

    try {
        const blog = await blogServiceServer.getBySlug(resolvedParams.slug);

        // ✅ Breadcrumb Data
        const breadcrumbs: BreadcrumbItem[] = [
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: blog.title, path: null } // Current page
        ];

        // ✅ Structured Data for Article
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
    } catch (error) {
        console.error('Error fetching blog:', error);
        notFound();
    }
}