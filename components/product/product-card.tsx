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
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';

interface ProductCardProps {
    product: ProductResponse;
    onWishlistUpdate?: () => void;
}

const BLUR_DATA_URL = "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==";

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

    const getAvailableStock = useCallback((sku: ProductSku | null | undefined): number => {
        if (!sku) return 0;
        return (sku.stock || 0) - (sku.lockedStock || 0);
    }, []);

    useEffect(() => {
        const productSkus = product.productSkus || [];
        if (productSkus.length > 0) {
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
                color: selectedSku.color
            });
            // showToast 已经在 store 里统一处理了，这里不需要加
        } catch (error) {
            console.error(error);
            // error toast 也在 store 里处理了
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
        setIsFavorited(newState);

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
            setIsFavorited(!newState);
            showToast('error', 'Error', 'Failed to update wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const isOnSale = product.originalPrice > product.currentPrice;

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 relative h-full">
            {/*
               ✅ Image Area 修改重点：
               1. bg-gray-50: 浅灰底色，衬托透明底图片
            */}
            <Link href={productDetailPath} className="block relative aspect-square overflow-hidden bg-gray-50">
                <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    // ✅ object-contain: 完整显示，不裁切
                    // ✅ p-6: 增加内边距，让产品悬浮在中间，不顶边
                    // ✅ mix-blend-multiply: 黑科技，如果你传了白底JPG，这行代码能让白色变透明（仅在灰底下有效）
                    className="object-contain w-full h-full p-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
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

                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
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