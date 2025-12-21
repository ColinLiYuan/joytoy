// app/(site)/toys/[...slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ProductResponse, ProductSku, HighlightData } from '@/types/product'; // 记得更新类型定义
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { wishlistService } from '@/services/wishlistService';
import { productService } from '@/services/product-service';
import { getProductImageUrl } from '@/lib/image-utils';
import { Z_INDEX } from '@/lib/constants/z-index';
import ProductCard from '@/components/product/product-card';
import ProductGallery from '@/components/product/product-gallery';
import Breadcrumb from '@/components/common/breadcrumb';
import ProductBadge from '@/components/product/product-badge';
import ProductReviews from '@/components/product/reviews/product-reviews';
import {
    ShoppingBag, ShieldCheck, Package, Truck, ChevronDown, ChevronUp, Star, Heart,
    Loader2, BatteryCharging, Droplets, Box, Smartphone, Feather, Volume2, Check,
    // 👇 更新这些 Spec 相关的图标
    Ruler,          // Dimensions (尺子)
    Scale,          // Weight (天平)
    Activity,       // Material/Usage Time (脉冲线)
    EyeOff,         // Discreet (闭眼)
    Waves,          // Vibration (波纹)
    Zap,            // Power (闪电),
    Power,
    Hourglass
} from 'lucide-react';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false, loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-lg"></div> }
);

// ✅ 规格参数映射表 (Key -> Display Label)
const SPEC_LABEL_MAP: Record<string, string> = {
    // 基础
    "Material": "Material",
    "Size": "Dimensions",
    "Dimensions": "Dimensions",
    "Weight": "Weight",

    // 电源与时间
    "Power Source": "Power",
    "Power": "Power",
    "Battery Life": "Usage Time", // 截图显示为 Usage Time
    "Play Time": "Usage Time",
    "Usage Time": "Usage Time",
    "Charging Time": "Charge Time",
    "Charge Time": "Charge Time",

    // 性能
    "Noise Level": "Noise",
    "Noise": "Noise",
    "Waterproof": "Waterproof",
    "Discreet Level": "Discreet Level",
    "Vibration Modes": "Vibration Modes",
};

// 辅助函数：获取规格图标 (可选，增加视觉丰富度)
const getSpecIcon = (key: string) => {
    const k = key.toLowerCase();

    if (k.includes('material')) return <Feather size={18} strokeWidth={1.5} />;

    // 1. 隐秘等级 -> 闭眼 (EyeOff)
    if (k.includes('discreet')) return <EyeOff size={18} strokeWidth={1.5} />;

    // 2. 震动模式 -> 波纹 (Waves)
    if (k.includes('vibration') || k.includes('mode')) return <Waves size={18} strokeWidth={1.5} />;

    // 3. 尺寸 -> 尺子 (Ruler)
    if (k.includes('size') || k.includes('dimension')) return <Ruler size={18} strokeWidth={1.5} />;

    // 4. 重量 -> 天平 (Scale)
    if (k.includes('weight')) return <Scale size={18} strokeWidth={1.5} />;

    // 5. 噪音 -> 喇叭 (Volume2)
    if (k.includes('noise')) return <Volume2 size={18} strokeWidth={1.5} />;

    // 6. 充电时间 -> 电池充电 (BatteryCharging)
    if (k.includes('charg')) return <BatteryCharging size={18} strokeWidth={1.5} />;

    // 7. 电源 -> 闪电 (Zap)
    if (k.includes('power')) return <Zap size={18} strokeWidth={1.5} />;

    // 8. 材质 & 使用时间 -> 脉冲线 (Activity) - 模仿截图风格
    if (k.includes('usage')) return <Hourglass size={18} strokeWidth={1.5} />;

    // 9. 防水 -> 水滴 (Droplets)
    if (k.includes('water')) return <Droplets size={18} strokeWidth={1.5} />;

    // 默认图标
    return <Activity size={18} strokeWidth={1.5} />;
};

interface ProductDetailClientProps {
    product: ProductResponse;
    breadcrumbs: any[];
    galleryImages: any[];
    specifications: any[];
    features: string[];
    description: string; // 这是"说明书"
    defaultColor: string | null;
    colorMap: { [key: string]: string };
}

