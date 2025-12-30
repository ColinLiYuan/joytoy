// components/collection/collection-hero.tsx
'use client';

import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';

interface CollectionHeroProps {
    title: string;
    description?: string;
    imagePath?: string;
}

export default function CollectionHero({ title, description, imagePath }: CollectionHeroProps) {
    if (!imagePath) return (
        <div className="py-16 text-center bg-gray-50 border-b border-gray-100">
            <h1 className="text-4xl font-serif text-gray-900 mb-4">{title}</h1>
            {description && <p className="text-gray-500 max-w-2xl mx-auto px-4 font-light">{description}</p>}
        </div>
    );

    const imageUrl = getProductImageUrl('', imagePath);

    return (
        // 外部容器：纯黑背景
        <div className="w-full bg-[#050505] border-b shadow-lg border-white/10 overflow-hidden">
            {/* Flex容器：PC端左右分栏 (row)，手机端上下分栏 (col) */}
            <div className="flex flex-col md:flex-row h-auto md:h-[450px]">

                {/* 1. 左侧文字区 (PC: 40% 宽度, 手机: 自适应) */}
                <div className="w-full md:w-[40%] flex flex-col justify-center px-8 py-12 md:px-16 md:py-0 bg-[#050505] text-center md:text-left relative z-10 order-2 md:order-1">

                    {/* 金色装饰线 */}
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                        <span className="h-[1px] w-8 bg-[#C5A059]"></span>
                        <span className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase">
                            Collection
                        </span>
                    </div>

                    {/* 大标题 */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 tracking-tight leading-tight">
                        {title}
                    </h1>

                    {/* 描述文案 */}
                    {description && (
                        <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto md:mx-0">
                            {description}
                        </p>
                    )}
                </div>

                {/* 2. 右侧图片区 (PC: 60% 宽度) */}
                <div className="w-full md:w-[60%] relative h-[300px] md:h-full order-1 md:order-2">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        priority
                        className="object-cover"
                        style={{ objectPosition: 'right center' }}
                        sizes="(max-width: 768px) 100vw, 60vw"
                    />

                    {/* 边缘融合遮罩：只在 PC 端左侧加一个渐变，让图和左边的黑色无缝衔接 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r md:from-[#050505] md:via-transparent md:to-transparent opacity-100" />
                </div>

            </div>
        </div>
    );
}