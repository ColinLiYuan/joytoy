// app/blog/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Pagination from '@/components/common/pagination';
import Breadcrumb from '@/components/common/breadcrumb';
import { blogServiceServer } from '@/services/servers/blog-service-server';
import { BlogListResponse } from '@/types/site/blog';
import { ArrowUpRight } from 'lucide-react';

// --- 1. 精选的高端艺术图 (替换原有图片) ---
const AESTHETIC_IMAGES = [
    "https://images.unsplash.com/photo-1507919909716-c8262e491cde?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=800",
    "https://unsplash.com/photos/a-close-up-of-a-white-surface-with-a-light-shining-on-it-v4dwU9sX5tY?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1499244571941-37a279d0ccb9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1605218427306-635ba2439715?auto=format&fit=crop&q=80&w=800",
];

// 定义搜索参数类型
interface BlogSearchParams {
    page?: string;
    [key: string]: string | string[] | undefined;
}

// 定义页面组件属性
interface BlogListPageProps {
    searchParams?: Promise<BlogSearchParams>;
}

// 如果还需要生成 Metadata，可以添加
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'The Journal - Pleasure & Wellness',
        description: 'Explorations in intimacy, education, and the art of living well.',
    };
}

export default async function BlogList({ searchParams }: BlogListPageProps) {
    // 等待 searchParams 解析
    const resolvedSearchParams = searchParams ? await searchParams : { page: undefined };
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Journal', path: null }
    ];

    try {
        const response: BlogListResponse = await blogServiceServer.list(currentPage, 12);
        const posts = response.content || [];

        return (
            <div className="min-h-screen bg-white w-full">

                {/* Header Section */}
                <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center border-b border-gray-50">
                    <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">
                        The Editorial
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 tracking-tight">
                        Pleasure & <i className="font-light text-gray-400">Wellness</i>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed font-light font-sans">
                        Explorations in intimacy, education, and the art of living well.
                    </p>
                </div>

                <div className="container mx-auto px-6 max-w-7xl py-16">

                    {/* Breadcrumb */}
                    <div className="mb-12 flex justify-center md:justify-start">
                        <Breadcrumb items={breadcrumbs} showLastItem={true} />
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-24">
                        {posts.length > 0 ? (
                            posts.map((post, index) => {
                                const artImage = AESTHETIC_IMAGES[index % AESTHETIC_IMAGES.length];

                                return (
                                    <article key={post.id} className="group flex flex-col cursor-pointer">

                                        {/* Image */}
                                        <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5F5F7] mb-6">
                                            <img
                                                src={artImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                loading="lazy"
                                            />
                                        </Link>

                                        {/* Content */}
                                        <div className="flex flex-col flex-grow">
                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-3 font-sans">
                                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                                <span className="w-8 h-[1px] bg-gray-200"></span>
                                            </div>

                                            {/* Title */}
                                            <Link href={`/blog/${post.slug}`} className="block mb-3">
                                                <h2 className="text-3xl font-serif text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors leading-[1.1]">
                                                    {post.title}
                                                </h2>
                                            </Link>

                                            {/* Summary */}
                                            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                                                {post.summary || post.content.substring(0, 120)}...
                                            </p>

                                            {/* Read More Link */}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="mt-auto inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-transparent group-hover:border-[#C5A059] group-hover:text-[#C5A059] transition-all pb-0.5 w-max"
                                            >
                                                Read Story <ArrowUpRight size={14} />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-serif text-xl italic">No stories found.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {response.totalPages > 1 && (
                        <div className="flex justify-center border-t border-gray-100 pt-12">
                            <Pagination
                                currentPage={response.currentPage || currentPage}
                                totalPages={response.totalPages || 0}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">Failed to load blog posts. Please try again later.</p>
                </div>
            </div>
        );
    }
}