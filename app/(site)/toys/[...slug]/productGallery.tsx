// /toys/[slug]/ProductGallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productTitle: string;
    baseUrl: string;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isClient, setIsClient] = useState(false);

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);

    // 只在客户端渲染
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 使用 useMemo 缓存处理后的图片数据
    const processedImages = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

    // 使用 useCallback 优化事件处理函数
    const handleThumbnailClick = useCallback((index: number) => {
        setActiveImageIndex(index);
        setCurrentTranslate(-index * 100);
    }, []);

    const handleTouchStart = useCallback((clientX: number) => {
        setIsDragging(true);
        dragStartX.current = clientX;
        prevTranslate.current = currentTranslate;
    }, [currentTranslate]);

    const handleTouchMove = useCallback((clientX: number) => {
        if (!isDragging) return;

        const diff = clientX - dragStartX.current;
        let newTranslate = prevTranslate.current + (diff / window.innerWidth) * 100 * 0.8;

        // 边界限制
        const maxTranslate = 0;
        const minTranslate = -(processedImages.length - 1) * 100;

        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.3;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * 0.3;
        }

        setCurrentTranslate(newTranslate);
    }, [isDragging, processedImages.length]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        const targetIndex = Math.round(-currentTranslate / 100);
        const clampedIndex = Math.max(0, Math.min(processedImages.length - 1, targetIndex));

        setActiveImageIndex(clampedIndex);
        setCurrentTranslate(-clampedIndex * 100);
    }, [isDragging, currentTranslate, processedImages.length]);

    // 事件处理器
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleTouchStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        handleTouchMove(e.clientX);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        handleTouchEnd();
    };

    const handleTouchStartEvent = (e: React.TouchEvent) => {
        e.preventDefault();
        handleTouchStart(e.touches[0].clientX);
    };

    const handleTouchMoveEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        handleTouchMove(e.touches[0].clientX);
    };

    const handleTouchEndEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        handleTouchEnd();
    };

    // 如果没有图片
    if (!processedImages || processedImages.length === 0) {
        return (
            <div className="relative flex flex-row gap-4 w-full max-w-full overflow-hidden">
                <div className="flex-1 w-full">
                    <div className="rounded-lg border border-gray-200 overflow-hidden relative aspect-[1/1] flex items-center justify-center bg-gray-100">
                        <div className="text-gray-400">No image available</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-row gap-4 w-full max-w-full overflow-hidden">
            {/* 缩略图区域 */}
            {processedImages.length > 1 && (
                <div className="flex flex-col items-center gap-2 w-auto">
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]">
                        {processedImages.map((image, index) => (
                            <div
                                key={index}
                                className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 overflow-hidden cursor-pointer border-2 transition-all duration-300 relative bg-gray-50 rounded-md ${
                                    index === activeImageIndex
                                        ? 'border-black'
                                        : 'border-transparent hover:border-gray-300'
                                }`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt || ''}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 主图区域 */}
            <div className="flex-1 w-full">
                <div
                    className={`rounded-lg overflow-hidden relative aspect-[1/1] flex items-center justify-center
                       w-full max-w-[580px] mx-auto md:max-w-none 
                       shadow-md select-none
                       ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStartEvent}
                    onTouchMove={handleTouchMoveEvent}
                    onTouchEnd={handleTouchEndEvent}
                >
                    <div
                        className="flex w-full h-full transition-transform ease-out"
                        style={{
                            transform: `translateX(${currentTranslate}%)`,
                            transition: isDragging ? 'none' : 'transform 300ms ease-out'
                        }}
                    >
                        {processedImages.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full h-full relative"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt || ''}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    priority={index === 0}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 50vw"
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>

                    {/* 点状指示器 */}
                    {processedImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                            {processedImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === activeImageIndex
                                            ? 'bg-white scale-125'
                                            : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                    onClick={() => handleThumbnailClick(index)}
                                    aria-label={`View image ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}