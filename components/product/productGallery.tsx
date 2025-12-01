// /componets/product/productGallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productTitle: string;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    const processedImages = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

    const handleTouchStart = (clientX: number) => {
        setIsDragging(true);
        dragStartX.current = clientX;
        prevTranslate.current = -activeImageIndex * 100;
    };

    const handleTouchMove = (clientX: number) => {
        if (!isDragging) return;
        const diff = clientX - dragStartX.current;
        const movePercent = (diff / window.innerWidth) * 100;
        setCurrentTranslate(prevTranslate.current + movePercent);
    };

    const handleTouchEnd = (clientX: number) => {
        setIsDragging(false);
        const diff = clientX - dragStartX.current;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && activeImageIndex > 0) {
                setActiveImageIndex(prev => prev - 1);
            } else if (diff < 0 && activeImageIndex < processedImages.length - 1) {
                setActiveImageIndex(prev => prev + 1);
            }
        } else {
            // 回弹
            setCurrentTranslate(-activeImageIndex * 100);
        }
    };

    useEffect(() => {
        setCurrentTranslate(-activeImageIndex * 100);
    }, [activeImageIndex]);

    if (!processedImages || processedImages.length === 0) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            {/* 1. 缩略图区域 (Thumbnails) */}
            {processedImages.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] scrollbar-hide p-1">
                    {processedImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`
                                relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300
                                /* ✅ 缩略图也加上灰底和 contain */
                                bg-gray-50
                                ${index === activeImageIndex ? 'border-black opacity-100 ring-2 ring-black/5' : 'border-transparent opacity-60 hover:opacity-100'}
                            `}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || ''}
                                fill
                                className="object-contain p-1 mix-blend-multiply" // p-1 稍微留点白
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* 2. 主图区域 (Main Gallery) */}
            <div
                className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-50 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-100"
                ref={galleryRef}
                onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
                onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
                onMouseDown={(e) => handleTouchStart(e.clientX)}
                onMouseMove={(e) => isDragging && handleTouchMove(e.clientX)}
                onMouseUp={(e) => handleTouchEnd(e.clientX)}
                onMouseLeave={() => setIsDragging(false)}
            >
                <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{
                        transform: `translateX(${currentTranslate}%)`,
                        transition: isDragging ? 'none' : 'transform 300ms ease-out'
                    }}
                >
                    {processedImages.map((image, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <Image
                                src={image.url}
                                alt={image.alt || ''}
                                fill
                                // ✅ 核心修改：使用 contain + padding + 混合模式
                                className="object-contain p-4 md:p-8 mix-blend-multiply"
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                draggable={false}
                                placeholder="blur"
                                blurDataURL={BLUR_DATA_URL}
                            />
                        </div>
                    ))}
                </div>

                {/* 移动端圆点 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden z-10">
                    {processedImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === activeImageIndex ? 'bg-black w-4' : 'bg-black/20'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}