'use client';

import Link from 'next/link';
import { Instagram, Mail, ShoppingBag, Sparkles, ChevronRight, Globe } from 'lucide-react';

// 保持统一的 X (Twitter) 图标
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export default function LinksPage() {
    const links = [
        {
            title: 'Official Website',
            description: 'Experience premium ritualistic pleasure',
            href: '/',
            icon: <Globe size={18} />,
            highlight: false
        },
        {
            title: 'Shop All Collections',
            description: 'Explore our latest arrivals and best sellers',
            href: '/collections/all',
            icon: <ShoppingBag size={18} />,
            highlight: false
        },
        {
            title: 'Affiliate Program',
            description: 'Join us and earn up to 25% commission',
            href: '/pages/affiliate',
            icon: <Sparkles size={18} />,
            highlight: true // 重点推荐项
        },
        {
            title: 'Support & Guidance',
            description: 'Discreet assistance for your needs',
            href: 'mailto:support@mythtoy.com',
            icon: <Mail size={18} />,
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-6 py-16 font-['Inter']">

            {/* 顶部 Logo & 品牌名 - 与政策页面同步 */}
            <div className="flex flex-col items-center mb-16 text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-white font-['Playfair_Display'] text-xl font-bold italic">M</span>
                </div>
                <h1 className="text-2xl font-bold font-['Playfair_Display'] tracking-widest uppercase mb-2">
                    MythToy
                </h1>
                <p className="text-[10px] text-gray-400 tracking-[0.4em] uppercase">Elegance in Ritual</p>
            </div>

            {/* 链接列表 */}
            <div className="w-full max-w-md space-y-4">
                {links.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.href}
                        className={`group relative flex items-center justify-between p-5 border transition-all duration-300 rounded-2xl ${
                            link.highlight
                                ? 'border-black bg-black text-white'
                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-white hover:shadow-xl hover:shadow-gray-100'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                link.highlight ? 'bg-white text-black' : 'bg-white text-gray-400 border border-gray-100 shadow-sm group-hover:text-black'
                            }`}>
                                {link.icon}
                            </div>
                            <div>
                                <h2 className={`font-bold text-[14px] tracking-wide ${
                                    link.highlight ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {link.title}
                                </h2>
                                <p className={`text-[10px] font-light mt-0.5 tracking-wide ${
                                    link.highlight ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    {link.description}
                                </p>
                            </div>
                        </div>

                        <ChevronRight size={16} className={`transition-transform duration-300 group-hover:translate-x-1 ${
                            link.highlight ? 'text-white/50' : 'text-gray-300'
                        }`} />
                    </Link>
                ))}
            </div>

            {/* 底部社交 - 保持极简 */}
            <div className="mt-auto pt-20 flex flex-col items-center">
                <div className="flex items-center gap-10 mb-8">
                    <a
                        href="https://instagram.com/mythtoy.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-black hover:-translate-y-1 transition-all duration-300"
                    >
                        <Instagram size={20} />
                    </a>

                    <a
                        href="https://x.com/mythtoyofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-black hover:-translate-y-1 transition-all duration-300"
                    >
                        <XIcon className="w-[18px] h-[18px]" />
                    </a>

                    <a
                        href="mailto:support@mythtoy.com"
                        className="text-gray-400 hover:text-black hover:-translate-y-1 transition-all duration-300"
                    >
                        <Mail size={20} />
                    </a>
                </div>

                <div className="h-[1px] w-8 bg-gray-100 mb-6"></div>
                <p className="text-[9px] tracking-[0.4em] text-gray-300 uppercase font-light">
                    Redefining Intimacy.
                </p>
            </div>
        </div>
    );
}