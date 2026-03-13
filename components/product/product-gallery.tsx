// components/product/product-gallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface GalleryItem {
    url: string;
    alt?: string;
    type?: 'image' | 'video'; // 增加类型区分
    poster?: string;         // 视频封面图
}

interface ProductGalleryProps {
    images: GalleryItem[];
    productTitle: string;
    badges?: React.ReactNode;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

export default function ProductGallery({ images, productTitle, badges }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    // --- 核心修改：增加视频引用管理 ---
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const processedItems = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            isFull: image.url.toLowerCase().includes('-full'),
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

    // --- 核心修改：监听索引变化，强制触发播放 ---
    useEffect(() => {
        const currentItem = processedItems[activeImageIndex];
        if (currentItem?.type === 'video') {
            const videoEl = videoRefs.current[activeImageIndex];
            if (videoEl) {
                videoEl.muted = true; // 浏览器自动播放必须静音
                videoEl.play().catch(err => console.log("Autoplay blocked:", err));
            }
        }

        // 停止其他页面的视频，释放性能
        videoRefs.current.forEach((video, idx) => {
            if (idx !== activeImageIndex && video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [activeImageIndex, processedItems]);

    useEffect(() => {
        setCurrentTranslate(-activeImageIndex * 100);
        prevTranslate.current = -activeImageIndex * 100;
    }, [activeImageIndex]);

    const handleStart = (clientX: number) => {
        if (isZoomed) return;
        setIsDragging(true);
        dragStartX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || isZoomed) return;
        const deltaX = clientX - dragStartX.current;
        const movePercent = (deltaX / (galleryRef.current?.offsetWidth || 1)) * 100;
        const nextTranslate = prevTranslate.current + movePercent;
        if (nextTranslate <= 0 && nextTranslate >= -(processedItems.length - 1) * 100) {
            setCurrentTranslate(nextTranslate);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const movedBy = currentTranslate - prevTranslate.current;
        if (movedBy < -15 && activeImageIndex < processedItems.length - 1) {
            setActiveImageIndex(prev => prev + 1);
        } else if (movedBy > 15 && activeImageIndex > 0) {
            setActiveImageIndex(prev => prev - 1);
        } else {
            setCurrentTranslate(-activeImageIndex * 100);
        }
        prevTranslate.current = -activeImageIndex * 100;
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* 左侧缩略图 */}
            <div className="hidden md:flex flex-col gap-4 w-20">
                {processedItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            activeImageIndex === index ? 'border-black' : 'border-transparent'
                        } bg-gray-50`}
                    >
                        <Image
                            src={item.type === 'video' ? (item.poster || item.url) : item.url}
                            alt={item.alt || ''}
                            fill
                            className={`transition-all ${
                                item.isFull ? 'object-cover' : 'object-contain p-1 mix-blend-multiply'
                            }`}
                        />

                        {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <svg className="w-8 h-8 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* 主图区域 */}
            <div
                className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden border border-gray-100 bg-gray-100 touch-pan-y"
                ref={galleryRef}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
            >
                {badges && <div className="absolute top-4 left-4 z-10">{badges}</div>}

                <div
                    className="flex h-full"
                    style={{
                        transform: `translateX(${currentTranslate}%)`,
                        transition: isDragging ? 'none' : 'transform 300ms ease-out'
                    }}
                >
                    {processedItems.map((item, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
                            {item.type === 'video' ? (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <video
                                        ref={(el) => (videoRefs.current[index] = el)} // 绑定引用
                                        src={item.url}
                                        poster={item.poster}
                                        controls
                                        playsInline
                                        muted
                                        loop
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ) : (
                                <Zoom
                                    onZoomChange={(isZoomed) => setIsZoomed(isZoomed)}
                                    zoomMargin={40}
                                >
                                    <div className={`relative w-full h-full flex items-center justify-center ${item.isFull ? '' : 'bg-gray-100'}`}>
                                        <Image
                                            src={item.url}
                                            alt={item.alt || ''}
                                            width={1200}
                                            height={1200}
                                            priority={index === 0}
                                            className={`transition-all duration-300 ${
                                                item.isFull
                                                    ? 'object-cover w-full h-full p-0'
                                                    : 'object-contain p-8 md:p-12 mix-blend-multiply'
                                            }`}
                                            style={item.isFull
                                                ? { width: '100%', height: '100%', objectFit: 'cover' }
                                                : { width: 'auto', height: '100%', maxWidth: '100%' }
                                            }
                                        />
                                    </div>
                                </Zoom>
                            )}
                        </div>
                    ))}
                </div>

                {/* 指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                    {processedItems.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${idx === activeImageIndex ? 'bg-black w-4' : 'bg-black/20'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}