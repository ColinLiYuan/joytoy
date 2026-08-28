// components/product/product-card.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProductResponse, ProductSku } from '@/types/product';
import { getProductImageUrl } from '@/lib/image-utils';
import { addToWishlist, removeFromWishlist } from '@/app/actions/wishlist';
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
    const hoverImage = useMemo(() => (product.image2 ? getProductImageUrl('', product.image2) : null), [product.image2]);

    // 判断是否为白底图片（文件名包含 'full' 表示彩色底，需要撑满显示）
    const isFullBackgroundImage = product.image?.toLowerCase().includes('full');
    const isFullHoverImage = product.image2?.toLowerCase().includes('full');

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
                productSlug: product.slug,
                productTitle: product.title,
                productName: product.name,
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
                // 传递完整的产品信息
                const success = await addToWishlist({
                    productId: product.id,
                    slug: product.slug,
                    productTitle: product.title,
                    image: product.image,
                    currentPrice: product.currentPrice,
                    originalPrice: product.originalPrice,
                    badge: product.badge,
                });
                
                // 如果返回 false，说明 session 过期，需要登录
                if (!success) {
                    setIsFavorited(!newState); // 回滚 UI 状态
                    openAuthModal('login', { onSuccess: executeToggleFavorite });
                    return;
                }
                
                // 更新 localStorage 中的最近浏览记录
                updateRecentlyViewedFavorite(product.id, true);
            } else {
                const success = await removeFromWishlist(product.id);
                
                // 如果返回 false，说明 session 过期，需要登录
                if (!success) {
                    setIsFavorited(!newState); // 回滚 UI 状态
                    openAuthModal('login', { onSuccess: executeToggleFavorite });
                    return;
                }
                
                // 更新 localStorage 中的最近浏览记录
                updateRecentlyViewedFavorite(product.id, false);
            }
            onWishlistUpdate?.();
        } catch (error) {
            // 只有真正的错误才会走到这里，静默回滚 UI
            setIsFavorited(!newState);
            console.error('Wishlist toggle error:', error);
            showToast('error', 'Oops!', 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isOnSale = product.originalPrice > product.currentPrice;

    // 更新最近浏览记录中的收藏状态
    const updateRecentlyViewedFavorite = (productId: number, favorited: boolean) => {
        try {
            const stored = localStorage.getItem('recently_viewed');
            if (!stored) return;
            
            const viewed: ProductResponse[] = JSON.parse(stored);
            const updated = viewed.map(p => 
                p.id === productId ? { ...p, favorited } : p
            );
            
            localStorage.setItem('recently_viewed', JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to update recently viewed favorite status:', e);
        }
    };

    const renderTitle = (fullTitle: string) => {
        if (!fullTitle) {
            return <span className="font-medium text-gray-900 line-clamp-2 leading-snug">Untitled Product</span>;
        }
        
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
            <Link href={productDetailPath} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">

                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src={mainImage}
                        alt={product.title || 'Product image'}
                        width={400}
                        height={400}
                        className={`${isFullBackgroundImage ? 'object-cover' : 'p-6 object-contain mix-blend-multiply'} w-full h-full group-hover:scale-105 transition-transform duration-500`}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={product.title || 'Product image'}
                            width={400}
                            height={400}
                            loading="lazy"
                            className={`${isFullHoverImage ? 'object-cover' : 'p-6 object-contain mix-blend-multiply'} w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`}
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                        />
                    )}
                </div>

                <button
                    onClick={handleToggleFavorite}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors z-10 ${isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>

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
                                <div
                                    key={sku.id}
                                    className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center p-[2px]"
                                    title={sku.color}
                                >
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
                                {/* ✅ 颜色已修改为 Passion Red (#E11D48) 以匹配详情页 */}
                                <span className="text-lg font-bold text-[#E11D48]">
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
                            w-12 h-12 rounded-full flex items-center justify-center transition-all
                            ${!hasAvailableStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-md'
                        }
                        `}
                        aria-label="Add to cart"
                    >
                        {addingToCart ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <ShoppingBag size={20} strokeWidth={1.5} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}