// app/blog/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Pagination from '@/components/common/pagination';
import Breadcrumb from '@/components/common/breadcrumb'; // ✅ 引入通用面包屑
import { blogServiceServer } from '@/services/servers/blog-service-server';
import { BlogResponse, BlogListResponse } from '@/types/site/blog';
import { BookOpen, Calendar, User, Eye, ArrowRight } from 'lucide-react'; // ✅ Lucide

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
        title: `Pleasure & Wellness Blog${pageSuffix} | MythToy`,
        description: 'Expert guides on adult toys, sexual wellness, and intimacy tips. Discover product reviews, how-to guides, and education to enhance your experience.',
        keywords: 'sex education, adult toy reviews, intimacy tips, sexual wellness blog',
        openGraph: {
            title: `Pleasure & Wellness Blog${pageSuffix} | MythToy`,
            description: 'Expert guides on adult toys and sexual wellness.',
            type: 'website',
            url: '/blog',
        },
        alternates: {
            canonical: '/blog',
        },
    };
}

// SEO Schema
function generateStructuredData(posts: BlogResponse[]) {
    if (!posts.length) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': 'MythToy Pleasure & Wellness Blog',
        'description': 'Expert guides on adult toys, sexual wellness, and intimacy tips',
        'url': `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
        'blogPost': posts.map((post) => ({
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.summary || post.content.substring(0, 160),
            'datePublished': post.createdAt,
            'dateModified': post.updatedAt,
            'author': {
                '@type': 'Person',
                'name': post.author || 'MythToy Editorial'
            },
            'url': `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`
        }))
    };
}

export default async function BlogList({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;

    // Breadcrumbs
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: null }
    ];

    try {
        const response: BlogListResponse = await blogServiceServer.list(currentPage, 12);
        const posts = response.content || [];
        const structuredData = generateStructuredData(posts);

        return (
            <>
                {structuredData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}

                <div className="min-h-screen bg-white w-full overflow-x-hidden">

                    {/* Header Section */}
                    <div className="bg-gray-50 py-16 md:py-24 border-b border-gray-100">
                        <div className="container mx-auto px-4 max-w-7xl text-center">
                            <div className="mb-8 flex justify-center">
                                <div className="bg-white px-4 py-1 rounded-full border border-gray-200 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                                    <BookOpen size={14} />
                                    Knowledge Hub
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
                                The Pleasure Journal
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-['Inter']">
                                Expert advice, product guides, and intimacy tips to help you explore with confidence.
                            </p>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 max-w-7xl py-12">

                        {/* Breadcrumb */}
                        <div className="mb-10">
                            <Breadcrumb items={breadcrumbs} showLastItem={true} />
                        </div>

                        {/* Blog Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <article
                                        key={post.id}
                                        className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                                    >
                                        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-gray-100">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                    <span className="text-4xl font-bold opacity-20">MYTH</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                        </Link>

                                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 uppercase tracking-wider font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} />
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                {/* 如果有分类可以在这里加 */}
                                            </div>

                                            <Link href={`/blog/${post.slug}`} className="block mb-3">
                                                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors font-['Playfair_Display'] leading-tight">
                                                    {post.title}
                                                </h2>
                                            </Link>

                                            <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow font-['Inter']">
                                                {post.summary || post.content.substring(0, 150)}...
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                    <User size={12} />
                                                    {post.author || 'Editor'}
                                                </div>
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="text-xs font-bold uppercase tracking-wide text-black group-hover:text-pink-600 flex items-center gap-1 transition-colors"
                                                >
                                                    Read Article <ArrowRight size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
                                    <p className="text-gray-500">Our editors are working on new content. Check back soon!</p>
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to load blog</h3>
                    <p className="text-gray-500">Please try again later.</p>
                </div>
            </div>
        );
    }
}