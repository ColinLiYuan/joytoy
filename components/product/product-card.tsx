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
import ProductBadge from './product-badge';

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
            const colorToSave = selectedSku.color === '__generic__' ? 'Default' : selectedSku.color;

            await addItemToCart({
                productId: product.id,
                productTitle: product.title,
                productSku: selectedSku.sku,
                productImage: product.image,
                unitPrice: product.currentPrice,
                quantity: 1,
                color: colorToSave,
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
        setIsFavorited(newState);

        try {
            if (!userInfo) return;
            if (newState) {
                await wishlistService.addItemToWishlist({
                    productId: product.id,
                    productTitle: product.title,
                    image: product.image,
                    currentPrice: product.currentPrice,
                    slug: product.slug,
                    badge: product.badge
                });
            } else {
                await wishlistService.removeItemFromWishlist({ productId: product.id });
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

    const renderTitle = (fullTitle: string) => {
        if (fullTitle.includes('|')) {
            const [name, desc] = fullTitle.split('|');
            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-900 text-[17px] font-['Playfair_Display'] leading-tight">{name.trim()}</span>
                    <span className="text-xs text-gray-500 font-['Inter'] font-normal line-clamp-1">{desc.trim()}</span>
                </div>
            );
        }
        return <span className="font-medium text-gray-900 line-clamp-2 leading-snug">{fullTitle}</span>;
    };

    const isGenericSku = product.productSkus?.length === 1 && product.productSkus[0].color === '__generic__';

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 relative h-full">
            <Link href={productDetailPath} className="block relative aspect-[4/5] sm:aspect-square overflow-hidden bg-[#F5F5F7]">
                {/*
                   1. bg-[#F5F5F7]: 使用高级淡灰色背景，让透明PNG产品凸显出来。
                   2. aspect-[4/5]: 稍微加高一点比例，适合这一类长条形的玩具，比纯正方形更优雅。
                */}

                {/* 增加一个内层容器来控制 Padding */}
                <div className="absolute inset-0 p-6 sm:p-8 flex items-center justify-center">
                    <Image
                        src={mainImage}
                        alt={product.title}
                        width={400}
                        height={400}
                        // 核心修改：
                        // 1. object-contain: 确保原本90%占比的图不会因为裁切显得更大。
                        // 2. drop-shadow-sm: 给产品加一点点投影，增加立体感。
                        // 3. mix-blend-multiply: 如果图片自带微弱白底，这个属性可以把它“融”进灰色背景里（如果是纯透明PNG可去掉）。
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 drop-shadow-sm mix-blend-multiply"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                </div>

                {/* Favorite Button (保持位置不变) */}
                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors z-10 ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>

                {/* Badges (保持位置不变) */}
                <ProductBadge
                    stockStatus={hasAvailableStock}
                    originalPrice={product.originalPrice}
                    currentPrice={product.currentPrice}
                    badge={product.badge}
                />
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <Link href={productDetailPath} className="mb-2 block min-h-[3rem]">
                    {renderTitle(product.title)}
                </Link>

                {!isGenericSku && (
                    <div className="flex items-center gap-2 mb-3 min-h-[12px]">
                        <div className="flex gap-1.5 h-4 items-center">
                            {product.productSkus?.slice(0, 3).map(sku => (
                                // ✅ 修复：外圈是透明背景+灰色边框，内圈是实心颜色
                                <div
                                    key={sku.id}
                                    className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center p-[2px]" // 外圈容器
                                    title={sku.color}
                                >
                                    {/* 内圈实心圆点 */}
                                    <div
                                        className="w-full h-full rounded-full"
                                        style={{ backgroundColor: getMappedColor(sku.color || '') }}
                                    />
                                </div>
                            ))}
                            {(product.productSkus?.length || 0) > 3 && (
                                <span className="text-[10px] text-gray-400 ml-0.5">+{(product.productSkus?.length || 0) - 3}</span>
                            )}
                        </div>
                    </div>
                )}

                {isGenericSku && <div className="mb-3 min-h-[12px]"></div>}

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