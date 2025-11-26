// components/product/product-card.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProductResponse, ProductSku } from '@/types/product';
import { getProductImageUrl } from '@/lib/image-utils';
import { wishlistService } from '@/services/wishlistService';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';
import { useCartStore } from '@/stores/useCartStore';
import { getMappedColor } from '@/lib/constants/color-map';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react'; // ✅ Lucide

interface ProductCardProps {
    product: ProductResponse;
    onWishlistUpdate?: () => void;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

export default function ProductCard({ product, onWishlistUpdate }: ProductCardProps) {
    const productDetailPath = `/toys${product.slug}`;
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(product.favorited || false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);

    const { isLoggedIn, openAuthModal, userInfo } = useAuth();
    const { showToast } = useToast();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    const mainImage = useMemo(() => getProductImageUrl('', product.image), [product.image]);

    // ✅ 安全获取库存 (防止 null 报错)
    const getAvailableStock = useCallback((sku: ProductSku | null | undefined): number => {
        if (!sku) return 0;
        return (sku.stock || 0) - (sku.lockedStock || 0);
    }, []);

    // 初始化 SKU
    useEffect(() => {
        const productSkus = product.productSkus || [];
        if (productSkus.length > 0) {
            // 优先选有货的
            const availableSku = productSkus.find(sku => getAvailableStock(sku) > 0);
            setSelectedSku(availableSku || productSkus[0]);
        }
    }, [product.productSkus, getAvailableStock]);

    const hasAvailableStock = useMemo(() => {
        return (product.productSkus || []).some(sku => getAvailableStock(sku) > 0);
    }, [product.productSkus, getAvailableStock]);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedSku) {
            showToast('error', 'Error', 'Please select a color.');
            return;
        }

        setAddingToCart(true);
        try {
            await addItemToCart({
                productId: product.id,
                productTitle: product.title,
                productSku: selectedSku.sku,
                productImage: product.image,
                unitPrice: product.currentPrice,
                quantity: 1,
                color: selectedSku.color,
                skuId: selectedSku.id
            });
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            openAuthModal('login', { onSuccess: executeToggleFavorite });
            return;
        }
        executeToggleFavorite();
    };

    const executeToggleFavorite = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const newState = !isFavorited;
        setIsFavorited(newState); // 乐观更新

        try {
            if (!userInfo) return;
            if (newState) {
                await wishlistService.addItemToWishlist({
                    userId: userInfo.id,
                    productId: product.id,
                    productTitle: product.title,
                    image: product.image,
                    currentPrice: product.currentPrice,
                    slug: product.slug
                });
                showToast('success', 'Added', 'Added to wishlist');
            } else {
                await wishlistService.removeItemFromWishlist({ userId: userInfo.id, productId: product.id });
                showToast('success', 'Removed', 'Removed from wishlist');
            }
            onWishlistUpdate?.();
        } catch (error) {
            setIsFavorited(!newState); // 回滚
            showToast('error', 'Error', 'Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    // 判断是否打折
    const isOnSale = product.originalPrice > product.currentPrice;

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 relative h-full">
            {/* Image Area */}
            <Link href={productDetailPath} className="block relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={mainImage}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                />

                {/* Wishlist Button */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors z-10 ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Tags (Sale / Out of Stock) */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {!hasAvailableStock && (
                        <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                            Sold Out
                        </span>
                    )}
                    {hasAvailableStock && isOnSale && (
                        <span className="bg-[#b62337] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                            Sale
                        </span>
                    )}
                </div>
            </Link>

            {/* Info Area */}
            <div className="p-4 flex flex-col flex-1">
                <Link href={productDetailPath}>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors min-h-[2.5rem] text-sm leading-relaxed">
                        {product.title}
                    </h3>
                </Link>

                {/* Colors Preview */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1 h-3 items-center">
                        {product.productSkus?.slice(0, 3).map(sku => (
                            <div
                                key={sku.id}
                                className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                style={{ backgroundColor: getMappedColor(sku.color || '') }}
                            />
                        ))}
                        {(product.productSkus?.length || 0) > 3 && (
                            <span className="text-[10px] text-gray-400">+{(product.productSkus?.length || 0) - 3}</span>
                        )}
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        {/* ✅ 价格逻辑：打折变红，不打折显黑 */}
                        {isOnSale ? (
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 line-through decoration-gray-300">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-lg font-bold text-[#b62337]">
                                    ${product.currentPrice.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                ${product.currentPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!hasAvailableStock || addingToCart}
                        className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all
                            ${!hasAvailableStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-md'
                        }
                        `}
                        aria-label="Add to cart"
                    >
                        {addingToCart ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <ShoppingBag size={18} strokeWidth={1.5} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}