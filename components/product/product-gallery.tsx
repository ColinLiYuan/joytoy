// components/product/product-gallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

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
    const [isZoomed, setIsZoomed] = useState(false);

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    // 1. 自动识别：文件名包含 -full
    const processedImages = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            isFull: image.url.toLowerCase().includes('-full'),
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

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
        if (nextTranslate <= 0 && nextTranslate >= -(processedImages.length - 1) * 100) {
            setCurrentTranslate(nextTranslate);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const movedBy = currentTranslate - prevTranslate.current;
        if (movedBy < -15 && activeImageIndex < processedImages.length - 1) {
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
                {processedImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            activeImageIndex === index ? 'border-black' : 'border-transparent'
                        } bg-gray-50`}
                    >
                        <Image
                            src={image.url}
                            alt={image.alt || ''}
                            fill
                            className={`transition-all ${
                                image.isFull ? 'object-cover' : 'object-contain p-1 mix-blend-multiply'
                            }`}
                        />
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
                    {processedImages.map((image, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
                            <Zoom
                                onZoomChange={(isZoomed) => setIsZoomed(isZoomed)}
                                zoomMargin={40}
                            >
                                {/* 这里的 background 是 mix-blend-multiply 生效的关键 */}
                                <div className={`relative w-full h-full flex items-center justify-center ${image.isFull ? '' : 'bg-gray-100'}`}>
                                    <Image
                                        src={image.url}
                                        alt={image.alt || ''}
                                        width={1200}
                                        height={1200}
                                        priority={index === 0}
                                        className={`transition-all duration-300 ${
                                            image.isFull
                                                ? 'object-cover w-full h-full p-0'
                                                : 'object-contain p-8 md:p-12 mix-blend-multiply'
                                        }`}
                                        style={image.isFull
                                            ? { width: '100%', height: '100%', objectFit: 'cover' }
                                            : { width: 'auto', height: '100%', maxWidth: '100%' }
                                        }
                                    />
                                </div>
                            </Zoom>
                        </div>
                    ))}
                </div>

                {/* 指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                    {processedImages.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${idx === activeImageIndex ? 'bg-black w-4' : 'bg-black/20'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}