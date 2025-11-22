// productGallery.tsx
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
    baseUrl: string;
}

export default function ProductGallery({ images, productTitle }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isClient, setIsClient] = useState(false);

    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const dragStartTime = useRef(0);
    const dragEndTime = useRef(0);
    const prevTranslate = useRef(0);
    const galleryRef = useRef<HTMLDivElement>(null);

    // 修复水合不匹配：在客户端渲染后才设置状态
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 使用 useMemo 缓存处理后的图片数据，避免重复渲染
    const processedImages = useMemo(() => {
        return images.map((image, index) => ({
            ...image,
            alt: image.alt || `${productTitle} - Image ${index + 1}`
        }));
    }, [images, productTitle]);

    // 获取全局CSS变量值 - 添加客户端检查
    const getCssVariable = (variableName: string, defaultValue: string): number => {
        if (!isClient) return parseFloat(defaultValue);

        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();

        return parseFloat(value || defaultValue);
    };

    // 触摸开始
    const handleTouchStart = (clientX: number) => {
        setIsDragging(true);
        dragStartX.current = clientX;
        dragCurrentX.current = clientX;
        dragStartTime.current = Date.now();
        prevTranslate.current = currentTranslate;
    };

    // 触摸移动
    const handleTouchMove = (clientX: number) => {
        if (!isDragging) return;
        dragCurrentX.current = clientX;

        const diff = clientX - dragStartX.current;

        // 使用全局变量控制灵敏度
        const sensitivity = isClient ? getCssVariable('--gallery-sensitivity', '0.8') : 0.8;

        let newTranslate = prevTranslate.current + (diff / window.innerWidth) * 100 * sensitivity;

        // 边界限制
        const maxTranslate = 0;
        const minTranslate = -(processedImages.length - 1) * 100;

        // 使用全局变量控制边界弹性
        const boundaryElasticity = isClient ? getCssVariable('--gallery-boundary-elasticity', '0.3') : 0.3;

        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * boundaryElasticity;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * boundaryElasticity;
        }

        setCurrentTranslate(newTranslate);
    };

    // 触摸结束
    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        dragEndTime.current = Date.now();

        const diff = dragCurrentX.current - dragStartX.current;
        const timeDiff = Math.max(1, dragEndTime.current - dragStartTime.current);

        // 计算滑动速度
        const speed = Math.abs(diff) / (timeDiff / 1000);

        // 使用全局变量控制距离阈值
        const distanceThreshold = isClient ? getCssVariable('--gallery-distance-threshold', '0.25') : 0.25;
        const screenThreshold = isClient ? window.innerWidth * distanceThreshold : 100;

        let slidesToMove = 0;

        // 基本规则：滑动距离超过阈值时切换一张
        if (Math.abs(diff) > screenThreshold) {
            slidesToMove = 1;
        }

        // 使用全局变量控制速度阈值
        const minSpeed = isClient ? getCssVariable('--gallery-min-speed', '600') : 600;
        const speedRatio = isClient ? getCssVariable('--gallery-speed-ratio', '300') : 300;

        // 根据速度增加额外的切换数量
        if (speed > minSpeed) {
            const extraSlides = Math.floor((speed - minSpeed) / speedRatio);
            slidesToMove += extraSlides;
        }

        // 限制跳转数量
        slidesToMove = Math.min(slidesToMove, processedImages.length - 1);

        let targetIndex;
        if (diff > 0) {
            targetIndex = Math.max(0, activeImageIndex - slidesToMove);
        } else {
            targetIndex = Math.min(processedImages.length - 1, activeImageIndex + slidesToMove);
        }

        setActiveImageIndex(targetIndex);
        setCurrentTranslate(-targetIndex * 100);
    };

    // 鼠标事件处理（用于桌面测试）
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

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            handleTouchEnd();
        }
    };

    // 触摸事件 - 修复：阻止默认行为
    const handleTouchStartEvent = (e: React.TouchEvent) => {
        // 阻止默认行为，防止浏览器滚动
        e.preventDefault();
        handleTouchStart(e.touches[0].clientX);
    };

    const handleTouchMoveEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        // 阻止默认行为，防止浏览器滚动
        e.preventDefault();
        handleTouchMove(e.touches[0].clientX);
    };

    const handleTouchEndEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        // 阻止默认行为
        e.preventDefault();
        handleTouchEnd();
    };

    // 添加被动事件监听器修复 - 防止控制台警告和确保阻止默认行为生效
    useEffect(() => {
        const galleryElement = galleryRef.current;
        if (!galleryElement) return;

        // 添加被动事件监听器来阻止触摸移动的默认行为
        const preventDefault = (e: Event) => {
            if (isDragging) {
                e.preventDefault();
            }
        };

        // 使用 passive: false 确保可以调用 preventDefault()
        galleryElement.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            galleryElement.removeEventListener('touchmove', preventDefault);
        };
    }, [isDragging]);

    const handleThumbnailClick = (index: number) => {
        setActiveImageIndex(index);
        setCurrentTranslate(-index * 100);
    };

    // 获取全局动画时长 - 修复水合不匹配
    const transitionDuration = isClient ? getCssVariable('--gallery-transition-duration', '300') : 300;

    // 检查是否有图片
    if (!processedImages || processedImages.length === 0) {
        return (
            <div className="relative flex flex-row gap-4 w-full max-w-full overflow-hidden">
                <div className="flex-1 w-full">
                    <div className="rounded-lg border border-gray-200 overflow-hidden relative aspect-[1/1] flex items-center justify-center">
                        <Image
                            src="/images/placeholder.jpg"
                            alt="No image available"
                            width={350}
                            height={350}
                            className="w-full h-full object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-row gap-4 w-full max-w-full overflow-hidden">
            {/* 缩略图区域 - 始终在左侧垂直排列 */}
            {processedImages.length > 1 && (
                <div className="flex flex-col items-center gap-2 w-auto">
                    <div
                        className="flex flex-col gap-2 overflow-y-auto max-h-[500px] scroll-smooth"
                        style={{
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                    >
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
                                    alt={image.alt}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 主图区域 - 添加 ref */}
            <div className="flex-1 w-full" ref={galleryRef}>
                <div
                    className={`rounded-lg overflow-hidden relative aspect-[1/1] flex items-center justify-center
                       w-full max-w-[580px] mx-auto md:max-w-none 
                       shadow-md select-none
                       ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStartEvent}
                    onTouchMove={handleTouchMoveEvent}
                    onTouchEnd={handleTouchEndEvent}
                >
                    {/* 图片容器 - 滑动时实时移动 */}
                    <div
                        className="flex w-full h-full transition-transform ease-out"
                        style={{
                            transform: `translateX(${currentTranslate}%)`,
                            // 修复水合不匹配：统一transition属性格式
                            transition: isDragging
                                ? 'none'
                                : `transform ${transitionDuration}ms ease-out`
                        }}
                    >
                        {processedImages.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full h-full relative"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                    priority={index === 0}
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
                                    aria-label={`查看图片 ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 隐藏滚动条样式 */}
            <style jsx>{`
                .scroll-smooth::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}