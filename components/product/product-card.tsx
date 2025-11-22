// /components/product/product-card.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { ProductResponse, ProductSku } from '@/types/product';
import { getProductImageUrl } from '@/lib/image-utils';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';
import { useCartStore } from '@/stores/useCartStore';
import { getMappedColor } from '@/lib/constants/color-map';

// 常量提取到组件外部，避免重复创建
const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// 移动端滑动配置常量
const MOBILE_SWIPE_CONFIG = {
    sensitivity: 0.8,
    boundaryElasticity: 0.3,
    distanceThreshold: 0.25,
    minSpeed: 600,
    speedRatio: 300,
    transitionDuration: 300
} as const;

interface ProductCardProps {
    product: ProductResponse;
    onWishlistUpdate?: () => void;
}

// 懒加载图片组件
const LazyImage = ({
                       src,
                       alt,
                       priority = false,
                       ...props
                   }: {
    src: string;
    alt: string;
    priority?: boolean;
} & React.ComponentProps<typeof Image>) => (
    <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className="w-full h-full object-cover"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        loading={priority ? "eager" : "lazy"}
        {...props}
    />
);

export default function ProductCard({ product, onWishlistUpdate }: ProductCardProps) {
    const productDetailPath = `/toys${product.slug}`;

    // 状态合并和简化
    const [uiState, setUiState] = useState({
        isLoading: false,
        isFavorited: product.favorited || false,
        addingToCart: false,
        addedToCart: false,
        currentImageIndex: 0,
        isDragging: false,
        currentTranslate: 0,
        isHovered: false,
        isAnimating: true,
    });

    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // 默认第一张已加载

    const [deviceState, setDeviceState] = useState({
        isMobile: false,
        isMounted: false
    });

    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);

    // Refs 合并
    const interactionRefs = useRef({
        dragStartX: 0,
        dragCurrentX: 0,
        dragStartTime: 0,
        prevTranslate: 0,
        isClick: true,
        hoverTimeout: null as NodeJS.Timeout | null,
        hasAutoSwitched: false,
        hasManualSwitch: false
    });

    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { isLoggedIn, openAuthModal, userInfo } = useAuth();
    const { showToast } = useToast();
    const addItemToCart = useCartStore(state => state.addItemToCart);
    const loading = useCartStore(state => state.loading);

    // 使用 useMemo 缓存所有图片的完整 URL
    const imageData = useMemo(() => {
        const mainImage = {
            url: getProductImageUrl(product.baseUrl, product.image),
            alt: product.title
        };

        const galleryImages = (product.galleries || []).map(gallery => ({
            ...gallery,
            url: getProductImageUrl(product.baseUrl, gallery.url)
        }));

        return {
            allImages: [mainImage, ...galleryImages],
            mainImageUrl: mainImage.url
        };
    }, [product.baseUrl, product.image, product.title, product.galleries]);

    const { allImages, mainImageUrl } = imageData;

    // 设备检测和初始化 - 简化版本
    useEffect(() => {
        setDeviceState({
            isMounted: true,
            isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false
        });

        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setDeviceState(prev => ({ ...prev, isMobile: window.innerWidth < 768 }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 修复：安全的 SKU 初始化
    useEffect(() => {
        const productSkus = product.productSkus || [];
        if (productSkus.length > 0) {
            const availableSku = productSkus.find(sku =>
                getAvailableStock(sku) > 0
            );
            setSelectedSku(availableSku || productSkus[0]);
        }
    }, [product.productSkus]);

    // 工具函数
    const getAvailableStock = useCallback((sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
    }, []);

    // 检查是否有可用库存 - 修复类型错误
    const hasAvailableStock = useMemo(() => {
        const productSkus = product.productSkus || [];
        return productSkus.some(sku => getAvailableStock(sku) > 0);
    }, [product.productSkus, getAvailableStock]);

    // 图片懒加载处理
    const handleImageLoad = useCallback((index: number) => {
        setLoadedImages(prev => {
            const newLoadedImages = new Set(prev);
            newLoadedImages.add(index);
            return newLoadedImages;
        });
    }, []);

    // 预加载相邻图片 - 修复 new Image() 错误
    useEffect(() => {
        if (!deviceState.isMounted || typeof window === 'undefined') return;

        const preloadIndices = [
            uiState.currentImageIndex - 1,
            uiState.currentImageIndex + 1
        ].filter(index => index >= 0 && index < allImages.length);

        preloadIndices.forEach(index => {
            if (!loadedImages.has(index)) {
                // 修复：使用正确的 Image 构造函数
                const img = new window.Image();
                img.src = allImages[index].url;
                img.onload = () => handleImageLoad(index);
            }
        });
    }, [uiState.currentImageIndex, allImages.length, deviceState.isMounted, loadedImages, allImages, handleImageLoad]);

    // 图片切换逻辑 - 简化版本
    const goToImage = useCallback((index: number, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (index !== uiState.currentImageIndex) {
            setUiState(prev => ({
                ...prev,
                isAnimating: true,
                currentImageIndex: index
            }));

            // 确保目标图片被标记为需要加载
            if (!loadedImages.has(index)) {
                handleImageLoad(index);
            }

            setTimeout(() => setUiState(prev => ({ ...prev, isAnimating: false })), 300);
        }
    }, [uiState.currentImageIndex, loadedImages, handleImageLoad]);

    const nextImage = useCallback((e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (uiState.currentImageIndex < allImages.length - 1) {
            goToImage(uiState.currentImageIndex + 1);
            interactionRefs.current.hasManualSwitch = true;
        }
    }, [uiState.currentImageIndex, allImages.length, goToImage]);

    const prevImage = useCallback((e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (uiState.currentImageIndex > 0) {
            goToImage(uiState.currentImageIndex - 1);
            interactionRefs.current.hasManualSwitch = true;
        }
    }, [uiState.currentImageIndex, goToImage]);

    // 鼠标悬停处理 - 简化版本
    const handleMouseEnter = useCallback(() => {
        if (!deviceState.isMounted || deviceState.isMobile) return;

        setUiState(prev => ({ ...prev, isHovered: true }));

        if (allImages.length > 1 &&
            !interactionRefs.current.hasAutoSwitched &&
            !interactionRefs.current.hasManualSwitch) {

            const nextIndex = uiState.currentImageIndex + 1;
            if (nextIndex < allImages.length) {
                interactionRefs.current.hoverTimeout = setTimeout(() => {
                    goToImage(nextIndex);
                    interactionRefs.current.hasAutoSwitched = true;
                }, 300);
            }
        }
    }, [deviceState.isMounted, deviceState.isMobile, allImages.length, uiState.currentImageIndex, goToImage]);

    const handleMouseLeave = useCallback(() => {
        if (!deviceState.isMounted || deviceState.isMobile) return;

        setUiState(prev => ({ ...prev, isHovered: false }));

        if (interactionRefs.current.hoverTimeout) {
            clearTimeout(interactionRefs.current.hoverTimeout);
        }

        if (interactionRefs.current.hasAutoSwitched &&
            !interactionRefs.current.hasManualSwitch &&
            uiState.currentImageIndex !== 0) {
            goToImage(0);
        }

        interactionRefs.current.hasAutoSwitched = false;
    }, [deviceState.isMounted, deviceState.isMobile, uiState.currentImageIndex, goToImage]);

    // 移动端滑动逻辑 - 简化版本
    const handleTouchStart = useCallback((clientX: number) => {
        if (!deviceState.isMounted || !deviceState.isMobile) return;

        const refs = interactionRefs.current;
        setUiState(prev => ({ ...prev, isDragging: true }));

        refs.isClick = true;
        refs.dragStartX = clientX;
        refs.dragCurrentX = clientX;
        refs.dragStartTime = Date.now();
        refs.prevTranslate = uiState.currentTranslate;
    }, [deviceState.isMounted, deviceState.isMobile, uiState.currentTranslate]);

    const handleTouchMove = useCallback((clientX: number) => {
        if (!deviceState.isMounted || !deviceState.isMobile || !uiState.isDragging) return;

        const refs = interactionRefs.current;
        refs.dragCurrentX = clientX;

        const diff = clientX - refs.dragStartX;

        // 如果移动距离超过阈值，认为是拖动而不是点击
        if (Math.abs(diff) > 10) {
            refs.isClick = false;
        }

        let newTranslate = refs.prevTranslate + (diff / window.innerWidth) * 100 * MOBILE_SWIPE_CONFIG.sensitivity;

        // 边界限制
        const maxTranslate = 0;
        const minTranslate = -(allImages.length - 1) * 100;

        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * MOBILE_SWIPE_CONFIG.boundaryElasticity;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * MOBILE_SWIPE_CONFIG.boundaryElasticity;
        }

        setUiState(prev => ({ ...prev, currentTranslate: newTranslate }));
    }, [deviceState.isMounted, deviceState.isMobile, uiState.isDragging, allImages.length]);

    const handleTouchEnd = useCallback(() => {
        if (!deviceState.isMounted || !deviceState.isMobile || !uiState.isDragging) return;

        const refs = interactionRefs.current;
        setUiState(prev => ({ ...prev, isDragging: false }));

        if (refs.isClick) return;

        const diff = refs.dragCurrentX - refs.dragStartX;
        const screenThreshold = window.innerWidth * MOBILE_SWIPE_CONFIG.distanceThreshold;

        let targetIndex = uiState.currentImageIndex;
        if (Math.abs(diff) > screenThreshold) {
            targetIndex = diff > 0
                ? Math.max(0, uiState.currentImageIndex - 1)
                : Math.min(allImages.length - 1, uiState.currentImageIndex + 1);
        }

        setUiState(prev => ({
            ...prev,
            currentImageIndex: targetIndex,
            currentTranslate: -targetIndex * 100
        }));
    }, [deviceState.isMounted, deviceState.isMobile, uiState.isDragging, uiState.currentImageIndex, allImages.length]);

    // 移动端触摸事件
    const handleTouchStartEvent = useCallback((e: React.TouchEvent) => {
        handleTouchStart(e.touches[0].clientX);
    }, [handleTouchStart]);

    const handleTouchMoveEvent = useCallback((e: React.TouchEvent) => {
        if (!uiState.isDragging) return;
        handleTouchMove(e.touches[0].clientX);
    }, [uiState.isDragging, handleTouchMove]);

    const handleTouchEndEvent = useCallback((e: React.TouchEvent) => {
        if (!uiState.isDragging) return;
        handleTouchEnd();
    }, [uiState.isDragging, handleTouchEnd]);

    // 样式计算 - 简化版本
    const getImageContainerStyle = useCallback(() => {
        if (!deviceState.isMounted) {
            return {
                transform: `translateX(-${uiState.currentImageIndex * 100}%)`,
                transition: 'transform 0.3s ease-out'
            };
        }

        if (deviceState.isMobile) {
            return {
                transform: `translateX(${uiState.currentTranslate}%)`,
                transition: uiState.isDragging ? 'none' : `transform ${MOBILE_SWIPE_CONFIG.transitionDuration}ms ease-out`
            };
        }

        return {
            transform: `translateX(-${uiState.currentImageIndex * 100}%)`,
            transition: uiState.isAnimating ? 'transform 0.3s ease-out' : 'none'
        };
    }, [deviceState.isMounted, deviceState.isMobile, uiState]);

    // 处理图片点击 - 进入详情页
    const handleImageClick = useCallback((e: React.MouseEvent) => {
        // 如果正在拖动，阻止点击事件
        if (uiState.isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
        // 否则让 Link 组件正常处理导航
    }, [uiState.isDragging]);

    // SKU 选择处理 - 修复类型错误
    const handleSkuSelect = useCallback((sku: ProductSku, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const availableStock = getAvailableStock(sku);
        if (availableStock > 0) {
            setSelectedSku(sku);
        }
    }, [getAvailableStock]);

    // 收藏逻辑
    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            openAuthModal('login', { onSuccess: executeToggleFavorite });
            return;
        }

        await executeToggleFavorite();
    };

    const executeToggleFavorite = async () => {
        if (uiState.isLoading) return;

        setUiState(prev => ({ ...prev, isLoading: true }));
        const newFavoritedState = !uiState.isFavorited;
        setUiState(prev => ({ ...prev, isFavorited: newFavoritedState }));

        try {
            if (!userInfo) {
                console.error('用户未登录');
                return;
            }

            if (newFavoritedState) {
                await wishlistService.addItemToWishlist({
                    userId: userInfo.id,
                    productId: product.id,
                    productTitle: product.title,
                    image: product.image,
                    currentPrice: product.currentPrice,
                    slug: product.slug
                });
            } else {
                await wishlistService.removeItemFromWishlist({
                    userId: userInfo.id,
                    productId: product.id
                });
            }

            onWishlistUpdate?.();
        } catch (error) {
            console.error('Toggle favorite failed:', error);
            setUiState(prev => ({ ...prev, isFavorited: !newFavoritedState }));
            showToast('error', 'Add Failed', 'Failed to add product to wishlist. Please try again.');
        } finally {
            setUiState(prev => ({ ...prev, isLoading: false }));
        }
    };

    // 购物车逻辑
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setUiState(prev => ({ ...prev, addingToCart: true }));

            if (!isLoggedIn) {
                openAuthModal('login', { onSuccess: executeAddToCart });
                return;
            }

            await executeAddToCart();
            setUiState(prev => ({ ...prev, addedToCart: true }));
            setTimeout(() => {
                setUiState(prev => ({ ...prev, addedToCart: false }));
            }, 2000);
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            showToast('error', 'Add Failed', 'Failed to add product to cart. Please try again.');
        } finally {
            setUiState(prev => ({ ...prev, addingToCart: false }));
        }
    };

    const executeAddToCart = async () => {
        if (!selectedSku) {
            showToast('error', 'Selection Required', 'Please select a color option.');
            return;
        }

        const availableStock = getAvailableStock(selectedSku);
        if (availableStock <= 0) {
            showToast('error', 'Out of Stock', 'This product is currently out of stock.');
            return;
        }

        const addToCartRequest = {
            productId: product.id,
            productTitle: product.title,
            productSku: selectedSku.sku,
            productImage: mainImageUrl,
            unitPrice: product.currentPrice,
            quantity: 1,
            color: selectedSku.color
        };

        await addItemToCart(addToCartRequest);

        const colorText = selectedSku.color ? ` (${selectedSku.color})` : '';
        showToast('success', 'Added to Cart', `${product.title}${colorText} has been added to your cart!`);
    };

    // 检查是否可以切换到上一张/下一张
    const canGoPrevious = uiState.currentImageIndex > 0;
    const canGoNext = uiState.currentImageIndex < allImages.length - 1;

    // 修复：安全的 SKU 列表获取
    const productSkus = product.productSkus || [];

    return (
        <div
            className="overflow-hidden shadow-md relative flex flex-col h-full bg-white product-card"
            style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 产品图片区域 */}
            <div
                className="aspect-[1/1] overflow-hidden relative bg-gray-50"
                style={{
                    borderTopLeftRadius: 'var(--radius-lg)',
                    borderTopRightRadius: 'var(--radius-lg)'
                }}
                ref={imageContainerRef}
                onTouchStart={handleTouchStartEvent}
                onTouchMove={handleTouchMoveEvent}
                onTouchEnd={handleTouchEndEvent}
            >
                <div className="relative w-full h-full">
                    <div
                        className="flex w-full h-full"
                        style={getImageContainerStyle()}
                    >
                        {allImages.map((image, index) => (
                            <div key={index} className="flex-shrink-0 w-full h-full">
                                <Link
                                    href={productDetailPath}
                                    className="cursor-pointer block w-full h-full"
                                    onClick={handleImageClick}
                                >
                                    {/* 第一张图片优先加载，其他图片懒加载 */}
                                    {index === 0 ? (
                                        <LazyImage
                                            src={image.url}
                                            alt={image.alt || product.title}
                                            priority={true}
                                        />
                                    ) : loadedImages.has(index) ? (
                                        <LazyImage
                                            src={image.url}
                                            alt={image.alt || product.title}
                                            priority={false}
                                        />
                                    ) : (
                                        // 占位符，直到图片被加载
                                        <div className="w-full h-full bg-gray-200 animate-pulse" />
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 桌面端：左右切换按钮 - 只在悬停时显示 */}
                {allImages.length > 1 && uiState.isHovered && deviceState.isMounted && !deviceState.isMobile && (
                    <>
                        <button
                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-200 z-10 transition-all duration-200 ${
                                canGoPrevious
                                    ? 'cursor-pointer text-gray-700 hover:bg-white hover:shadow-md'
                                    : 'cursor-not-allowed text-gray-300 opacity-50'
                            }`}
                            style={{
                                borderRadius: 'var(--radius-full)'
                            }}
                            onClick={prevImage}
                            disabled={!canGoPrevious}
                            aria-label="Previous image"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>

                        <button
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm border border-gray-200 z-10 transition-all duration-200 ${
                                canGoNext
                                    ? 'cursor-pointer text-gray-700 hover:bg-white hover:shadow-md'
                                    : 'cursor-not-allowed text-gray-300 opacity-50'
                            }`}
                            style={{
                                borderRadius: 'var(--radius-full)'
                            }}
                            onClick={nextImage}
                            disabled={!canGoNext}
                            aria-label="Next image"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </>
                )}

                {/* 图片计数器 */}
                {allImages.length > 1 && (
                    <div className="absolute top-3 left-3 z-10">
                        <div
                            className="px-2 py-1 bg-black/50 text-white text-xs backdrop-blur-sm"
                            style={{
                                borderRadius: 'var(--radius-full)'
                            }}
                        >
                            {uiState.currentImageIndex + 1} / {allImages.length}
                        </div>
                    </div>
                )}

                {/* 图片指示器 - 底部居中 */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 transition-all cursor-pointer ${
                                    index === uiState.currentImageIndex
                                        ? 'bg-white scale-125'
                                        : 'bg-white/60'
                                }`}
                                style={{
                                    borderRadius: 'var(--radius-full)'
                                }}
                                onClick={(e) => goToImage(index, e)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 产品信息 */}
            <div
                className="p-4 flex flex-col flex-grow bg-white"
                style={{
                    borderBottomLeftRadius: 'var(--radius-lg)',
                    borderBottomRightRadius: 'var(--radius-lg)'
                }}
            >
                {/* 产品标题 */}
                <div className="mb-3">
                    <Link
                        href={productDetailPath}
                        className="group cursor-pointer"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors product-title">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                {/* 颜色选择区域 + 收藏按钮 */}
                {productSkus.length > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {productSkus.map((sku) => {
                                const availableStock = getAvailableStock(sku);
                                const isSelected = selectedSku?.id === sku.id;
                                const isOutOfStock = availableStock <= 0;
                                const colorValue = getMappedColor(sku.color || '#ccc');

                                return (
                                    <button
                                        key={sku.id}
                                        className={`w-6 h-6 relative transition-all duration-200 border-2
        ${isSelected
                                            ? 'border-black scale-110 shadow-md'
                                            : isOutOfStock
                                                ? 'border-gray-300 opacity-40 cursor-not-allowed'
                                                : 'border-gray-200 cursor-pointer hover:scale-105 hover:shadow-sm'
                                        }`}
                                        style={{
                                            backgroundColor: colorValue,
                                            borderRadius: 'var(--radius-full)'
                                        }}
                                        onClick={(e) => handleSkuSelect(sku, e)}
                                        disabled={isOutOfStock}
                                        title={isOutOfStock ? 'Out of stock' : `${sku.color} (Stock: ${availableStock})`}
                                    >
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-4 h-0.5 bg-gray-400 transform rotate-45"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 收藏按钮 */}
                        <button
                            className={`flex items-center justify-center w-8 h-8 bg-white relative cursor-pointer border shadow-sm
                                ${uiState.isFavorited ? 'text-red-500' : 'text-gray-400'} 
                                ${uiState.isLoading ? 'opacity-70 pointer-events-none' : ''}
                                hover:shadow-md transition-all`}
                            style={{
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--border-medium)'
                            }}
                            onClick={handleToggleFavorite}
                            disabled={uiState.isLoading}
                            aria-label={uiState.isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={uiState.isFavorited ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {uiState.isLoading && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-3 h-3 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </div>
                )}

                {/* 价格和操作区域 */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                    {/* 价格容器 */}
                    <div className="flex items-baseline gap-2">
                        {product.originalPrice > product.currentPrice && (
                            <span className="text-sm text-gray-500 line-through font-normal">
                                ${product.originalPrice}
                            </span>
                        )}
                        <span className="text-xl font-bold product-price">
                            ${product.currentPrice}
                        </span>
                    </div>

                    {/* 购物车按钮 */}
                    <button
                        className={`flex items-center justify-center relative transition-all
                            ${!hasAvailableStock || !selectedSku || uiState.addingToCart || loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                            : uiState.addedToCart
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                        }
                        ${uiState.addedToCart
                            ? 'w-10 h-10 md:w-10 md:h-10'
                            : 'px-4 py-2 md:px-4 md:py-2'
                        }`}
                        style={{
                            borderRadius: 'var(--radius-lg)'
                        }}
                        onClick={handleAddToCart}
                        disabled={(!hasAvailableStock || !selectedSku || uiState.addingToCart || loading) && !uiState.addedToCart}
                        aria-label={!hasAvailableStock ? "Out of stock" : "Add to cart"}
                    >
                        {uiState.addingToCart ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : uiState.addedToCart ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            >
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                        ) : (
                            <>
                                <div className="md:hidden">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                    <span className="text-sm font-medium">Add to Cart</span>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}