// /components/product/product-card.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ProductResponse, ProductSku } from '@/types/product';
import { getProductImageUrl } from '@/lib/image-utils';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';
import { useCartStore } from '@/stores/useCartStore';
import Image from 'next/image';
import { getMappedColor, getColorDisplayText } from '@/lib/constants/color-map';

interface ProductCardProps {
    product: ProductResponse;
    onWishlistUpdate?: () => void;
}

export default function ProductCard({ product, onWishlistUpdate }: ProductCardProps) {
    const productDetailPath = `/toys${product.slug}`;
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    // 移动端滑动相关状态
    const [isDragging, setIsDragging] = useState(false);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const dragStartX = useRef(0);
    const dragCurrentX = useRef(0);
    const dragStartTime = useRef(0);
    const dragEndTime = useRef(0);
    const prevTranslate = useRef(0);
    const isClickRef = useRef(true);

    const { isLoggedIn, openAuthModal, userInfo } = useAuth();
    const { showToast } = useToast();

    const [isAnimating, setIsAnimating] = useState(true);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // 添加悬停相关状态
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasAutoSwitchedRef = useRef(false);
    const hasManualSwitchRef = useRef(false);

    // 使用 Zustand store
    const addItemToCart = useCartStore(state => state.addItemToCart);
    const loading = useCartStore(state => state.loading);

    // 使用 useMemo 缓存所有图片的完整 URL - 修复重复调用问题
    const allImages = useMemo(() => {
        const mainImage = {
            url: getProductImageUrl(product.baseUrl, product.image),
            alt: product.title
        };

        const galleryImages = (product.galleries || []).map(gallery => ({
            ...gallery,
            url: getProductImageUrl(product.baseUrl, gallery.url)
        }));

        return [mainImage, ...galleryImages];
    }, [product.baseUrl, product.image, product.title, product.galleries]);

    // 缓存主图 URL（用于购物车）
    const mainImageUrl = useMemo(() => {
        return getProductImageUrl(product.baseUrl, product.image);
    }, [product.baseUrl, product.image]);

    // 初始化设备检测和挂载状态
    useEffect(() => {
        setIsMounted(true);
        setIsMobile(window.innerWidth < 768);

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 初始化收藏状态
    useEffect(() => {
        setIsFavorited(product.favorited || false);
    }, [product.favorited]);

    // 初始化选中的 SKU
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            const availableSku = product.productSkus.find(sku =>
                getAvailableStock(sku) > 0
            );
            if (availableSku) {
                setSelectedSku(availableSku);
            } else {
                setSelectedSku(product.productSkus[0]);
            }
        }
    }, [product.productSkus]);

    // 鼠标悬停处理 - 只在桌面端生效
    useEffect(() => {
        if (!isMounted || isMobile) return;

        if (isHovered && allImages.length > 1 && !hasAutoSwitchedRef.current && !hasManualSwitchRef.current) {
            const nextIndex = currentImageIndex + 1;
            if (nextIndex < allImages.length) {
                hoverTimeoutRef.current = setTimeout(() => {
                    setIsAnimating(true);
                    setCurrentImageIndex(nextIndex);
                    hasAutoSwitchedRef.current = true;
                    setTimeout(() => setIsAnimating(false), 300);
                }, 300);
            }
        }

        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, [isHovered, currentImageIndex, allImages.length, isMounted, isMobile]);

    // 获取可用库存
    const getAvailableStock = (sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    // 获取颜色显示值
    const getColorValue = (color: string): string => {
        return getMappedColor(color);
    };

    // 处理 SKU 选择
    const handleSkuSelect = (sku: ProductSku, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const availableStock = getAvailableStock(sku);
        if (availableStock > 0) {
            setSelectedSku(sku);
        }
    };

    // 桌面端：切换到下一张图片
    const nextImage = (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (currentImageIndex < allImages.length - 1) {
            setIsAnimating(true);
            setCurrentImageIndex(prev => prev + 1);
            hasManualSwitchRef.current = true;
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 桌面端：切换到上一张图片
    const prevImage = (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (currentImageIndex > 0) {
            setIsAnimating(true);
            setCurrentImageIndex(prev => prev - 1);
            hasManualSwitchRef.current = true;
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 跳转到指定图片
    const goToImage = (index: number, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (index !== currentImageIndex) {
            setIsAnimating(true);
            setCurrentImageIndex(index);
            setCurrentTranslate(-index * 100);
            hasManualSwitchRef.current = true;
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 鼠标进入处理
    const handleMouseEnter = () => {
        if (!isMounted || isMobile) return;
        setIsHovered(true);
    };

    // 鼠标离开处理
    const handleMouseLeave = () => {
        if (!isMounted || isMobile) return;
        setIsHovered(false);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        if (hasAutoSwitchedRef.current && !hasManualSwitchRef.current && currentImageIndex !== 0) {
            setIsAnimating(true);
            setCurrentImageIndex(0);
            setTimeout(() => setIsAnimating(false), 300);
        }

        hasAutoSwitchedRef.current = false;
    };

    // ========== 移动端滑动逻辑 ==========
    const getCssVariable = (variableName: string, defaultValue: string): number => {
        if (!isMounted) return parseFloat(defaultValue);

        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();

        return parseFloat(value || defaultValue);
    };

    // 触摸开始
    const handleTouchStart = (clientX: number) => {
        if (!isMounted || !isMobile) return;
        setIsDragging(true);
        isClickRef.current = true;
        dragStartX.current = clientX;
        dragCurrentX.current = clientX;
        dragStartTime.current = Date.now();
        prevTranslate.current = currentTranslate;
    };

    // 触摸移动
    const handleTouchMove = (clientX: number) => {
        if (!isMounted || !isMobile || !isDragging) return;
        dragCurrentX.current = clientX;

        const diff = clientX - dragStartX.current;

        // 如果移动距离超过阈值，认为是拖动而不是点击
        if (Math.abs(diff) > 10) {
            isClickRef.current = false;
        }

        // 使用全局变量控制灵敏度
        const sensitivity = getCssVariable('--gallery-sensitivity', '0.8');

        let newTranslate = prevTranslate.current + (diff / window.innerWidth) * 100 * sensitivity;

        // 边界限制
        const maxTranslate = 0;
        const minTranslate = -(allImages.length - 1) * 100;

        // 使用全局变量控制边界弹性
        const boundaryElasticity = getCssVariable('--gallery-boundary-elasticity', '0.3');

        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * boundaryElasticity;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * boundaryElasticity;
        }

        setCurrentTranslate(newTranslate);
    };

    // 触摸结束
    const handleTouchEnd = () => {
        if (!isMounted || !isMobile || !isDragging) return;
        setIsDragging(false);

        // 如果是点击，不处理滑动逻辑
        if (isClickRef.current) {
            return;
        }

        dragEndTime.current = Date.now();

        const diff = dragCurrentX.current - dragStartX.current;
        const timeDiff = Math.max(1, dragEndTime.current - dragStartTime.current);

        // 计算滑动速度
        const speed = Math.abs(diff) / (timeDiff / 1000);

        // 使用全局变量控制距离阈值
        const distanceThreshold = getCssVariable('--gallery-distance-threshold', '0.25');
        const screenThreshold = window.innerWidth * distanceThreshold;

        let slidesToMove = 0;

        // 基本规则：滑动距离超过阈值时切换一张
        if (Math.abs(diff) > screenThreshold) {
            slidesToMove = 1;
        }

        // 使用全局变量控制速度阈值
        const minSpeed = getCssVariable('--gallery-min-speed', '600');
        const speedRatio = getCssVariable('--gallery-speed-ratio', '300');

        // 根据速度增加额外的切换数量
        if (speed > minSpeed) {
            const extraSlides = Math.floor((speed - minSpeed) / speedRatio);
            slidesToMove += extraSlides;
        }

        // 限制跳转数量
        slidesToMove = Math.min(slidesToMove, allImages.length - 1);

        let targetIndex;
        if (diff > 0) {
            targetIndex = Math.max(0, currentImageIndex - slidesToMove);
        } else {
            targetIndex = Math.min(allImages.length - 1, currentImageIndex + slidesToMove);
        }

        setCurrentImageIndex(targetIndex);
        setCurrentTranslate(-targetIndex * 100);
    };

    // 移动端触摸事件
    const handleTouchStartEvent = (e: React.TouchEvent) => {
        handleTouchStart(e.touches[0].clientX);
    };

    const handleTouchMoveEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleTouchMove(e.touches[0].clientX);
    };

    const handleTouchEndEvent = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleTouchEnd();
    };

    // 获取全局动画时长
    const transitionDuration = getCssVariable('--gallery-transition-duration', '300');

    // 修复：统一的样式计算函数，避免 hydration 不匹配
    const getImageContainerStyle = () => {
        // 服务端渲染时返回简单的样式，避免 hydration 不匹配
        if (!isMounted) {
            return {
                transform: `translateX(-${currentImageIndex * 100}%)`,
                transition: 'transform 0.3s ease-out'
            };
        }

        // 客户端渲染时根据设备类型返回不同样式
        if (isMobile) {
            return {
                transform: `translateX(${currentTranslate}%)`,
                transition: isDragging ? 'none' : `transform ${transitionDuration}ms ease-out`
            };
        } else {
            return {
                transform: `translateX(-${currentImageIndex * 100}%)`,
                transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
            };
        }
    };

    // 处理图片点击 - 进入详情页
    const handleImageClick = (e: React.MouseEvent) => {
        // 如果正在拖动，阻止点击事件
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // 否则让 Link 组件正常处理导航
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            openAuthModal('login', {
                onSuccess: () => {
                    executeToggleFavorite();
                }
            });
            return;
        }

        await executeToggleFavorite();
    };

    const executeToggleFavorite = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const newFavoritedState = !isFavorited;
            setIsFavorited(newFavoritedState);

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

            if (onWishlistUpdate) {
                onWishlistUpdate();
            }

        } catch (error) {
            console.error('Toggle favorite failed:', error);
            setIsFavorited(!isFavorited);
            showToast('error', 'Add Failed', 'Failed to add product to wishlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setAddingToCart(true);

            if (!isLoggedIn) {
                openAuthModal('login', {
                    onSuccess: () => {
                        executeAddToCart();
                    }
                });
                return;
            }

            await executeAddToCart();
            setAddedToCart(true);
            setTimeout(() => {
                setAddedToCart(false);
            }, 2000);

        } catch (error) {
            console.error('Failed to add product to cart:', error);
            showToast('error', 'Add Failed', 'Failed to add product to cart. Please try again.');
        } finally {
            setAddingToCart(false);
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
            productImage: mainImageUrl,  // 使用缓存的 URL
            unitPrice: product.currentPrice,
            quantity: 1,
            color: selectedSku.color
        };

        await addItemToCart(addToCartRequest);

        const colorText = selectedSku.color ? ` (${selectedSku.color})` : '';
        showToast('success', 'Added to Cart', `${product.title}${colorText} has been added to your cart!`);
    };

    // 检查是否有任何 SKU 有库存
    const hasAvailableStock = product.productSkus?.some(sku => getAvailableStock(sku) > 0) || false;

    // 检查是否可以切换到上一张/下一张
    const canGoPrevious = currentImageIndex > 0;
    const canGoNext = currentImageIndex < allImages.length - 1;

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
                // 移动端触摸事件
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
                                    <Image
                                        src={image.url}  // 直接使用缓存的完整 URL
                                        alt={image.alt || product.title}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-cover"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 桌面端：左右切换按钮 - 只在悬停时显示 */}
                {allImages.length > 1 && isHovered && isMounted && !isMobile && (
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
                            {currentImageIndex + 1} / {allImages.length}
                        </div>
                    </div>
                )}

                {/* 图片指示器 - 底部居中 (桌面端和移动端都显示) */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 transition-all cursor-pointer ${
                                    index === currentImageIndex
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
                {product.productSkus && product.productSkus.length > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {product.productSkus.map((sku, index) => {
                                const availableStock = getAvailableStock(sku);
                                const isSelected = selectedSku?.id === sku.id;
                                const isOutOfStock = availableStock <= 0;
                                const colorValue = getColorValue(sku.color || '#ccc');

                                return (
                                    <button
                                        key={sku.id}
                                        className={`w-6 h-6 relative transition-all
                                            ${isSelected
                                            ? 'border-blue-500 scale-110'
                                            : isOutOfStock
                                                ? 'border-gray-300 opacity-40 cursor-not-allowed'
                                                : 'border-gray-200 cursor-pointer hover:scale-105'
                                        }`}
                                        style={{
                                            backgroundColor: colorValue,
                                            borderRadius: 'var(--radius-full)',
                                            border: `2px solid ${isSelected ? '#3b82f6' : isOutOfStock ? '#d1d5db' : '#e5e7eb'}`
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
                                ${isFavorited ? 'text-red-500' : 'text-gray-400'} 
                                ${isLoading ? 'opacity-70 pointer-events-none' : ''}
                                hover:shadow-md transition-all`}
                            style={{
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--border-medium)'
                            }}
                            onClick={handleToggleFavorite}
                            disabled={isLoading}
                            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={isFavorited ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            {isLoading && (
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
                            ${!hasAvailableStock || !selectedSku || addingToCart || loading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                            : addedToCart
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                        }
                        ${addedToCart
                            ? 'w-10 h-10 md:w-10 md:h-10'
                            : 'px-4 py-2 md:px-4 md:py-2'
                        }`}
                        style={{
                            borderRadius: 'var(--radius-lg)'
                        }}
                        onClick={handleAddToCart}
                        disabled={(!hasAvailableStock || !selectedSku || addingToCart || loading) && !addedToCart}
                        aria-label={!hasAvailableStock ? "Out of stock" : "Add to cart"}
                    >
                        {addingToCart ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : addedToCart ? (
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