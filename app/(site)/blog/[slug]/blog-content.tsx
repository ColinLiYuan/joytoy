// app/blog/[slug]/blog-content.tsx
'use client';

import dynamic from 'next/dynamic';
import { BlogResponse } from '@/types/site/blog';
import { Calendar, User, Clock, Share2, ThumbsUp, Mail, ArrowRight, CheckCircle2, Copy, List } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { subscribeToNewsletter } from '@/app/actions/email';
import { useToast } from '@/contexts/toastContext';
import { getProductImageUrl } from '@/lib/image-utils';
// ✅ 引入刚才写的配置
import { getAuthor, MARKETING_CONFIG } from '@/lib/constants/authors';
import ProductCard from '@/components/product/product-card';
import { ProductResponse } from '@/types/product';
import type { TocItem } from './page';

// 获取图片 CDN 前缀
const CDN_URL = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH || '';

/**
 * 处理 Markdown 中的图片路径
 * 将相对路径 (myth/blog/xxx.jpg) 拼接为完整 URL
 */
const processMarkdownImages = (content: string): string => {
    if (!content) return '';
    
    // 匹配 Markdown 图片语法: ![alt](path)
    return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, path) => {
        // 如果已经是完整 URL，不处理
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return match;
        }
        
        // 拼接 CDN URL
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const cleanCdn = CDN_URL.endsWith('/') ? CDN_URL.slice(0, -1) : CDN_URL;
        const fullUrl = `${cleanCdn}/${cleanPath}`;
        
        return `![${alt}](${fullUrl})`;
    });
};

const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    {
        ssr: false,
        loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-xl"></div>
    }
);

interface BlogContentProps {
    blog: BlogResponse;
    recommendedProducts: ProductResponse[];
    toc: TocItem[];
}

function headingId(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

export default function BlogContent({ blog, recommendedProducts, toc }: BlogContentProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null);
    const [tocOpen, setTocOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    // 1. 获取作者信息 (动态)
    const author = getAuthor(blog.author);

    // 阅读时间估算
    const readingTime = Math.max(1, Math.ceil((blog.content?.length || 0) / 1000));

    // 处理封面图 URL
    const coverImageUrl = blog.coverImage ? getProductImageUrl('', blog.coverImage) : null;

    // 给渲染后的 heading 加上 id，支持 TOC 锚点跳转
    useEffect(() => {
        if (!contentRef.current || toc.length === 0) return;
        const headings = contentRef.current.querySelectorAll('h2, h3');
        headings.forEach((el) => {
            const id = headingId(el.textContent || '');
            el.setAttribute('id', id);
        });
    }, [toc, blog.content]);

    const scrollToHeading = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTocOpen(false);
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('email', email);

        const result = await subscribeToNewsletter(formData);

        if (result.success) {
            // ✅ 使用配置的折扣码
            setSuccessCode(result.code || MARKETING_CONFIG.defaultDiscountCode);
            showToast('success', 'Welcome!', 'Discount code unlocked!');
        } else {
            showToast('error', 'Error', 'Failed to subscribe. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <article className="pb-24">
            {/* Header Section */}
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

                {/* 顶部作者信息 (动态渲染) */}
                <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden relative">
                        {author.avatar ? (
                            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.role}</p>
                    </div>
                </div>
            </header>

            {/* 封面图区域 */}
            {coverImageUrl && (
                <div className="container mx-auto px-4 max-w-5xl mb-16">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
                        <img
                            src={coverImageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>
                </div>
            )}

            {/* TOC 标题导读 */}
            {toc.length > 0 && (
                <div className="container mx-auto px-4 max-w-3xl mb-12">
                    <div className="bg-[#F9FAFB] border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setTocOpen(!tocOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <span className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                                <List size={16} /> In This Guide
                            </span>
                            <span className="text-xs text-gray-400">{tocOpen ? '−' : '+'}</span>
                        </button>
                        {tocOpen && (
                            <nav className="px-6 pb-4 border-t border-gray-100">
                                <ul className="space-y-1 mt-3">
                                    {toc.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => scrollToHeading(item.id)}
                                                className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors truncate ${
                                                    item.level === 2
                                                        ? 'text-gray-800 font-medium'
                                                        : 'text-gray-500 pl-6'
                                                }`}
                                            >
                                                {item.text}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                <div ref={contentRef} className="prose prose-lg md:prose-xl prose-stone max-w-none font-serif leading-relaxed [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24">
                    <MDViewer
                        source={processMarkdownImages(blog.content || '')}
                        style={{ backgroundColor: 'transparent', fontFamily: 'var(--font-inter)' }}
                    />
                </div>

                {/* Tags & Share */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="px-4 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-6 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-pink-600 transition-colors group">
                            <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold">{blog.likeCount || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-black transition-colors group">
                            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                    </div>
                </div>

                {/* 文章中提到的产品 — 横向滚动 */}
                {recommendedProducts.length > 0 && (
                    <section className="mt-16 -mx-4 sm:mx-0">
                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6 px-4 sm:px-0">
                            Shop This Article
                        </h2>
                        <div className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-2 snap-x snap-mandatory scrollbar-hide">
                            {recommendedProducts.map((product) => (
                                <div key={product.id} className="w-[260px] flex-shrink-0 snap-start">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 底部作者卡片 (动态渲染) */}
                <div className="mt-16 bg-[#F9FAFB] p-8 md:p-10 rounded-2xl flex flex-col md:flex-row items-center gap-8 border border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-sm flex items-center justify-center relative">
                        {author.avatar ? (
                            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={40} className="text-gray-300" />
                        )}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Written By</span>
                        <h3 className="font-serif font-bold text-2xl mb-3 text-gray-900">{author.name}</h3>
                        <p className="text-gray-600 text-base leading-relaxed font-light">
                            {author.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* Newsletter Signup */}
            <section className="container mx-auto px-4 max-w-5xl mt-24">
                <div className="bg-[#1A1A1A] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10">
                            <Mail size={12} /> The Inner Circle
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
                            Unlock <span className="italic text-[#C5A059]">15% Off</span>
                        </h2>

                        {successCode ? (
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl animate-in fade-in zoom-in">
                                <div className="flex flex-col items-center gap-4">
                                    <CheckCircle2 className="text-[#C5A059] w-12 h-12 mb-2" />
                                    <p className="text-white font-serif text-xl">You're on the list.</p>

                                    <div
                                        className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group mt-2"
                                        onClick={() => {
                                            navigator.clipboard.writeText(successCode);
                                            showToast('success', 'Copied!', 'Code copied to clipboard');
                                        }}
                                    >
                                        <span className="text-2xl font-bold tracking-widest font-mono">{successCode}</span>
                                        <Copy size={18} className="text-gray-400 group-hover:text-black" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Tap to copy code</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-400 mb-10 text-lg font-light leading-relaxed">
                                    Join our newsletter for expert intimacy tips, discreet guides, and exclusive member-only offers.
                                </p>
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Processing...' : 'Subscribe'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </article>
    );
}