// /components/product/product-card.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ProductResponse, ProductSku } from '@/types/product';
import { getProductImageUrl } from '@/lib/image-utils';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';
import { useCartStore } from '@/stores/useCartStore';
import Image from 'next/image';

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
    const { isLoggedIn, openAuthModal, userInfo } = useAuth();
    const { showToast } = useToast();

    // 移除触摸滑动相关状态
    const [isAnimating, setIsAnimating] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // 使用 Zustand store
    const addItemToCart = useCartStore(state => state.addItemToCart);
    const loading = useCartStore(state => state.loading);

    // 获取所有图片（主图 + 相册图）
    const allImages = [
        { url: product.image, alt: product.title },
        ...(product.galleries || [])
    ];

    // 初始化收藏状态
    useEffect(() => {
        setIsFavorited(product.favorited || false);
    }, [product.favorited]);

    // 初始化选中的 SKU
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            // 找到第一个有库存的 SKU
            const availableSku = product.productSkus.find(sku =>
                getAvailableStock(sku) > 0
            );
            if (availableSku) {
                setSelectedSku(availableSku);
            } else {
                // 如果都没有库存，选择第一个（但会禁用）
                setSelectedSku(product.productSkus[0]);
            }
        }
    }, [product.productSkus]);

    // 获取可用库存
    const getAvailableStock = (sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
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

    // 切换到下一张图片
    const nextImage = (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (currentImageIndex < allImages.length - 1) {
            setIsAnimating(true);
            setCurrentImageIndex(prev => prev + 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 切换到上一张图片
    const prevImage = (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        if (currentImageIndex > 0) {
            setIsAnimating(true);
            setCurrentImageIndex(prev => prev - 1);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 跳转到指定图片
    const goToImage = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (index !== currentImageIndex) {
            setIsAnimating(true);
            setCurrentImageIndex(index);
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // 计算图片容器的变换样式
    const getImageContainerStyle = () => {
        return {
            transform: `translateX(-${currentImageIndex * 100}%)`,
            transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
        };
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 检查登录状态
        if (!isLoggedIn) {
            // 未登录，打开登录模态框
            openAuthModal('login', {
                onSuccess: () => {
                    // 登录成功后自动执行收藏操作
                    executeToggleFavorite();
                }
            });
            return;
        }

        // 已登录，直接执行收藏操作
        await executeToggleFavorite();
    };

    // 实际的收藏操作
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
                // 添加收藏
                await wishlistService.addItemToWishlist({
                    userId: userInfo.id,
                    productId: product.id,
                    productTitle: product.title,
                    image: product.image,
                    currentPrice: product.currentPrice,
                    slug: product.slug
                });
            } else {
                // 移除收藏
                await wishlistService.removeItemFromWishlist({
                    userId: userInfo.id,
                    productId: product.id
                });
            }

            // 通知父组件更新数据
            if (onWishlistUpdate) {
                onWishlistUpdate();
            }

        } catch (error) {
            console.error('Toggle favorite failed:', error);
            // 操作失败，回滚状态
            setIsFavorited(!isFavorited);
            showToast('error', 'Add Failed', 'Failed to add product to wishlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // 添加到购物车函数
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setAddingToCart(true);

            if (!isLoggedIn) {
                openAuthModal('login', {
                    onSuccess: () => {
                        // 登录成功后自动执行添加到购物车操作
                        executeAddToCart();
                    }
                });
                return;
            }

            // 已登录，直接添加到购物车
            await executeAddToCart();

        } catch (error) {
            console.error('Failed to add product to cart:', error);
            showToast('error', 'Add Failed', 'Failed to add product to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    // 提取添加到购物车的实际逻辑
    const executeAddToCart = async () => {
        if (!selectedSku) {
            showToast('error', 'Selection Required', 'Please select a color option.');
            return;
        }

        // 检查库存
        const availableStock = getAvailableStock(selectedSku);
        if (availableStock <= 0) {
            showToast('error', 'Out of Stock', 'This product is currently out of stock.');
            return;
        }

        // 构建符合后端要求的请求对象，使用 SKU 信息
        const addToCartRequest = {
            productId: product.id,
            productTitle: product.title,
            productSku: selectedSku.sku, // 使用选中的 SKU
            productImage: getProductImageUrl(product.baseUrl, product.image),
            unitPrice: product.currentPrice,
            quantity: 1,
            color: selectedSku.color // 使用 SKU 的颜色
        };

        // 使用 Zustand store 添加商品
        await addItemToCart(addToCartRequest);

        // 显示成功提示
        const colorText = selectedSku.color ? ` (${selectedSku.color})` : '';
        showToast('success', 'Added to Cart', `${product.title}${colorText} has been added to your cart!`);
    };

    // 检查是否有任何 SKU 有库存
    const hasAvailableStock = product.productSkus?.some(sku => getAvailableStock(sku) > 0) || false;

    // 检查是否可以切换到上一张/下一张
    const canGoPrevious = currentImageIndex > 0;
    const canGoNext = currentImageIndex < allImages.length - 1;

    return (
        <div className="overflow-hidden shadow-sm relative flex flex-col h-full">
            {/* 收藏按钮 */}
            <div className="absolute top-3 right-3 z-20">
                <button
                    className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm relative cursor-pointer
        ${isFavorited ? 'text-red-500' : 'text-gray-400'} 
        ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
                    onClick={handleToggleFavorite}
                    disabled={isLoading}
                    aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={isFavorited ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {isLoading && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                        </div>
                    )}
                </button>
            </div>

            {/* 产品图片区域 - 统一使用点击按钮切换 */}
            <div
                className="aspect-[6/7] overflow-hidden relative"
                ref={imageContainerRef}
            >
                <div className="relative w-full h-full">
                    <div
                        className="flex w-full h-full"
                        style={getImageContainerStyle()}
                    >
                        {allImages.map((image, index) => (
                            <div key={index} className="flex-shrink-0 w-full h-full">
                                <Link href={productDetailPath} className="cursor-pointer block w-full h-full">
                                    <Image
                                        src={getProductImageUrl(product.baseUrl, image.url)}
                                        alt={image.alt || product.title}
                                        width={350}
                                        height={300}
                                        className="w-full h-full object-cover bg-slate-50"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 左右切换按钮 - 所有设备都显示 */}
                {allImages.length > 1 && (
                    <>
                        {/* 左侧切换按钮 */}
                        <button
                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full items-center justify-center shadow-sm ${
                                canGoPrevious
                                    ? 'cursor-pointer text-gray-700'
                                    : 'cursor-not-allowed text-gray-300 opacity-50'
                            }`}
                            onClick={prevImage}
                            disabled={!canGoPrevious}
                            aria-label="Previous image"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                        </button>

                        {/* 右侧切换按钮 */}
                        <button
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full items-center justify-center shadow-sm ${
                                canGoNext
                                    ? 'cursor-pointer text-gray-700'
                                    : 'cursor-not-allowed text-gray-300 opacity-50'
                            }`}
                            onClick={nextImage}
                            disabled={!canGoNext}
                            aria-label="Next image"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </button>
                    </>
                )}

                {/* 图片计数器 */}
                {allImages.length > 1 && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                            {currentImageIndex + 1} / {allImages.length}
                        </div>
                    </div>
                )}

                {/* 图片指示器 - 底部居中 */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full border-2 cursor-pointer ${
                                    index === currentImageIndex
                                        ? 'bg-gray-700 border-gray-700'  // 选中状态：浅灰色
                                        : 'bg-gray-200 border-gray-200'  // 未选中状态：更浅的灰色
                                }`}
                                onClick={(e) => goToImage(index, e)}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 产品信息 */}
            <div className="p-3 md:p-4 flex flex-col flex-grow">
                {/* 产品标题 - 响应式字体大小 */}
                <div className="text-sm md:text-base font-medium leading-tight mb-2 text-gray-900 line-clamp-2 h-12 md:h-14 overflow-hidden">
                    <Link
                        href={productDetailPath}
                        className="text-inherit no-underline cursor-pointer"
                    >
                        {product.title}
                    </Link>
                </div>

                {/* 颜色选择区域 */}
                {product.productSkus && product.productSkus.length > 0 && (
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                            {product.productSkus.map((sku, index) => {
                                const availableStock = getAvailableStock(sku);
                                const isSelected = selectedSku?.id === sku.id;
                                const isOutOfStock = availableStock <= 0;

                                return (
                                    <button
                                        key={sku.id}
                                        className={`w-6 h-6 rounded-full border-2 relative
                                            ${isSelected
                                            ? 'border-blue-500'
                                            : isOutOfStock
                                                ? 'border-gray-300 opacity-40 cursor-not-allowed'
                                                : 'border-gray-200 cursor-pointer'
                                        }`}
                                        style={{ backgroundColor: sku.color || '#ccc' }}
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

                        {/* 显示选中的颜色和库存信息 */}
                        {selectedSku && (
                            <div className="mt-1 text-xs text-gray-500">
                                <span className="font-medium">{selectedSku.color}</span>
                                {getAvailableStock(selectedSku) <= 0 && (
                                    <span className="text-red-500 ml-1">• Out of Stock</span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 价格和操作区域 */}
                <div className="mb-4 md:mb-5 pt-2 flex justify-between items-center mt-auto">
                    {/* 价格容器 - 响应式字体大小 */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {product.originalPrice > product.currentPrice && (
                            <span className="text-xs md:text-sm text-gray-500 line-through font-normal">
                                ${product.originalPrice}
                            </span>
                        )}
                        <span className="text-lg md:text-xl font-semibold text-red-600 font-['Inter'] tracking-tight">
                            ${product.currentPrice}
                        </span>
                    </div>

                    {/* 购物车按钮 - 响应式大小 */}
                    <button
                        className={`flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full relative
                            ${!hasAvailableStock || !selectedSku || addingToCart || loading
                            ? 'bg-gray-200 text-gray-400 opacity-70 pointer-events-none cursor-not-allowed'
                            : 'bg-white/90 backdrop-blur-sm text-gray-600 cursor-pointer'
                        }`}
                        onClick={handleAddToCart}
                        disabled={!hasAvailableStock || !selectedSku || addingToCart || loading}
                        aria-label={!hasAvailableStock ? "Out of stock" : "Add to cart"}
                        title={!hasAvailableStock ? "Out of stock" : "Add to cart"}
                    >
                        <svg
                            width="16"
                            height="16"
                            className="md:w-[18px] md:h-[18px]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {addingToCart && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}