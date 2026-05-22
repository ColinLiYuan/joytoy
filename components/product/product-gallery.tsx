// components/product/product-gallery.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ZoomIn as ZoomIcon, Play } from 'lucide-react';

const ProductLightbox = dynamic(() => import('./product-lightbox'), { ssr: false });

interface GalleryItem {
    url: string;
    alt?: string;
    type?: 'image' | 'video';
    poster?: string;
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
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const dragStartX = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // 处理图片和视频数据，转换为 Lightbox 格式
    const processedItems = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            type: (image.type || 'image').toLowerCase() as 'image' | 'video', // 统一转小写
            isFull: image.url.toLowerCase().includes('-full'),
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

    // 生成 Lightbox slides
    const lightboxSlides = useMemo(() => {
        return processedItems.map((item) => {
            const isPng = item.url.toLowerCase().match(/\.png($|\?)/) !== null;
            if (item.type === 'video') {
                return {
                    type: 'video' as const,
                    poster: item.poster || item.url,
                    sources: [{
                        src: item.url,
                        type: 'video/mp4'
                    }],
                    alt: item.alt,
                    title: item.alt,
                };
            }
            return {
                src: item.url,
                alt: item.alt,
                title: item.alt,
                width: 1200,
                height: 1200,
                // 标记是否为 PNG，用于渲染时切换背景色
                data: { png: isPng },
            };
        });
    }, [processedItems]);

    // 初始化 videoRefs 数组
    useEffect(() => {
        videoRefs.current = new Array(processedItems.length).fill(null);
    }, [processedItems.length]);

    // 监听索引变化，处理视频自动播放
    useEffect(() => {
        console.log('[ProductGallery] Active index changed:', activeImageIndex, 'Type:', processedItems[activeImageIndex]?.type);
        
        // 停止所有视频
        videoRefs.current.forEach((video) => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // 延迟播放当前视频，等待 DOM 更新
        const timer = setTimeout(() => {
            const currentItem = processedItems[activeImageIndex];
            if (currentItem?.type === 'video') {
                const videoEl = videoRefs.current[activeImageIndex];
                console.log('[ProductGallery] Playing video:', currentItem.url, 'Element:', videoEl);
                if (videoEl) {
                    videoEl.muted = true;
                    videoEl.play().then(() => {
                        console.log('[ProductGallery] Video playing successfully');
                    }).catch(err => {
                        console.error('[ProductGallery] Video autoplay failed:', err);
                    });
                }
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [activeImageIndex, processedItems]);

    // 同步拖拽位置
    useEffect(() => {
        setCurrentTranslate(-activeImageIndex * 100);
        prevTranslate.current = -activeImageIndex * 100;
    }, [activeImageIndex]);

    // 拖拽处理
    const handleStart = (clientX: number) => {
        if (lightboxOpen) return;
        setIsDragging(true);
        dragStartX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || lightboxOpen) return;
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

    // 打开 Lightbox
    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-4">
                {/* 左侧缩略图 (仅PC端) */}
                <div className="hidden md:flex flex-col gap-4 w-20">
                    {processedItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImageIndex(index)}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                                activeImageIndex === index ? 'border-black' : 'border-transparent'
                            } bg-gray-50 group`}
                        >
                            {item.type === 'video' ? (
                                <>
                                    {item.poster ? (
                                        <Image
                                            src={item.poster}
                                            alt={item.alt || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Play className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Play className="w-8 h-8 text-white opacity-80" />
                                    </div>
                                </>
                            ) : (
                                <Image
                                    src={item.url}
                                    alt={item.alt || ''}
                                    fill
                                    className={`transition-all ${
                                        item.isFull ? 'object-cover' : 'object-contain p-1 mix-blend-multiply'
                                    }`}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* 主图区域 */}
                <div
                    className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-3xl overflow-hidden border border-gray-100 bg-gray-100 touch-pan-y cursor-zoom-in"
                    ref={galleryRef}
                    onMouseDown={(e) => handleStart(e.clientX)}
                    onMouseMove={(e) => handleMove(e.clientX)}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                    onTouchEnd={handleEnd}
                    onClick={() => openLightbox(activeImageIndex)}
                >
                    {badges && <div className="absolute top-4 left-4 z-10">{badges}</div>}



                    <div
                        className="flex h-full pointer-events-none"
                        style={{
                            transform: `translateX(${currentTranslate}%)`,
                            transition: isDragging ? 'none' : 'transform 300ms ease-out'
                        }}
                    >
                        {processedItems.map((item, index) => (
                            <div key={index} className="w-full h-full flex-shrink-0 relative flex items-center justify-center pointer-events-auto">
                                {item.type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                        {item.poster && activeImageIndex !== index && (
                                            <Image
                                                src={item.poster}
                                                alt={item.alt || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <video
                                            ref={(el) => {
                                                console.log('[ProductGallery] Video ref set:', index, el);
                                                videoRefs.current[index] = el;
                                            }}
                                            src={item.url}
                                            poster={item.poster || ''}
                                            controls
                                            playsInline
                                            muted
                                            loop
                                            className="w-full h-full object-contain relative z-10"
                                            onLoadedData={() => console.log('[ProductGallery] Video loaded:', index)}
                                            onError={(e) => console.error('[ProductGallery] Video error:', e)}
                                        />
                                    </div>
                                ) : (
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
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 手机端指示器 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                        {processedItems.map((_, idx) => (
                            <div key={idx} className={`w-2 h-2 rounded-full ${idx === activeImageIndex ? 'bg-black w-4' : 'bg-black/20'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 全屏 Lightbox (lazy loaded on interaction) */}
            {lightboxOpen && (
                <ProductLightbox
                    open={lightboxOpen}
                    index={lightboxIndex}
                    slides={lightboxSlides}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    );
}
