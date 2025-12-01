'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function MinimalNavigation() {
    return (
        <header className="bg-white border-b border-gray-100 py-4 sm:py-5">
            <div className="container mx-auto px-4 flex items-center justify-center">
                {/* ✅ 只有 Logo，居中显示，去除干扰 */}
                <Link href="/" className="flex-shrink-0 group relative flex items-center justify-center">
                    {/* 保持和主导航一致的 Logo 尺寸逻辑 */}
                    <div className="relative w-32 h-8 sm:w-40 sm:h-10">
                        {/* 如果你没有 SVG logo，可以暂时用文字，但建议统一用 Image */}
                        {/* <Image src="/logo.svg" alt="MythToy Logo" fill className="object-contain" priority /> */}
                        <span className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">
                            MythToy
                         </span>
                    </div>
                </Link>
            </div>
        </header>
    );
}