// app/(site)/toys/[...slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // 保留，虽然 ProductCard 内部处理了跳转，但 Breadcrumb 可能用到
import dynamic from 'next/dynamic';
import { ProductResponse, ProductSku } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { wishlistService } from '@/services/wishlistService';
import { productService } from '@/services/product-service';
import { getProductImageUrl } from '@/lib/image-utils';
import { Z_INDEX } from '@/lib/constants/z-index';

// ✅ 引入统一的卡片组件
import ProductCard from '@/components/product/product-card';
import ProductGallery from '@/components/product/product-gallery';
import Breadcrumb from '@/components/common/breadcrumb';

import {
    ShoppingBag, ShieldCheck, Package, Truck, ChevronDown, ChevronUp, Star, Heart, Loader2, Zap, Check, Droplets, BatteryCharging, Volume2, Smartphone, Feather
} from 'lucide-react';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const BADGE_CONFIG: Record<string, { label: string; className: string }> = {
    'NEW': { label: 'New Arrival', className: 'bg-blue-600' },
    'HOT': { label: 'Best Seller', className: 'bg-amber-500' },
    'STAFF_PICK': { label: 'Staff Pick', className: 'bg-purple-600' },
    'LIMITED': { label: 'Limited Edition', className: 'bg-gray-900' },
};

const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false, loading: () => <div className="h-20 bg-gray-50 animate-pulse rounded-lg"></div> }
);

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

