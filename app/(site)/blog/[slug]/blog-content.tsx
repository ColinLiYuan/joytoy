// app/blog/[slug]/blog-content.tsx
'use client';

import dynamic from 'next/dynamic';
import { BlogResponse } from '@/types/site/blog';
import { Calendar, User, Clock, Share2, ThumbsUp } from 'lucide-react';

// 动态导入 MD 渲染器
const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    {
        ssr: false,
        loading: () => (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
        )
    }
);

interface BlogContentProps {
    blog: BlogResponse;
}

export default function BlogContent({ blog }: BlogContentProps) {

    // 简单的阅读时间估算
    const readingTime = Math.max(1, Math.ceil((blog.content?.length || 0) / 1000));

    return (
        <article className="pb-24">
            {/* Article Header */}
            <header className="container mx-auto px-4 max-w-4xl mb-12 text-center">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6 font-medium uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {readingTime} min read
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-['Playfair_Display'] leading-tight">
                    {blog.title}
                </h1>

                {blog.subTitle && (
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed italic mb-8 font-serif">
                        {blog.subTitle}
                    </p>
                )}

                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{blog.author || 'MythToy Editorial'}</p>
                        <p className="text-xs text-gray-500">Wellness Expert</p>
                    </div>
                </div>
            </header>

            {/* Cover Image */}
            {blog.coverImage && (
                <div className="container mx-auto px-4 max-w-5xl mb-16">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        {/* 使用 img 标签避免 next/image 的域名配置问题，或者如果你配置好了可以用 Image */}
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                {/* ✅ 核心修复：移除内联 Style，依靠 globals.css */}
                <div className="prose prose-lg md:prose-xl prose-stone max-w-none">
                    {/* 这里的 source 即使有错，通常只会渲染乱码，不会导致 SyntaxError */}
                    <MDViewer source={blog.content || ''} />
                </div>

                {/* Tags & Share */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                            <ThumbsUp size={18} />
                            <span className="text-sm font-bold">{blog.likeCount || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-black transition-colors">
                            <Share2 size={18} />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}