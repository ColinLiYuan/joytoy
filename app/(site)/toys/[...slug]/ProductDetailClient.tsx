// app/(site)/toys/[...slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ProductResponse, ProductSku } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { wishlistService } from '@/services/wishlistService';
import { productService } from '@/services/product-service';
import ProductGallery from '@/components/product/productGallery';
import { getProductImageUrl } from '@/lib/image-utils';
import { Z_INDEX } from '@/lib/constants/z-index';
import Breadcrumb from '@/components/common/breadcrumb';
import {
    ShoppingBag,
    ShieldCheck,
    Package,
    Truck,
    ChevronDown,
    ChevronUp,
    Star,
    Heart,
    Loader2,
    Zap,
    ArrowRight
} from 'lucide-react';

interface ProductDetailClientProps {
    product: ProductResponse;
    breadcrumbs: any[];
    galleryImages: any[];
    specifications: any[];
    features: string[];
    description: string;
    defaultColor: string | null;
    colorMap: { [key: string]: string };
}

// ✅ 新增：内部组件 - 横向滚动产品卡片 (Carousel)
// 专门用于 Related Products 和 Recently Viewed，解决堆叠太丑的问题
const ProductCarousel = ({ title, products }: { title: string; products: ProductResponse[] }) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="py-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-['Playfair_Display']">
                    {title}
                </h3>
                {/* 视觉引导：提示可以滑动 */}
                <span className="text-xs text-gray-400 flex items-center gap-1 lg:hidden">
                    Swipe <ArrowRight size={12} />
                </span>
            </div>

            {/* 横向滚动容器 */}
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
                {products.map((p) => (
                    <Link
                        key={p.id}
                        href={`/toys${p.slug}`}
                        className="flex-shrink-0 w-[160px] md:w-auto snap-start group"
                    >
                        <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 border border-gray-100">
                            <Image
                                src={getProductImageUrl('', p.image)}
                                alt={p.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5em] leading-snug group-hover:text-pink-600 transition-colors">
                            {p.title}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                            ${p.currentPrice.toFixed(2)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default function ProductDetailClient({
                                                product,
                                                breadcrumbs,
                                                galleryImages,
                                                specifications,
                                                features,
                                                description,
                                                defaultColor,
                                                colorMap
                                            }: ProductDetailClientProps) {
    const router = useRouter();
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>('description');

    const [isFavorited, setIsFavorited] = useState(product.favorited || false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<ProductResponse[]>([]);

    const { showToast } = useToast();
    const { openAuthModal, isLoggedIn, userInfo } = useAuth();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    // Init SKU
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            if (defaultColor) {
                const matchingSku = product.productSkus.find(sku =>
                    sku.color?.toLowerCase() === defaultColor.toLowerCase()
                );
                if (matchingSku) { setSelectedSku(matchingSku); return; }
            }
            setSelectedSku(product.productSkus[0]);
        }
    }, [product.productSkus, defaultColor]);

    // Fetch Related Products
    useEffect(() => {
        const fetchRelated = async () => {
            if (!product.slug) return;
            try {
                const products = await productService.getRelatedProducts(product.slug);
                setRelatedProducts(products);
            } catch (error) {
                console.error('Failed to load related products', error);
            }
        };
        fetchRelated();
    }, [product.slug]);

    // Recently Viewed (Local Storage)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('recently_viewed');
            let viewed: ProductResponse[] = stored ? JSON.parse(stored) : [];

            // 去重并过滤当前产品
            const otherViewed = viewed.filter(p => p.id !== product.id);

            // 更新 LocalStorage (把当前产品放到第一个)
            const newViewedHistory = [product, ...otherViewed].slice(0, 8);
            localStorage.setItem('recently_viewed', JSON.stringify(newViewedHistory));

            // 更新 State (只显示前 4-6 个其他产品)
            setRecentlyViewed(otherViewed.slice(0, 6));
        } catch (e) {
            console.error(e);
        }
    }, [product]);

    const getAvailableStock = (sku: ProductSku | null | undefined) => {
        if (!sku) return 0;
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    const getMappedColor = (color: string) => colorMap[color.toLowerCase().trim()] || color;
    const isOnSale = product.originalPrice > product.currentPrice;

    // Wishlist Logic
    const handleToggleFavorite = async () => {
        if (!isLoggedIn) {
            openAuthModal('login', { onSuccess: executeToggleFavorite });
            return;
        }
        executeToggleFavorite();
    };

    const executeToggleFavorite = async () => {
        if (isWishlistLoading) return;
        setIsWishlistLoading(true);
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
                showToast('success', 'Saved', 'Added to your wishlist');
            } else {
                await wishlistService.removeItemFromWishlist({ userId: userInfo.id, productId: product.id });
                showToast('success', 'Removed', 'Removed from wishlist');
            }
        } catch (error) {
            setIsFavorited(!newState);
            showToast('error', 'Error', 'Failed to update wishlist');
        } finally {
            setIsWishlistLoading(false);
        }
    };

    // Cart Logic
    const performAddToCart = async () => {
        if (!product || !selectedSku) return false;
        if (getAvailableStock(selectedSku) <= 0) return false;
        try {
            await addItemToCart({
                productId: product.id,
                productTitle: product.title,
                productSku: selectedSku.sku,
                productImage: getProductImageUrl('', product.image),
                unitPrice: product.currentPrice,
                quantity: 1,
                color: selectedSku.color,
                skuId: selectedSku.id
            });
            return true;
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to add product.');
            return false;
        }
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        const success = await performAddToCart();
        if (success) showToast('success', 'Added to Bag', `${product.title} is in your bag.`);
        setAddingToCart(false);
    };

    const handleBuyNow = async () => {
        setBuyingNow(true);
        const success = await performAddToCart();
        if (success) router.push('/checkout');
        setBuyingNow(false);
    };

    const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section);

    return (
        // ✅ 修复：给底部增加足够的 Padding (pb-32)，防止内容被 sticky bar 遮挡
        <div className="w-full pb-32 lg:pb-16">

            {/* 面包屑 */}
            <div className="mb-6">
                <Breadcrumb items={breadcrumbs} showLastItem={false} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Left: Gallery */}
                <div>
                    <ProductGallery images={galleryImages} productTitle={product.title} />
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    {/* Title & Price */}
                    <div className="border-b border-gray-100 pb-6 mb-6">
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display'] leading-tight">
                                {product.title}
                            </h1>
                            <button
                                onClick={handleToggleFavorite}
                                className={`
                                    p-2.5 rounded-full transition-all flex-shrink-0
                                    ${isFavorited
                                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                                }
                                `}
                            >
                                <Heart size={22} fill={isFavorited ? "currentColor" : "none"} strokeWidth={isFavorited ? 0 : 2} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                {isOnSale ? (
                                    <>
                                        <span className="text-2xl font-bold text-[#b62337]">${product.currentPrice.toFixed(2)}</span>
                                        <span className="text-lg text-gray-400 line-through decoration-gray-300">${product.originalPrice.toFixed(2)}</span>
                                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Sale</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">${product.currentPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                                <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                            </div>
                        </div>
                    </div>

                    {/* Color Selection */}
                    {product.productSkus && product.productSkus.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                Color: <span className="text-gray-500 font-normal capitalize">{selectedSku?.color || 'Select'}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.productSkus.map((sku) => {
                                    const isSelected = selectedSku?.id === sku.id;
                                    const isOutOfStock = getAvailableStock(sku) <= 0;
                                    const colorHex = getMappedColor(sku.color || '');
                                    return (
                                        <button
                                            key={sku.id}
                                            onClick={() => !isOutOfStock && setSelectedSku(sku)}
                                            disabled={isOutOfStock}
                                            className={`
                                                w-10 h-10 rounded-full flex items-center justify-center transition-all relative
                                                ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'}
                                                ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer shadow-sm'}
                                            `}
                                            style={{ backgroundColor: colorHex === '#FFFFFF' ? '#F3F4F6' : colorHex }}
                                            title={sku.color}
                                        >
                                            {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-gray-400 rotate-45"></div></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Desktop Actions (PC端按钮) */}
                    <div className="hidden lg:flex gap-4 mb-8">
                        <button
                            className={`
                                flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${!selectedSku || getAvailableStock(selectedSku) <= 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-gray-900'
                            }
                            `}
                            onClick={handleAddToCart}
                            disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}
                        >
                            {addingToCart ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingBag size={20} strokeWidth={2} /> Add to Bag</>}
                        </button>

                        <button
                            className={`
                                flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm border-2
                                ${!selectedSku || getAvailableStock(selectedSku) <= 0
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-black text-black hover:bg-gray-50'
                            }
                            `}
                            onClick={handleBuyNow}
                            disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}
                        >
                            {buyingNow ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={20} strokeWidth={2} /> Buy Now</>}
                        </button>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-gray-100">
                        {/* 统一使用 bg-gray-50 和 text-black */}
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-full text-black">
                                <Package size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-medium text-gray-600 leading-tight">Discreet<br/>Packaging</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-full text-black">
                                <ShieldCheck size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-medium text-gray-600 leading-tight">Body-Safe<br/>Materials</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="p-2.5 bg-gray-50 rounded-full text-black">
                                <Truck size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-medium text-gray-600 leading-tight">Free Shipping<br/>Over $40</span>
                        </div>
                    </div>

                    {/* Accordions (Description / Specs) */}
                    <div className="space-y-0">
                        <div className="border-b border-gray-100">
                            <button onClick={() => toggleSection('description')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                                Description {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSection === 'description' && <div className="pb-6 text-gray-600 leading-relaxed whitespace-pre-line animate-fadeIn">{description}</div>}
                        </div>

                        {specifications.length > 0 && (
                            <div className="border-b border-gray-100">
                                <button onClick={() => toggleSection('specs')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                                    Specifications {expandedSection === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {expandedSection === 'specs' && (
                                    <div className="pb-6 grid grid-cols-1 gap-2 animate-fadeIn">
                                        {specifications.map((spec, idx) => (
                                            <div key={idx} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-500 capitalize">{spec.specKey.replace(/_/g, ' ')}</span>
                                                <span className="font-medium text-gray-900">{spec.specValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 推荐区域：改为 Carousel 横向滑动，不占用过长垂直空间 */}
            <div className="mt-16 space-y-8">
                {relatedProducts.length > 0 && (
                    <ProductCarousel title="You May Also Like" products={relatedProducts} />
                )}

                {recentlyViewed.length > 0 && (
                    <ProductCarousel title="Recently Viewed" products={recentlyViewed} />
                )}
            </div>

            {/* Mobile Sticky Add to Cart Bar */}
            {/* ✅ 修复：Z-Index 设为 30 (高于 Footer 内容，低于 Overlay) */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 safe-area-pb"
                style={{ zIndex: Z_INDEX.STICKY }}
            >
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-900 truncate mr-2">{product.title}</p>
                        <p className="text-xs font-bold text-[#b62337] whitespace-nowrap">${product.currentPrice}</p>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        {selectedSku ? (
                            <>
                                <span className="w-2 h-2 rounded-full border border-gray-200 inline-block" style={{ backgroundColor: getMappedColor(selectedSku.color || '') }} />
                                {selectedSku.color}
                            </>
                        ) : "Select Color"}
                    </p>
                </div>
                <button
                    className={`h-11 px-6 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap flex-shrink-0 flex items-center justify-center ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900 active:scale-95'}`}
                    onClick={handleAddToCart}
                    disabled={addingToCart || !selectedSku || getAvailableStock(selectedSku) <= 0}
                >
                    {addingToCart ? <Loader2 size={18} className="animate-spin" /> : 'Add to Bag'}
                </button>
            </div>
        </div>
    );
}