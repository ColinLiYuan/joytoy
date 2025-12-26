// components/home/hero-section.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getProductImageUrl } from '@/lib/image-utils';

// 🔴 确保这里是那张“黑金丝绸背景 + 钢笔”的宽屏横图
const HERO_IMAGE_PATH = "banner.webp?v=20251226";

export default function HeroSection() {
    const finalHeroImageUrl = getProductImageUrl('', HERO_IMAGE_PATH);

    return (
        // 1. 修改高度：min-h-[85vh] -> h-[90vh] 或 h-screen，让首屏更震撼
        <section className="relative w-full min-h-screen md:h-[90vh] bg-[#050505] overflow-hidden flex items-center">
            {/* --- 背景氛围光效 (保持不变) --- */}
            <div className="absolute top-1/2 right-[-10%] md:right-[5%] -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#C5A059] opacity-10 blur-[120px] rounded-full pointer-events-none" />

            {/* ------------------------------------------------------ */}
            {/* 核心修改区域：把图片层放在底层，做成半屏背景融合 */}
            {/* ------------------------------------------------------ */}
            <div className="absolute top-0 right-0 w-full md:w-[65%] h-full z-0">
                {HERO_IMAGE_PATH && (
                    <>
                        <Image
                            src={finalHeroImageUrl}
                            alt="MythToy Hero Product"
                            fill
                            priority={true}
                            quality={90}
                            // 2. 修改：object-contain -> object-cover
                            // 让图片铺满右半边，不要留黑边
                            className="object-cover object-[72%_center] md:object-center"
                            sizes="100vw"
                        />

                        {/* 3. 魔法遮罩层 (Magic Gradient Overlay) */}
                        {/* 这是一个渐变层，从左边的背景色(#050505)渐变到右边的透明 */}
                        {/* 作用：消除图片的左边缘，让它完美融入背景 */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/10 to-transparent md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/60 md:to-transparent z-10" />

                        {/* 底部遮罩，防止图片切断 */}
                        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
                    </>
                )}
            </div>

            {/* --- 内容容器 --- */}
            <div className="container relative mx-auto px-6 md:px-12 z-20 h-full">
                <div className="flex flex-col md:flex-row items-center h-full">

                    {/* Left: 文字区域 (现在字会浮在图片的渐变边缘上) */}
                    <div className="w-full md:w-1/2 space-y-8 text-center md:text-left pt-20 md:pt-0">
                        <div className="inline-flex items-center gap-3 animate-fade-in-up">
                            <span className="h-[1px] w-8 bg-[#C5A059]"></span>
                            {/* 4. 修改文案：去掉 TOY，改用 Collection 或 Studio */}
                            <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase">
                                Myth Collection
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] tracking-tight drop-shadow-lg">
                            Elegance in <br/>
                            <span className="italic text-[#ffffff]">Darkness</span>.
                        </h1>

                        <p className="text-gray-300 text-lg md:text-xl font-light max-w-lg mx-auto md:mx-0 leading-relaxed drop-shadow-md">
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

                    {/* 右边不需要放 Image 组件了，因为 Image 已经变成背景了 */}
                    <div className="w-full md:w-1/2" />

                </div>
            </div>
        </section>
    );
}