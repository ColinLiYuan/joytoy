'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Z_INDEX } from '@/lib/constants/z-index';

interface Promotion {
    text: string;
    link: string;
}

interface PromotionBarProps {
    onCloseMenu?: () => void;
}

const promotions: Promotion[] = [
    {
        text: "Free discreet shipping on orders over $40",
        link: "/collections/best-sellers"
    },
    {
        text: "New Collection Dropped: Curated for Your Pleasure",
        link: "/collections/new-arrivals"
    }
];

export default function Notice({ onCloseMenu }: PromotionBarProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // 1. 修复：更稳健的首页隐藏逻辑
    // 使用 useEffect 确保只在客户端判断，避免服务端渲染不一致导致的闪烁
    useEffect(() => {
        if (pathname === '/' || pathname === '/checkout') {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    useEffect(() => {
        if (promotions.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 如果不应该显示，直接返回 null
    if (!isVisible) {
        return null;
    }

    const goToPrevSlide = () => {
        if (promotions.length <= 1) return;
        setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    };

    const goToNextSlide = () => {
        if (promotions.length <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % promotions.length);
    };

    return (
        // 2. 修复：z-index 改为 40 (比导航栏低)，防止盖住下拉菜单
        <div
            className="bg-gray-900 text-white py-2.5 overflow-hidden relative"
            style={{ zIndex: Z_INDEX.NOTICE }}
        >
            <div className="container mx-auto px-4 max-w-7xl flex items-center justify-center relative">

                {/* 左箭头 */}
                {promotions.length > 1 && (
                    <button
                        className="absolute left-4 md:static p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        onClick={goToPrevSlide}
                        aria-label="Previous promotion"
                    >
                        <ChevronLeft size={14} />
                    </button>
                )}

                {/* 文本内容 */}
                <div className="flex-1 relative h-5 overflow-hidden mx-4">
                    {promotions.map((promotion, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex items-center justify-center w-full transition-all duration-500 ease-in-out ${
                                index === currentSlide
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-full pointer-events-none'
                            }`}
                        >
                            <Link
                                href={promotion.link}
                                className="text-xs md:text-sm font-medium tracking-wide hover:underline decoration-pink-500 underline-offset-4 transition-all text-center truncate px-2"
                                onClick={onCloseMenu}
                            >
                                {promotion.text}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 右箭头 */}
                {promotions.length > 1 && (
                    <button
                        className="absolute right-4 md:static p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        onClick={goToNextSlide}
                        aria-label="Next promotion"
                    >
                        <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}