const getFeatureIconAndStyle = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('water') || lowerText.includes('proof')) return { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' };
    if (lowerText.includes('usb') || lowerText.includes('charg') || lowerText.includes('power')) return { icon: BatteryCharging, color: 'text-green-500', bg: 'bg-green-50' };
    if (lowerText.includes('quiet') || lowerText.includes('noise') || lowerText.includes('decibel')) return { icon: Volume2, color: 'text-purple-500', bg: 'bg-purple-50' };
    if (lowerText.includes('app') || lowerText.includes('remote') || lowerText.includes('control')) return { icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    if (lowerText.includes('silicone') || lowerText.includes('safe') || lowerText.includes('skin')) return { icon: ShieldCheck, color: 'text-pink-500', bg: 'bg-pink-50' };
    if (lowerText.includes('soft') || lowerText.includes('touch')) return { icon: Feather, color: 'text-orange-500', bg: 'bg-orange-50' };
    return { icon: Check, color: 'text-gray-600', bg: 'bg-gray-100' };
};

// ✅ 修复后的轮播组件：尺寸更协调
const ProductCarousel = ({ title, products }: { title: string; products: ProductResponse[] }) => {
    if (!products || products.length === 0) return null;
    return (
        <div className="py-10 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6 px-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-['Playfair_Display']">{title}</h3>
                <span className="text-xs text-gray-400 lg:hidden">Swipe →</span>
            </div>

            {/*
                容器布局修复：
                - Mobile: flex gap-4 overflow-x-auto (横向滚动)
                - Desktop: grid grid-cols-4 (标准的四列布局)
                - Card Width: 移动端 w-[180px] (更紧凑)，桌面端 w-auto (自适应)
            */}
            <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
                {products.map((p) => (
                    <div key={p.id} className="flex-shrink-0 w-[180px] md:w-auto snap-start h-full">
                        <ProductCard product={p} />
                    </div>
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
    const { openAuthModal, isLoggedIn } = useAuth();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            if (defaultColor) {
                const matchingSku = product.productSkus.find(sku => sku.color?.toLowerCase() === defaultColor.toLowerCase());
                if (matchingSku) { setSelectedSku(matchingSku); return; }
            }
            setSelectedSku(product.productSkus[0]);
        }
    }, [product.productSkus, defaultColor]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!product.slug) return;
            try {
                const products = await productService.getRelatedProducts(product.slug);
                setRelatedProducts(products);
            } catch (error) { console.error(error); }
        };
        fetchRelated();
    }, [product.slug]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('recently_viewed');
            let viewed: ProductResponse[] = stored ? JSON.parse(stored) : [];
            const otherViewed = viewed.filter(p => p.id !== product.id);
            const newViewedHistory = [product, ...otherViewed].slice(0, 8);
            localStorage.setItem('recently_viewed', JSON.stringify(newViewedHistory));
            setRecentlyViewed(otherViewed.slice(0, 4)); // 限制显示数量，保持整洁
        } catch (e) { console.error(e); }
    }, [product]);

    const getAvailableStock = (sku: ProductSku | null | undefined) => {
        if (!sku) return 0;
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    const getMappedColor = (color: string) => colorMap[color.toLowerCase().trim()] || color;
    const isOnSale = product.originalPrice > product.currentPrice;
    const isCurrentSkuOutOfStock = selectedSku && getAvailableStock(selectedSku) <= 0;
    const badgeConfig = product.badge ? BADGE_CONFIG[product.badge.toUpperCase()] : null;

    const galleryBadges = (
        <>
            {isCurrentSkuOutOfStock && (
                <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                    Sold Out
                </span>
            )}
            {!isCurrentSkuOutOfStock && badgeConfig && (
                <span className={`${badgeConfig.className} text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm`}>
                    {badgeConfig.label}
                </span>
            )}
        </>
    );

    const handleToggleFavorite = async () => {
        if (!isLoggedIn) { openAuthModal('login', { onSuccess: executeToggleFavorite }); return; }
        executeToggleFavorite();
    };

    const executeToggleFavorite = async () => {
        if (isWishlistLoading) return;
        setIsWishlistLoading(true);
        const newState = !isFavorited;
        setIsFavorited(newState);
        try {
            if (newState) {
                await wishlistService.addItemToWishlist({
                    productId: product.id,
                    productTitle: product.title,
                    image: product.image,
                    originalPrice: product.originalPrice,
                    currentPrice: product.currentPrice,
                    slug: product.slug,
                    badge: product.badge
                });
                showToast('success', 'Saved', 'Added to your wishlist');
            } else {
                await wishlistService.removeItemFromWishlist({ productId: product.id });
                showToast('success', 'Removed', 'Removed from wishlist');
            }
        } catch (error) { setIsFavorited(!newState); showToast('error', 'Error', 'Failed to update wishlist'); } finally { setIsWishlistLoading(false); }
    };

    const performAddToCart = async () => {
        if (!product || !selectedSku) return false;
        if (getAvailableStock(selectedSku) <= 0) return false;
        try {
            await addItemToCart({ productId: product.id, productTitle: product.title, productSku: selectedSku.sku, productImage: getProductImageUrl('', product.image), unitPrice: product.currentPrice, quantity: 1, color: selectedSku.color, skuId: selectedSku.id });
            return true;
        } catch (error) { console.error(error); showToast('error', 'Error', 'Failed to add product.'); return false; }
    };

    const handleAddToCart = async () => { setAddingToCart(true); const success = await performAddToCart(); setAddingToCart(false); };
    const handleBuyNow = async () => { setBuyingNow(true); const success = await performAddToCart(); if (success) router.push('/checkout'); setBuyingNow(false); };
    const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section);

    const renderDetailTitle = (fullTitle: string) => {
        if (fullTitle.includes('|')) {
            const [name, desc] = fullTitle.split('|');
            return (
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Playfair_Display'] leading-tight">{name.trim()}</h1>
                    <span className="text-lg md:text-xl text-gray-500 font-['Inter'] font-light">{desc.trim()}</span>
                </div>
            );
        }
        return <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['Playfair_Display'] leading-tight">{fullTitle}</h1>;
    };

    return (
        <div className="w-full pb-32 lg:pb-16">
            <div className="mb-6"><Breadcrumb items={breadcrumbs} showLastItem={false} /></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-6">
                <div>
                    <ProductGallery images={galleryImages} productTitle={product.title}
                        // @ts-ignore
                                    badges={galleryBadges}
                    />
                </div>

                <div className="flex flex-col">
                    <div className="border-b border-gray-100 pb-6 mb-6">
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex-1 min-w-0 pr-2">{renderDetailTitle(product.title)}</div>
                            <button onClick={handleToggleFavorite} className={`p-2.5 rounded-full transition-all flex-shrink-0 ${isFavorited ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'}`}>
                                <Heart size={22} fill={isFavorited ? "currentColor" : "none"} strokeWidth={isFavorited ? 0 : 2} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                {isOnSale ? (
                                    <><span className="text-2xl font-bold text-[#b62337]">${product.currentPrice.toFixed(2)}</span><span className="text-lg text-gray-400 line-through decoration-gray-300">${product.originalPrice.toFixed(2)}</span></>
                                ) : (<span className="text-2xl font-bold text-gray-900">${product.currentPrice.toFixed(2)}</span>)}
                            </div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                                <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                            </div>
                        </div>
                    </div>

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
                                        <button key={sku.id} onClick={() => !isOutOfStock && setSelectedSku(sku)} disabled={isOutOfStock} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'} ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer shadow-sm'}`} style={{ backgroundColor: colorHex === '#FFFFFF' ? '#F3F4F6' : colorHex }} title={sku.color}>
                                            {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-gray-400 rotate-45"></div></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="hidden lg:flex gap-4 mb-8">
                        <button className={`flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`} onClick={handleAddToCart} disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                            {addingToCart ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingBag size={20} strokeWidth={2} /> Add to Bag</>}
                        </button>
                        <button className={`flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm border-2 ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-black text-black hover:bg-gray-50'}`} onClick={handleBuyNow} disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                            {buyingNow ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={20} strokeWidth={2} /> Buy Now</>}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-gray-100">
                        <div className="flex flex-col items-center text-center gap-3"><div className="p-2.5 bg-gray-50 rounded-full text-black"><Package size={20} strokeWidth={1.5} /></div><span className="text-xs font-medium text-gray-600 leading-tight">Discreet<br/>Packaging</span></div>
                        <div className="flex flex-col items-center text-center gap-3"><div className="p-2.5 bg-gray-50 rounded-full text-black"><ShieldCheck size={20} strokeWidth={1.5} /></div><span className="text-xs font-medium text-gray-600 leading-tight">Body-Safe<br/>Materials</span></div>
                        <div className="flex flex-col items-center text-center gap-3"><div className="p-2.5 bg-gray-50 rounded-full text-black"><Truck size={20} strokeWidth={1.5} /></div><span className="text-xs font-medium text-gray-600 leading-tight">Free Shipping<br/>Over $40</span></div>
                    </div>

                    {features.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {features.map((feature, idx) => {
                                const style = getFeatureIconAndStyle(feature);
                                const Icon = style.icon;
                                return (
                                    <div key={idx} className={`flex items-center gap-2.5 text-sm font-medium text-gray-700 ${style.bg} p-3 rounded-xl border border-transparent hover:border-gray-200 transition-colors`}>
                                        <Icon size={18} className={style.color} />
                                        <span className="line-clamp-1">{feature}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="border-b border-gray-100">
                        <button onClick={() => toggleSection('description')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                            Description {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === 'description' && (
                            <div className="pb-6 animate-fadeIn">
                                <div data-color-mode="light" className="markdown-content">
                                    <MDViewer
                                        source={description}
                                        style={{ backgroundColor: 'transparent', color: '#4b5563', fontSize: '1rem', lineHeight: '1.75', fontFamily: 'var(--font-inter), sans-serif' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {specifications.length > 0 && (
                        <div className="border-b border-gray-100">
                            <button onClick={() => toggleSection('specs')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                                Specifications {expandedSection === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSection === 'specs' && (
                                <div className="pb-6 grid grid-cols-1 gap-2 animate-fadeIn">
                                    {specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-500 capitalize text-sm">{spec.specKey.replace(/_/g, ' ')}</span>
                                            <span className="font-medium text-gray-900 text-sm text-right">{spec.specValue}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 safe-area-pb" style={{ zIndex: Z_INDEX.STICKY }}>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-gray-900 truncate flex-1">{product.title}</p>
                        <div className="flex items-baseline gap-2 flex-shrink-0">
                            {isOnSale ? (
                                <><p className="text-xs font-bold text-[#b62337] whitespace-nowrap">${product.currentPrice}</p><p className="text-[10px] text-gray-400 line-through">${product.originalPrice}</p></>
                            ) : (<p className="font-bold text-gray-900 text-xs">${product.currentPrice}</p>)}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        {selectedSku ? <><span className="w-2 h-2 rounded-full border border-gray-200 inline-block" style={{ backgroundColor: getMappedColor(selectedSku.color || '') }} />{selectedSku.color}</> : "Select Color"}
                    </p>
                </div>
                <button className={`h-11 px-6 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap flex-shrink-0 flex items-center justify-center ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 active:scale-95'}`} onClick={handleAddToCart} disabled={addingToCart || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                    {addingToCart ? <Loader2 size={18} className="animate-spin" /> : 'Add to Bag'}
                </button>
            </div>

            <div className="mt-16 space-y-8">
                {relatedProducts.length > 0 && <ProductCarousel title="You May Also Like" products={relatedProducts} />}
                {recentlyViewed.length > 0 && <ProductCarousel title="Recently Viewed" products={recentlyViewed} />}
            </div>
        </div>
    );
}