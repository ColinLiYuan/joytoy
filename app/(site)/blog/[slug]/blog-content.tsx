// app/blog/[slug]/blog-content.tsx
'use client';

import dynamic from 'next/dynamic';
import { BlogResponse } from '@/types/site/blog';
import { Calendar, User, Clock, Eye, Share2, ThumbsUp } from 'lucide-react';

// 动态导入 MD 渲染器（客户端渲染，防止 Hydration Error）
const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false, loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-xl"></div> }
);

interface BlogContentProps {
    blog: BlogResponse;
}

export default function BlogContent({ blog }: BlogContentProps) {

    // 计算阅读时间 (粗略估计)
    const readingTime = Math.max(1, Math.ceil(blog.content.length / 1000));

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
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl">
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
                <div className="prose prose-lg md:prose-xl prose-stone max-w-none
                    prose-headings:font-['Playfair_Display'] prose-headings:font-bold
                    prose-a:text-pink-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-blockquote:border-l-4 prose-blockquote:border-pink-500 prose-blockquote:bg-pink-50/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                ">
                    <MDViewer source={blog.content} />
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

            {/* Custom Styles for Markdown */}
            <style jsx global>{`
                .wmde-markdown {
                    background: transparent !important;
                    color: #374151 !important; /* text-gray-700 */
                }
                /* 修复列表样式 */
                .wmde-markdown ul { list-style-type: disc !important; padding-left: 1.5em !important; }
                .wmde-markdown ol { list-style-type: decimal !important; padding-left: 1.5em !important; }
                /* 修复表格 */
                .wmde-markdown table { width: 100%; border-collapse: collapse; margin: 2em 0; }
                .wmde-markdown th { text-align: left; padding: 0.75em; background: #f9fafb; border-bottom: 2px solid #e5e7eb; }
                .wmde-markdown td { padding: 0.75em; border-bottom: 1px solid #e5e7eb; }
            `}</style>
        </article>
    );
}