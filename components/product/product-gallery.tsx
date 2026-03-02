// components/product/product-gallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom'; // ✅ 引入 Zoom
import 'react-medium-image-zoom/dist/styles.css'; // ✅ 引入样式

interface GalleryImage {
    url: string;
    alt?: string;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productTitle: string;
    badges?: React.ReactNode;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

export default function ProductGallery({ images, productTitle, badges }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false); // ✅ 追踪放大状态

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    const processedImages = useMemo(() => {
        return images.map((image, index) => {
            // 自动识别：如果 URL 包含 '-full'，则判定为全填充模式
            const isFull = image.url.toLowerCase().includes('-full');
            return {
                ...image,
                isFull,
                alt: image.alt || `${productTitle} - Image ${index + 1}`
            };
        });
    }, [images, productTitle]);

    // --- 触摸逻辑 (保持不变) ---
    const handleTouchStart = (clientX: number) => {
        if (isZoomed) return; // 放大时不处理滑动
        setIsDragging(true);
        dragStartX.current = clientX;
        prevTranslate.current = -activeImageIndex * 100;
    };

    const handleTouchMove = (clientX: number) => {
        if (!isDragging || isZoomed) return;
        const diff = clientX - dragStartX.current;
        const movePercent = (diff / window.innerWidth) * 100;
        setCurrentTranslate(prevTranslate.current + movePercent);
    };

    const handleTouchEnd = (clientX: number) => {
        if (!isDragging || isZoomed) return;
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

    // 监听 activeIndex 变化来重置位置
    useEffect(() => {
        setCurrentTranslate(-activeImageIndex * 100);
    }, [activeImageIndex]);

    if (!processedImages || processedImages.length === 0) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
            {/* PC端缩略图 (左侧) */}
            {processedImages.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide p-1">
                    {processedImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`
                                relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300
                                bg-gray-100
                                ${index === activeImageIndex ? 'border-black opacity-100 ring-1 ring-black/5' : 'border-transparent opacity-60 hover:opacity-100'}
                            `}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || ''}
                                fill
                                className="object-contain p-1 mix-blend-multiply"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* 主图区域 (右侧) */}
            <div
                className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 touch-pan-y"
                ref={galleryRef}
                onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
                onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0].clientX)}
                onMouseDown={(e) => handleTouchStart(e.clientX)}
                onMouseMove={(e) => isDragging && handleTouchMove(e.clientX)}
                onMouseUp={(e) => handleTouchEnd(e.clientX)}
                onMouseLeave={() => setIsDragging(false)}
            >
                {/* 徽章 */}
                {badges && (
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                        {badges}
                    </div>
                )}

                {/* 图片容器 */}
                <div
                    className="flex h-full ease-out mix-blend-multiply"
                    style={{
                        transform: `translateX(${currentTranslate}%)`,
                        transition: isDragging ? 'none' : 'transform 300ms ease-out'
                    }}
                >
                    {processedImages.map((image, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
                            {/* ✅ 核心：使用 Zoom 包裹 Image */}
                            {/* onZoomChange 用于禁用滑动，防止在放大时意外切图 */}
                            <Zoom
                                onZoomChange={(isZoomed) => setIsZoomed(isZoomed)}
                                zoomMargin={40} // 放大后的边距
                            >
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={image.url}
                                        alt={image.alt || ''}
                                        // 全填充图（场景图）通常需要更高清
                                        width={image.isFull ? 1200 : 800}
                                        height={image.isFull ? 1200 : 800}
                                        className={`
                        transition-all duration-300
                        ${image.isFull
                                            ? 'object-cover w-full h-full p-0' // ✅ 识别到 -full：全填充，无边距，不使用正片叠底
                                            : 'object-contain p-8 md:p-12 mix-blend-multiply w-auto h-auto' // ❌ 默认：去背图模式
                                        }
                    `}
                                        priority={index === 0}
                                        draggable={false}
                                        placeholder="blur"
                                        blurDataURL={BLUR_DATA_URL}
                                        style={image.isFull
                                            ? { width: '100%', height: '100%' }
                                            : { width: 'auto', height: '100%', maxHeight: '100%' }
                                        }
                                    />
                                </div>
                            </Zoom>
                        </div>
                    ))}
                </div>

                {/* 移动端圆点指示器 */}
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