// app/blog/[slug]/blog-content.tsx
'use client';

import dynamic from 'next/dynamic';
import { BlogResponse } from '@/types/site/blog';
import { Calendar, User, Clock, Share2, ThumbsUp, Mail, ArrowRight, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/subscribe'; // ✅ 引入 Action
import { useToast } from '@/contexts/toastContext';

// 动态导入 MD 渲染器
const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    {
        ssr: false,
        loading: () => <div className="h-96 bg-gray-50 animate-pulse rounded-xl"></div>
    }
);

interface BlogContentProps {
    blog: BlogResponse;
}

export default function BlogContent({ blog }: BlogContentProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null); // ✅ 存储折扣码
    const { showToast } = useToast();

    // 简单的阅读时间估算
    const readingTime = Math.max(1, Math.ceil((blog.content?.length || 0) / 1000));

    // 处理订阅
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append('email', email);

        const result = await subscribeToNewsletter(formData);

        if (result.success) {
            setSuccessCode(result.code || 'MYTH20');
            showToast('success', 'Welcome!', 'Discount code unlocked!');
        } else {
            showToast('error', 'Error', 'Failed to subscribe. Please try again.');
        }
        setIsLoading(false);
    };

    // 默认作者信息
    const authorInfo = {
        name: blog.author || "Colin Li",
        role: "Founder & Product Expert",
        bio: "With 8+ years in adult toy manufacturing, Colin bridges the gap between source factories and your bedroom, ensuring premium quality without the markup."
    };

    return (
        <article className="pb-24">
            {/* 1. Article Header */}
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
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                        <User size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{authorInfo.name}</p>
                        <p className="text-xs text-gray-500">{authorInfo.role}</p>
                    </div>
                </div>
            </header>

            {/* 2. Cover Image */}
            {blog.coverImage && (
                <div className="container mx-auto px-4 max-w-5xl mb-16">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* 3. Main Content */}
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="prose prose-lg md:prose-xl prose-stone max-w-none">
                    <MDViewer source={blog.content || ''} />
                </div>

                {/* 4. Tags & Share */}
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
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

                {/* 5. Author Bio Card */}
                <div className="mt-16 bg-gray-50 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 border border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm flex items-center justify-center">
                        <User size={32} className="text-gray-300" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h3 className="font-['Playfair_Display'] font-bold text-xl mb-2 text-gray-900">About {authorInfo.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {authorInfo.bio}
                        </p>
                    </div>
                </div>
            </div>

            {/* 6. Newsletter Signup (Black & Gold Style) */}
            <section className="container mx-auto px-4 max-w-5xl mt-20">
                <div className="bg-black rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            <Mail size={12} /> Join the Club
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-['Playfair_Display']">
                            Unlock Your 20% Discount
                        </h2>

                        {successCode ? (
                            // 成功状态：显示折扣码
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl animate-in fade-in zoom-in">
                                <div className="flex flex-col items-center gap-3">
                                    <CheckCircle2 className="text-green-400 w-10 h-10 mb-2" />
                                    <p className="text-green-300 font-bold text-lg">You're on the list!</p>
                                    <p className="text-gray-300 text-sm">Here is your exclusive code:</p>

                                    <div
                                        className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors group"
                                        onClick={() => {
                                            navigator.clipboard.writeText(successCode);
                                            showToast('success', 'Copied!', 'Code copied to clipboard');
                                        }}
                                    >
                                        <span className="text-xl font-bold tracking-widest">{successCode}</span>
                                        <Copy size={16} className="text-gray-400 group-hover:text-black" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Click code to copy</p>
                                </div>
                            </div>
                        ) : (
                            // 默认状态：订阅表单
                            <>
                                <p className="text-gray-400 mb-8 text-lg">
                                    Join our newsletter for expert tips, discreet guides, and exclusive member-only offers. No spam, just pleasure.
                                </p>
                                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? 'Processing...' : <><span className="hidden sm:inline">Subscribe</span><ArrowRight size={18} /></>}
                                    </button>
                                </form>
                                <p className="text-xs text-gray-500 mt-6">
                                    By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black z-0"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
                </div>
            </section>

            {/* 7. Related Posts (Placeholder) */}
            <div className="container mx-auto px-4 max-w-5xl mt-20">
                <h3 className="text-2xl font-bold text-center mb-10 font-['Playfair_Display']">You Might Also Like</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
                        <p className="text-xs text-pink-600 font-bold uppercase mb-3 tracking-wide">Beginner's Guide</p>
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">How to Clean Your Toys: The Ultimate Hygiene Guide</h4>
                        <p className="text-gray-500 text-sm line-clamp-2">Keep your collection fresh and body-safe with these simple cleaning steps.</p>
                    </div>
                    <div className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
                        <p className="text-xs text-pink-600 font-bold uppercase mb-3 tracking-wide">Reviews</p>
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">Top 5 Quietest Vibrators for Shared Living</h4>
                        <p className="text-gray-500 text-sm line-clamp-2">Don't let thin walls stop your fun. We tested the decibels for you.</p>
                    </div>
                </div>
            </div>
        </article>
    );
}