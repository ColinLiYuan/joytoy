// productGallery.tsx
'use client';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import 'react-medium-image-zoom/dist/styles.css';
import { getProductImageUrl } from '@/lib/image-utils';
import { Z_INDEX } from '@/lib/constants/z-index';
import Image from 'next/image';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface ProductGalleryProps {
    images: GalleryImage[];
    productTitle: string;
    baseUrl?: string;
}

export default function ProductGallery({ images, productTitle, baseUrl = '' }: ProductGalleryProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [thumbnailScrollPosition, setThumbnailScrollPosition] = useState(0);
    const thumbnailContainerRef = useRef<HTMLDivElement>(null);
    const currentImage = images[activeImageIndex];

    // 计算是否到达边界
    const isFirstImage = activeImageIndex === 0;
    const isLastImage = activeImageIndex === images.length - 1;

    // 缩略图导航函数
    const scrollThumbnailsUp = () => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = 100;
            thumbnailContainerRef.current.scrollTop -= scrollAmount;
            setThumbnailScrollPosition(thumbnailContainerRef.current.scrollTop);
        }
    };

    const scrollThumbnailsDown = () => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = 100;
            thumbnailContainerRef.current.scrollTop += scrollAmount;
            setThumbnailScrollPosition(thumbnailContainerRef.current.scrollTop);
        }
    };

    // 移动端横向滚动函数
    const scrollThumbnailsLeft = () => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = 100;
            thumbnailContainerRef.current.scrollLeft -= scrollAmount;
            setThumbnailScrollPosition(thumbnailContainerRef.current.scrollLeft);
        }
    };

    const scrollThumbnailsRight = () => {
        if (thumbnailContainerRef.current) {
            const scrollAmount = 100;
            thumbnailContainerRef.current.scrollLeft += scrollAmount;
            setThumbnailScrollPosition(thumbnailContainerRef.current.scrollLeft);
        }
    };

    const handleThumbnailClick = (index: number) => {
        setActiveImageIndex(index);

        // 滚动到选中的缩略图
        if (thumbnailContainerRef.current) {
            const thumbnailElement = thumbnailContainerRef.current.children[index];
            if (thumbnailElement) {
                // 移动端：横向滚动
                if (window.innerWidth < 768) {
                    const containerWidth = thumbnailContainerRef.current.clientWidth;
                    const elementOffset = (thumbnailElement as HTMLElement).offsetLeft;
                    const elementWidth = (thumbnailElement as HTMLElement).clientWidth;
                    thumbnailContainerRef.current.scrollLeft = elementOffset - (containerWidth - elementWidth) / 2;
                    setThumbnailScrollPosition(thumbnailContainerRef.current.scrollLeft);
                }
                // PC端：纵向滚动
                else {
                    const containerHeight = thumbnailContainerRef.current.clientHeight;
                    const elementOffset = (thumbnailElement as HTMLElement).offsetTop;
                    const elementHeight = (thumbnailElement as HTMLElement).clientHeight;
                    thumbnailContainerRef.current.scrollTop = elementOffset - (containerHeight - elementHeight) / 2;
                    setThumbnailScrollPosition(thumbnailContainerRef.current.scrollTop);
                }
            }
        }
    };

    const handlePrevClick = () => {
        if (!isFirstImage) {
            setActiveImageIndex(prev => prev - 1);
        }
    };

    const handleNextClick = () => {
        if (!isLastImage) {
            setActiveImageIndex(prev => prev + 1);
        }
    };

    // 检查是否有图片
    if (!images || images.length === 0) {
        return (
            <div className="relative p-4 sm:p-6 md:p-8 flex flex-col gap-5 w-full max-w-full overflow-hidden">
                <div className="flex-1 w-full">
                    {/* 使用 6:7 比例的占位图 */}
                    <div className="overflow-hidden shadow-lg relative aspect-[6/7] bg-gray-50 flex items-center justify-center w-full max-w-full">
                        <Image
                            src="/images/placeholder.jpg"
                            alt="No image available"
                            width={350}
                            height={408}
                            className="w-full h-full object-cover bg-slate-50"
                            priority
                        />
                    </div>
                </div>
            </div>
        );
    }

    const mainImageUrl = getProductImageUrl(baseUrl, images[activeImageIndex]?.url);

    return (
        <div className="relative p-4 sm:p-6 md:p-8 flex flex-col gap-5 w-full max-w-full overflow-hidden lg:max-w-[1400px] lg:mx-auto">
            <div className="flex flex-col md:flex-row gap-5 items-start w-full">
                {/* PC端：缩略图在左侧（纵向） */}
                {images.length > 1 && (
                    <div className="hidden md:flex flex-col items-center gap-2 relative w-full md:w-auto">
                        <button
                            className="w-8 h-8 rounded-full bg-white/95 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:bg-white hover:border-blue-500 hover:shadow-lg hover:scale-110"
                            onClick={scrollThumbnailsUp}
                            aria-label="Scroll thumbnails up"
                        >
                            <FontAwesomeIcon icon={faChevronUp} className="text-sm text-gray-600 hover:text-blue-500" />
                        </button>

                        <div
                            className="flex flex-col gap-3 max-h-[500px] overflow-y-auto py-2 px-1 scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-600"
                            ref={thumbnailContainerRef}
                        >
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`w-20 h-[93px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 flex-shrink-0 relative bg-gray-50 ${
                                        index === activeImageIndex
                                            ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/30'
                                            : 'border-transparent hover:scale-105 hover:shadow-lg'
                                    }`}
                                    onClick={() => handleThumbnailClick(index)}
                                >
                                    <Image
                                        src={getProductImageUrl(baseUrl, image.url)}
                                        alt={image.alt || `Thumbnail ${index + 1}`}
                                        width={80}
                                        height={93}
                                        className="w-full h-full object-cover bg-slate-50"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            className="w-8 h-8 rounded-full bg-white/95 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:bg-white hover:border-blue-500 hover:shadow-lg hover:scale-110"
                            onClick={scrollThumbnailsDown}
                            aria-label="Scroll thumbnails down"
                        >
                            <FontAwesomeIcon icon={faChevronDown} className="text-sm text-gray-600 hover:text-blue-500" />
                        </button>
                    </div>
                )}

                {/* 主图区域 - 使用 6:7 比例 */}
                <div className="flex-1 w-full">
                    <div className="overflow-hidden shadow-lg relative aspect-[6/7] bg-gray-50 flex items-center justify-center w-full max-w-full">
                        {mainImageUrl && mainImageUrl !== '' && images[activeImageIndex] && (
                            <Image
                                src={mainImageUrl}
                                alt={images[activeImageIndex].alt || productTitle}
                                width={600}
                                height={700}
                                className="w-full h-full object-cover bg-slate-50"
                                priority={activeImageIndex === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                            />
                        )}

                        {images.length > 1 && (
                            <div
                                className="absolute top-1/2 w-full flex justify-between px-4 sm:px-5 transform -translate-y-1/2 pointer-events-none"
                                style={{ zIndex: Z_INDEX.CONTENT }}
                            >
                                <button
                                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 pointer-events-auto ${
                                        isFirstImage
                                            ? 'bg-gray-100/80 text-gray-400 cursor-not-allowed'
                                            : 'bg-white/95 hover:bg-white hover:shadow-xl hover:scale-105'
                                    }`}
                                    onClick={handlePrevClick}
                                    disabled={isFirstImage}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        className={`text-sm sm:text-base ${isFirstImage ? 'text-gray-400' : 'text-gray-800'}`}
                                    />
                                </button>
                                <button
                                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 pointer-events-auto ${
                                        isLastImage
                                            ? 'bg-gray-100/80 text-gray-400 cursor-not-allowed'
                                            : 'bg-white/95 hover:bg-white hover:shadow-xl hover:scale-105'
                                    }`}
                                    onClick={handleNextClick}
                                    disabled={isLastImage}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className={`text-sm sm:text-base ${isLastImage ? 'text-gray-400' : 'text-gray-800'}`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 移动端：缩略图在主图下方（横向） */}
                    {images.length > 1 && (
                        <div className="flex md:hidden flex-col items-center gap-2 mt-4 w-full">
                            <div className="flex items-center gap-2 w-full">
                                <button
                                    className="w-8 h-8 rounded-full bg-white/95 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:bg-white hover:border-blue-500 hover:shadow-lg hover:scale-110 flex-shrink-0"
                                    onClick={scrollThumbnailsLeft}
                                    aria-label="Scroll thumbnails left"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="text-sm text-gray-600 hover:text-blue-500" />
                                </button>

                                <div
                                    className="flex gap-3 overflow-x-auto py-2 px-1 scroll-smooth hide-scrollbar w-full"
                                    ref={thumbnailContainerRef}
                                >
                                    {images.map((image, index) => (
                                        <div
                                            key={index}
                                            className={`w-16 h-[75px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 flex-shrink-0 relative bg-gray-50 ${
                                                index === activeImageIndex
                                                    ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/30'
                                                    : 'border-transparent hover:scale-105 hover:shadow-lg'
                                            }`}
                                            onClick={() => handleThumbnailClick(index)}
                                        >
                                            <Image
                                                src={getProductImageUrl(baseUrl, image.url)}
                                                alt={image.alt || `Thumbnail ${index + 1}`}
                                                width={64}
                                                height={75}
                                                className="w-full h-full object-cover bg-slate-50"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="w-8 h-8 rounded-full bg-white/95 border border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:bg-white hover:border-blue-500 hover:shadow-lg hover:scale-110 flex-shrink-0"
                                    onClick={scrollThumbnailsRight}
                                    aria-label="Scroll thumbnails right"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="text-sm text-gray-600 hover:text-blue-500" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 隐藏滚动条样式 */}
            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}