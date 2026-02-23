'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { Instagram, Mail, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';

// 优化后的 X (Twitter) 图标组件，保持与 Lucide 同样的视觉通透感
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function LinksPage() {
    // 渐变金色文字样式（可用于需要强调的文字）
    const goldGradientText = {
        background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const links = [
        {
            title: 'Shop The Collection',
            description: 'Explore our ritualistic Black Gold series',
            href: '/collections/all',
            icon: <ShoppingBag size={18} />,
            highlight: false
        },
        {
            title: 'Join Beta Program',
            description: 'Apply to be a Pioneer & get a free Onyx',
            href: '/pioneer',
            icon: <Sparkles size={18} />,
            highlight: true // 现阶段重点：带呼吸灯效果
        },
        {
            title: 'Contact Support',
            description: 'Discrete assistance for our members',
            href: 'mailto:support@mythtoy.com',
            icon: <Mail size={18} />,
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-6 py-20 font-['Inter']">

            {/* 顶部 Logo & 品牌名 */}
            <div className="flex flex-col items-center mb-16 text-center">
                <h1 className="text-2xl font-bold font-['Playfair_Display'] tracking-widest uppercase mb-2">
                    MythToy
                </h1>
                <p className="text-xs text-gray-500 tracking-[0.3em] uppercase">Elegance in Darkness</p>
            </div>

            {/* 链接列表 */}
            <div className="w-full max-w-md space-y-4">
                {links.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.href}
                        className={`group relative flex items-center justify-between p-5 border transition-all duration-500 rounded-xl ${
                            link.highlight
                                ? 'border-[#C5A059] bg-[#C5A059]/5 shadow-[0_0_20px_rgba(197,160,89,0.1)]'
                                : 'border-white/10 bg-white/5 hover:border-[#C5A059]/50'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                link.highlight ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-400 group-hover:text-[#C5A059]'
                            }`}>
                                {link.icon}
                            </div>
                            <div>
                                <h2 className={`font-bold text-sm tracking-wide transition-colors ${
                                    link.highlight ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                }`}>
                                    {link.title}
                                </h2>
                                <p className="text-[10px] text-gray-500 font-light mt-0.5 tracking-wider">
                                    {link.description}
                                </p>
                            </div>
                        </div>

                        <ChevronRight size={16} className={`transition-transform duration-300 group-hover:translate-x-1 ${
                            link.highlight ? 'text-[#C5A059]' : 'text-gray-700'
                        }`} />

                        {/* 金色呼吸灯动画仅针对 highlight 项 */}
                        {link.highlight && (
                            <div className="absolute inset-0 rounded-xl border border-[#C5A059] animate-pulse-gold pointer-events-none" />
                        )}
                    </Link>
                ))}
            </div>

            {/* 底部社交 - 优化后的极简风格 */}
            <div className="mt-auto pt-20 flex flex-col items-center">
                <div className="flex items-center gap-8 mb-8">
                    <a
                        href="https://instagram.com/mythtoy.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#C5A059] hover:-translate-y-1 transition-all duration-300"
                    >
                        <Instagram size={22} />
                    </a>

                    <a
                        href="https://x.com/mythtoyofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-[#C5A059] hover:-translate-y-1 transition-all duration-300"
                    >
                        <XIcon className="w-[19px] h-[19px]" />
                    </a>

                    <a
                        href="mailto:support@mythtoy.com"
                        className="text-gray-500 hover:text-[#C5A059] hover:-translate-y-1 transition-all duration-300"
                    >
                        <Mail size={22} />
                    </a>
                </div>

                <div className="h-[1px] w-12 bg-white/10 mb-6"></div>
                <p className="text-[9px] tracking-[0.4em] text-gray-700 uppercase font-light">
                    Unveil the ritual.
                </p>
            </div>

            {/* 全局动画定义 */}
            <style jsx global>{`
                @keyframes pulse-gold {
                    0% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.4); }
                    70% { box-shadow: 0 0 0 8px rgba(197, 160, 89, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0); }
                }
                .animate-pulse-gold {
                    animation: pulse-gold 2s infinite;
                }
            `}</style>
        </div>
    );
}