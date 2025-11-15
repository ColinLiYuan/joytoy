// app/blog/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Pagination from '@/components/common/pagination';
import { blogServiceServer } from '@/services/servers/blog-service-server';
import { BlogResponse, BlogListResponse } from '@/types/site/blog';

interface PageProps {
    searchParams: Promise<{
        page?: string;
    }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || '0', 10);
    const pageSuffix = currentPage > 0 ? ` - Page ${currentPage + 1}` : '';

    return {
        title: `Sex Education & Pleasure Guides${pageSuffix} | Your Brand`,
        description: 'Expert guides on adult toys, sexual wellness, and intimacy. Discover product reviews, how-to guides, and tips to enhance your experience.',
        keywords: 'adult toys, sex toys, sexual wellness, intimacy guides, product reviews, pleasure products',
        openGraph: {
            title: `Sex Education & Pleasure Guides${pageSuffix}`,
            description: 'Expert guides on adult toys and sexual wellness',
            type: 'website',
            locale: 'en_US',
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: '/blog',
        },
    };
}

// Generate structured data for SEO
function generateStructuredData(posts: BlogResponse[]) {
    if (!posts.length) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'Sex Education & Pleasure Guides',
        'description': 'Expert guides on adult toys, sexual wellness, and intimacy tips',
        'url': `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
        'blogPost': posts.slice(0, 5).map((post: BlogResponse) => ({
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.summary || post.content.substring(0, 160),
            'datePublished': post.createdAt,
            'dateModified': post.updatedAt,
            'author': {
                '@type': 'Person',
                'name': post.author || 'Your Brand'
            },
            'url': `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
        }))
    };
}

export default async function BlogList({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;

    try {
        const response: BlogListResponse = await blogServiceServer.list(currentPage, 12);
        const posts = response.content || [];
        const structuredData = generateStructuredData(posts);

        return (
            <>
                {/* Structured Data for SEO */}
                {structuredData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}

                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4 max-w-7xl">
                        {/* Page Header - Improved Design */}
                        <div className="mb-16 text-center">
                            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
                                Knowledge Center
                            </div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Pleasure & Wellness
                                <span className="block text-3xl text-purple-600 mt-2 font-light">Education Hub</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                Explore our expert guides on sexual wellness, product insights,
                                and intimacy tips to enhance your personal journey.
                            </p>
                            <div className="mt-8 text-lg text-purple-600 font-semibold">
                                {response.totalElements || 0} Expert Guides
                            </div>
                        </div>

                        {/* Blog List - Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full group"
                                    >
                                        {/* Clickable Cover Image with Overlay Text */}
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="relative block"
                                        >
                                            {post.coverImage ? (
                                                <div className="h-48 relative overflow-hidden">
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                    {/* Title on Image */}
                                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                                        <h3 className="text-lg font-bold mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors">
                                                            {post.title}
                                                        </h3>
                                                        {post.summary && (
                                                            <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {post.summary}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                // Fallback when no cover image
                                                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                                                    <div className="text-center p-4">
                                                        <h3 className="text-lg font-bold mb-2 line-clamp-2">
                                                            {post.title}
                                                        </h3>
                                                        {post.summary && (
                                                            <p className="text-sm opacity-90 line-clamp-2">
                                                                {post.summary}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content Below Image */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Title */}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="hover:no-underline group/title mb-3"
                                            >
                                                <h2 className="text-xl font-bold text-gray-900 group-hover/title:text-purple-600 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h2>
                                            </Link>

                                            {/* SubTitle */}
                                            {post.subTitle && (
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="hover:no-underline group/subtitle mb-4"
                                                >
                                                    <p className="text-gray-600 group-hover/subtitle:text-purple-500 transition-colors line-clamp-3 leading-relaxed">
                                                        {post.subTitle}
                                                    </p>
                                                </Link>
                                            )}

                                            {/* Author and Date */}
                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex justify-between items-center text-sm text-gray-500">
                                                    <span>By {post.author}</span>
                                                    <span>{new Date(post.createdAt).toLocaleDateString('en-US')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Guides Available</h3>
                                    <p className="text-gray-600 text-lg">We're preparing new content for you.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {response.totalPages > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    currentPage={response.currentPage || currentPage}
                                    totalPages={response.totalPages || 0}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error('Error fetching blog list:', error);

        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">😔</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Content Unavailable</h3>
                        <p className="text-gray-600 text-lg">We're experiencing technical difficulties. Please check back soon.</p>
                    </div>
                </div>
            </div>
        );
    }
}