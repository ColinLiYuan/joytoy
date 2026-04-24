'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Pagination from '@/components/common/pagination';
import Breadcrumb from '@/components/common/breadcrumb';
import { blogService } from '@/services/blogService';
import { BlogListResponse } from '@/types/site/blog';
import { getProductImageUrl } from '@/lib/image-utils';
import { ArrowUpRight } from 'lucide-react';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1507919909716-c8262e491cde?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1499244571941-37a279d0ccb9?auto=format&fit=crop&q=80&w=800",
];

export default function BlogList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;

    const [blogData, setBlogData] = useState<BlogListResponse>({
        content: [],
        currentPage: 0,
        pageSize: 12,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Journal', path: null }
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await blogService.list(currentPage, 12);
                setBlogData(response);
                setError(null);
            } catch (err: any) {
                console.error('Error loading blog list:', err);
                setError(err.message || 'Failed to load blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white shadow-sm max-w-md">
                    <h2 className="text-2xl font-serif mb-4 text-red-500">Editorial Unavailable</h2>
                    <p className="text-gray-500 font-light mb-8">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const posts = blogData.content || [];

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
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed font-light font-sans text-lg">
                    Explorations in intimacy, education, and the art of living well.
                </p>
            </div>

            <div className="container mx-auto px-6 max-w-7xl py-16">
                <div className="mb-12 flex justify-center md:justify-start">
                    <Breadcrumb items={breadcrumbs} showLastItem={true} />
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 mb-24">
                    {posts.length > 0 ? (
                        posts.map((post, index) => {
                            const finalImageUrl = post.coverImage
                                ? getProductImageUrl('', post.coverImage)
                                : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

                            return (
                                <article key={post.id} className="group flex flex-col">
                                    {/* Image Container */}
                                    <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5F5F7] mb-8 rounded-sm">
                                        <Image
                                            src={finalImageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            loading={index < 3 ? "eager" : "lazy"}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                    </Link>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow">
                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-sans">
                                            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            <div className="h-[1px] flex-1 bg-gray-100"></div>
                                        </div>

                                        {/* Title */}
                                        <Link href={`/blog/${post.slug}`} className="block mb-4">
                                            <h2 className="text-3xl md:text-3xl font-serif text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors leading-[1.2]">
                                                {post.title}
                                            </h2>
                                        </Link>

                                        {/* Summary */}
                                        <p className="text-gray-500 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                                            {post.summary || (post.content && post.content.substring(0, 120)) || 'Explore our latest journal entry...'}
                                        </p>

                                        {/* Link */}
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="mt-auto inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] border-b border-black group-hover:text-[#C5A059] group-hover:border-[#C5A059] transition-all pb-1 w-max"
                                        >
                                            Read Entry <ArrowUpRight size={14} />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-32 text-center border border-dashed border-gray-100">
                            <p className="text-gray-400 font-serif text-xl italic font-light">The journal is currently empty.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {blogData.totalPages > 1 && (
                    <div className="flex justify-center border-t border-gray-50 pt-16">
                        <Pagination
                            currentPage={blogData.currentPage || currentPage}
                            totalPages={blogData.totalPages || 0}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