// 辅助函数：Feature Icon
const getFeatureIconAndStyle = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('water') || lowerText.includes('proof')) return { icon: Droplets, color: 'text-gray-600' };
    if (lowerText.includes('usb') || lowerText.includes('charg')) return { icon: BatteryCharging, color: 'text-gray-600' };
    if (lowerText.includes('quiet') || lowerText.includes('noise')) return { icon: Volume2, color: 'text-gray-600' };
    if (lowerText.includes('app') || lowerText.includes('remote')) return { icon: Smartphone, color: 'text-gray-600' };
    if (lowerText.includes('silicone') || lowerText.includes('safe')) return { icon: ShieldCheck, color: 'text-gray-600' };
    return { icon: Check, color: 'text-gray-600' };
};

// 轮播组件保持不变
const ProductCarousel = ({ title, products }: { title: string; products: ProductResponse[] }) => {
    if (!products || products.length === 0) return null;
    return (
        <div className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-7xl">
                <h3 className="text-2xl font-bold text-gray-900 font-['Playfair_Display'] mb-8">{title}</h3>
                <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
                    {products.map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-[220px] md:w-auto snap-start h-full">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
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
    // 状态管理
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const [isFavorited, setIsFavorited] = useState(product.favorited || false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    // 折叠面板状态：默认展开 Description
    const [activeAccordion, setActiveAccordion] = useState<string | null>('details');

    const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<ProductResponse[]>([]);

    const { showToast } = useToast();
    const { openAuthModal, isLoggedIn } = useAuth();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    // console.log('product detail : ', product)

    // ✅ 解析 JSON 数据 (Highlight & Box Contents)
    const highlightData: HighlightData | null = useMemo(() => {
        if (!product.highlightData) return null;
        try {
            return JSON.parse(product.highlightData);
        } catch (e) {
            console.error("Failed to parse highlight_data", e);
            return null;
        }
    }, [product.highlightData]);

    const boxContents: string[] = useMemo(() => {
        if (!product.boxContents) return [];
        try {
            const parsed = JSON.parse(product.boxContents);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }, [product.boxContents]);


    // SKU Logic
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            if (defaultColor) {
                const matchingSku = product.productSkus.find(sku => sku.color?.toLowerCase() === defaultColor.toLowerCase());
                if (matchingSku) { setSelectedSku(matchingSku); return; }
            }
            setSelectedSku(product.productSkus[0]);
        }
    }, [product.productSkus, defaultColor]);

    // Fetch Related & Recent
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
            setRecentlyViewed(otherViewed.slice(0, 4));
        } catch (e) { console.error(e); }
    }, [product]);

    // Helpers
    const getAvailableStock = (sku: ProductSku | null | undefined) => sku ? (sku.stock || 0) - (sku.lockedStock || 0) : 0;
    const getMappedColor = (color: string) => colorMap[color.toLowerCase().trim()] || color;
    const isOnSale = product.originalPrice > product.currentPrice;
    const isCurrentSkuInStock = selectedSku ? getAvailableStock(selectedSku) > 0 : true;

    // Actions (Favorite & Add to Cart) - 保持不变
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
        if (!product || !selectedSku || getAvailableStock(selectedSku) <= 0) return false;
        try {
            await addItemToCart({
                productId: product.id,
                productSlug: product.slug,
                productTitle: product.title,
                productSku: selectedSku.sku,
                productImage: getProductImageUrl('', product.image),
                unitPrice: product.currentPrice,
                quantity: 1,
                color: selectedSku.color,
                skuId: selectedSku.id
            });
            return true;
        } catch (error) { console.error(error); showToast('error', 'Error', 'Failed to add product.'); return false; }
    };
    const handleAddToCart = async () => { setAddingToCart(true); const success = await performAddToCart(); setAddingToCart(false); };
    const handleBuyNow = async () => { setBuyingNow(true); const success = await performAddToCart(); if (success) router.push('/checkout'); setBuyingNow(false); };

    // Accordion Helper
    const toggleAccordion = (id: string) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    // Title Render
    const renderDetailTitle = (fullTitle: string) => {
        if (fullTitle.includes('|')) {
            const [name, desc] = fullTitle.split('|');
            return (
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-['Playfair_Display'] leading-[1.1]">{name.trim()}</h1>
                    <span className="text-xl text-gray-500 font-['Inter'] font-light">{desc.trim()}</span>
                </div>
            );
        }
        return <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-['Playfair_Display'] leading-tight">{fullTitle}</h1>;
    };

    const galleryBadges = (
        <ProductBadge
            stockStatus={isCurrentSkuInStock}
            originalPrice={product.originalPrice}
            currentPrice={product.currentPrice}
            badge={product.badge}
            className="absolute top-6 left-6 z-20 scale-110"
        />
    );

    return (
        <div className="w-full">
            {/* --- SECTION 0: BREADCRUMBS --- */}
            <div className="container mx-auto px-4 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={false} />
            </div>

            {/* --- SECTION 1: THE FOLD (Gallery + Purchase Info) --- */}
            <div className="container mx-auto px-4 max-w-7xl pb-16 lg:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left: Gallery */}
                    <div className="w-full">
                        <ProductGallery
                            images={galleryImages}
                            productTitle={product.title}
                            // @ts-ignore
                            badges={galleryBadges}
                        />
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col h-full justify-center">
                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <div className="flex justify-between items-start gap-4 mb-2">
                                <div className="flex-1 min-w-0 pr-2">{renderDetailTitle(product.title)}</div>
                                <button onClick={handleToggleFavorite} className={`p-3 rounded-full transition-all flex-shrink-0 ${isFavorited ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}>
                                    <Heart size={24} fill={isFavorited ? "currentColor" : "none"} strokeWidth={isFavorited ? 0 : 2} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-baseline gap-4">
                                    {isOnSale ? (
                                        <>
                                            <span className="text-3xl font-bold text-[#E11D48]">${product.currentPrice.toFixed(2)}</span>
                                            <span className="text-xl text-gray-400 line-through decoration-gray-300">${product.originalPrice.toFixed(2)}</span>
                                        </>
                                    ) : (<span className="text-3xl font-bold text-gray-900">${product.currentPrice.toFixed(2)}</span>)}
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                                    <span className="text-sm text-gray-500 ml-2 font-medium">{product.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Feature Pills (Tech Badge Style) */}
                        {features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {features.slice(0, 4).map((feature, idx) => {
                                    const style = getFeatureIconAndStyle(feature);
                                    const Icon = style.icon;
                                    return (
                                        <div key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3F4F6] text-gray-700 text-xs font-medium rounded-md">
                                            <Icon size={14} className={style.color} />
                                            {feature}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* SKU Selector */}
                        {product.productSkus && product.productSkus.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                                    Select Shade: <span className="text-gray-500 font-normal capitalize ml-2">{selectedSku?.color || 'Select'}</span>
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.productSkus.map((sku) => {
                                        const isSelected = selectedSku?.id === sku.id;
                                        const isOutOfStock = getAvailableStock(sku) <= 0;
                                        const colorHex = getMappedColor(sku.color || '');
                                        return (
                                            <button key={sku.id} onClick={() => !isOutOfStock && setSelectedSku(sku)} disabled={isOutOfStock} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'} ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer shadow-sm'}`} style={{ backgroundColor: colorHex === '#FFFFFF' ? '#F3F4F6' : colorHex }} title={sku.color}>
                                                {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-gray-400 rotate-45"></div></div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button className={`flex-1 py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`} onClick={handleAddToCart} disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                                {addingToCart ? <Loader2 size={24} className="animate-spin" /> : <><ShoppingBag size={20} strokeWidth={2} /> Add to Bag</>}
                            </button>
                            <button className={`flex-1 py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm border-2 ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-black text-black hover:bg-gray-50'}`} onClick={handleBuyNow} disabled={addingToCart || buyingNow || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                                {buyingNow ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={20} strokeWidth={2} /> Buy Now</>}
                            </button>
                        </div>

                        {/* Trust Signals */}
                        <div className="flex justify-between items-center py-6 border-t border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Truck size={16} /> Discreet Shipping</span>
                            <span className="flex items-center gap-2"><ShieldCheck size={16} /> Body-Safe</span>
                            <span className="flex items-center gap-2"><Package size={16} /> Plain Box</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ✅ SECTION 2: PRODUCT HIGHLIGHTS (Data Driven) --- */}
            {highlightData && (
                <div className="w-full bg-[#F9FAFB] py-20 lg:py-32 border-t border-gray-100">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Text Content (Romance Copy) */}
                            <div className="order-2 lg:order-1">
                                <div className="mb-8">
                                    <span className="text-[#E11D48] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Why You'll Love It</span>
                                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-['Playfair_Display'] mb-6 leading-tight">
                                        {highlightData.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                                        {highlightData.body}
                                    </p>
                                </div>
                            </div>

                            {/* Mood Image (Right Side) */}
                            <div className="order-1 lg:order-2 h-[400px] lg:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    // 自动处理 Cloudflare 图片路径
                                    src={getProductImageUrl('', highlightData.image)}
                                    alt={highlightData.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION 3: HOW TO USE (Static Visuals) --- */}
            <div className="w-full bg-white py-20 lg:py-28">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-16">
                        Simple & Intuitive
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6">
                                <BatteryCharging size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 font-['Playfair_Display']">1. Charge</h3>
                            <p className="text-gray-500 font-light">Fully charge until the light is steady.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6">
                                <Power size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 font-['Playfair_Display']">2. Activate</h3>
                            <p className="text-gray-500 font-light">Press and hold for 3 seconds to start.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 mb-6">
                                <Droplets size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 font-['Playfair_Display']">3. Clean</h3>
                            <p className="text-gray-500 font-light">Wash with warm water and cleaner.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ✅ SECTION 4: WHAT'S IN THE BOX (Data Driven) --- */}
            {boxContents.length > 0 && (
                <div className="w-full bg-[#F9FAFB] py-20 border-y border-gray-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/3 flex justify-center text-gray-300">
                                <Box size={120} strokeWidth={0.5} />
                            </div>
                            <div className="w-full md:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-8">
                                    What's in the Box
                                </h2>
                                <ul className="space-y-4">
                                    {boxContents.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-4 text-gray-700">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">{idx + 1}</div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ✅ SECTION 5: ACCORDIONS (Details + Mapped Specs) --- */}
            <div className="w-full bg-white py-16">
                <div className="container mx-auto px-4 max-w-3xl">

                    {/* 1. Product Details (Description) */}
                    {description && (
                        <div className="border-b border-gray-100">
                            <button
                                onClick={() => toggleAccordion('details')}
                                className="w-full flex justify-between items-center py-6 text-left"
                            >
                                <span className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Product Details</span>
                                {activeAccordion === 'details' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {activeAccordion === 'details' && (
                                <div className="pb-8 animate-fadeIn">
                                    <div data-color-mode="light" className="markdown-story">
                                        <MDViewer
                                            source={description}
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: '#4b5563',
                                                fontSize: '1rem',
                                                lineHeight: '1.75',
                                                fontFamily: 'var(--font-inter), sans-serif',
                                                fontWeight: 300
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. Specifications (Mapped) */}
                    {specifications.length > 0 && (
                        <div className="border-b border-gray-100">
                            <button
                                onClick={() => toggleAccordion('specs')}
                                className="w-full flex justify-between items-center py-6 text-left"
                            >
                                <span className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Technical Specifications</span>
                                {activeAccordion === 'specs' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {activeAccordion === 'specs' && (
                                <div className="pb-8 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                        {specifications.map((spec, idx) => {
                                            // 使用映射表转换 Label
                                            const displayLabel = SPEC_LABEL_MAP[spec.specKey] || spec.specKey.replace(/_/g, ' ');
                                            const Icon = getSpecIcon(displayLabel);

                                            return (
                                                <div key={idx} className="flex justify-between items-center py-3 border-b border-dashed border-gray-100">
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        {Icon}
                                                        <span className="text-sm font-medium">{displayLabel}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm text-right">{spec.specValue}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Static Shipping Info (Optional) */}
                    <div className="border-b border-gray-100">
                        <button
                            onClick={() => toggleAccordion('shipping')}
                            className="w-full flex justify-between items-center py-6 text-left"
                        >
                            <span className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Shipping & Returns</span>
                            {activeAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {activeAccordion === 'shipping' && (
                            <div className="pb-8 text-gray-600 text-sm leading-relaxed animate-fadeIn">
                                <p className="mb-4">We offer free discreet shipping on orders over $49. All packages are unbranded for your privacy.</p>
                                <p>If you are not satisfied with your purchase, you may return unopened items within 30 days. Due to the intimate nature of our products, opened items cannot be returned unless defective.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ProductReviews
                productId={product.id}
            />

            {/* --- STICKY MOBILE BAR --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 safe-area-pb" style={{ zIndex: Z_INDEX.STICKY }}>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs font-bold text-[#E11D48]">${product.currentPrice}</p>
                </div>
                <button className={`h-11 px-8 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap flex-shrink-0 flex items-center justify-center ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`} onClick={handleAddToCart} disabled={addingToCart || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                    {addingToCart ? <Loader2 size={18} className="animate-spin" /> : 'Add to Bag'}
                </button>
            </div>

            {/* --- CAROUSELS --- */}
            <div className="mt-8">
                {relatedProducts.length > 0 && <ProductCarousel title="You May Also Like" products={relatedProducts} />}
                {recentlyViewed.length > 0 && <ProductCarousel title="Recently Viewed" products={recentlyViewed} />}
            </div>
        </div>
    );
}