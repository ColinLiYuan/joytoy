// components/home/hero-section.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
// 1. 引入工具函数
import { getProductImageUrl } from '@/lib/image-utils';

// 🔴 2. 这里只需要填你在 Cloudflare (或后台) 保存的那个“路径”或“文件名”
// 不需要填完整的 https://...，工具函数会自动拼接前缀
const HERO_IMAGE_PATH = "banner.webp?v=20241216"; // 示例文件名，请替换为你上传的具体文件名

export default function HeroSection() {

    // 3. 使用工具函数生成最终的 URL
    // 第一个参数传空字符串 ''，第二个参数传路径，逻辑与详情页完全一致
    const finalHeroImageUrl = getProductImageUrl('', HERO_IMAGE_PATH);

    return (
        <section className="relative w-full min-h-[85vh] bg-[#050505] overflow-hidden flex items-center">

            {/* --- 背景氛围光效 --- */}
            <div className="absolute top-1/2 right-[-10%] md:right-[5%] -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C5A059] opacity-20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            {/* --- 内容容器 --- */}
            <div className="container relative mx-auto px-6 md:px-12 z-10 h-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 h-full py-20">

                    {/* Left: 文字区域 */}
                    <div className="w-full md:w-1/2 space-y-8 text-center md:text-left order-2 md:order-1">
                        <div className="inline-flex items-center gap-3 animate-fade-in-up">
                            <span className="h-[1px] w-8 bg-[#C5A059]"></span>
                            <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase">
                                Myth Toy Exclusive
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tight">
                            Elegance in <br/>
                            <span className="italic text-[#ffffff]/90">Darkness</span>.
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl font-light max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Curated pleasure objects for the modern lifestyle.
                            Where wellness meets technological artistry.
                        </p>

                        <div className="pt-4">
                            <Link
                                href="/collections/all"
                                className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-black hover:bg-[#C5A059] hover:text-white transition-all duration-300 rounded-full"
                            >
                                <span className="text-sm font-bold uppercase tracking-widest">Shop The Collection</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: 图片区域 */}
                    <div className="w-full md:w-1/2 relative h-[40vh] md:h-[70vh] flex items-center justify-center order-1 md:order-2">
                        <div className="relative w-full h-full">
                            {HERO_IMAGE_PATH ? (
                                <Image
                                    src={finalHeroImageUrl} // 4. 使用处理后的 URL
                                    alt="MythToy Hero Product"
                                    fill
                                    priority{true}
                                    className="object-contain drop-shadow-2xl animate-float"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full border border-white/10 flex items-center justify-center text-white/20">
                                    <p>Image Placeholder</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}