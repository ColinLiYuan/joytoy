'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
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
        text: "Free shipping on orders over $40",
        link: "/collections/best-sellers"
    }
];

export default function Notice({ onCloseMenu }: PromotionBarProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // 自动轮换促销通知 - 只有多条消息时才轮换
    useEffect(() => {
        if (promotions.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promotions.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const goToPrevSlide = () => {
        if (promotions.length <= 1) return;
        setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
    };

    const goToNextSlide = () => {
        if (promotions.length <= 1) return;
        setCurrentSlide((prev) => (prev + 1) % promotions.length);
    };

    const handlePromotionClick = () => {
        if (onCloseMenu) {
            onCloseMenu();
        }
    };

    return (
        <div
            className="bg-[var(--notice-color)] text-white py-2 overflow-hidden static cursor-pointer relative"
            style={{ zIndex: Z_INDEX.NAVIGATION }} // 在最外层容器设置 z-index
        >
            <div className="flex items-center justify-center relative">
                {/* 只有多条消息时才显示箭头 */}
                {promotions.length > 1 && (
                    <button
                        className="bg-white/20 border-none text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 flex-shrink-0 hover:bg-white/30 hover:scale-110"
                        onClick={goToPrevSlide}
                        aria-label="Previous promotion"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                    </button>
                )}

                <div className="flex w-full flex-1">
                    {promotions.map((promotion, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] text-center px-5 text-sm font-medium"
                            style={{
                                display: index === currentSlide ? 'block' : 'none'
                            }}
                        >
                            <Link
                                href={promotion.link}
                                className="block w-full text-white no-underline py-1 transition-all duration-300 font-semibold hover:text-gray-200 hover:bg-white/10 hover:rounded"
                                onClick={handlePromotionClick}
                            >
                                {promotion.text}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 只有多条消息时才显示箭头 */}
                {promotions.length > 1 && (
                    <button
                        className="bg-white/20 border-none text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 flex-shrink-0 hover:bg-white/30 hover:scale-110"
                        onClick={goToNextSlide}
                        aria-label="Next promotion"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}