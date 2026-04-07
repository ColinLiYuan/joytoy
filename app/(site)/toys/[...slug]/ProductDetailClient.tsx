'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ProductResponse, ProductSku, HighlightData } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { wishlistService } from '@/services/wishlistService';
import { productService } from '@/services/product-service';
import { joinWaitlist } from '@/app/actions/waitlist'; // ✅ Import the new action
import { getProductImageUrl } from '@/lib/image-utils';
import { Z_INDEX } from '@/lib/constants/z-index';
import ProductCard from '@/components/product/product-card';
import ProductGallery from '@/components/product/product-gallery';
import Breadcrumb from '@/components/common/breadcrumb';
import ProductBadge from '@/components/product/product-badge';
import ProductReviews from '@/components/product/reviews/product-reviews';
import FAQSection from '@/components/common/faq-section';

import {
    ShoppingBag, ShieldCheck, Package, Truck, ChevronDown, ChevronUp, Star, Heart,
    Loader2, BatteryCharging, Droplets, Box, Smartphone, Feather, Volume2, Check,
    Ruler, Scale, Activity, EyeOff, Waves, Zap, Power, Hourglass,
    FileText, BellRing
} from 'lucide-react';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false, loading: () => <div className="h-40 bg-gray-50 animate-pulse rounded-lg"></div> }
);

const SPEC_LABEL_MAP: Record<string, string> = {
    "Material": "Material",
    "Size": "Dimensions",
    "Dimensions": "Dimensions",
    "Weight": "Weight",
    "Power Source": "Power",
    "Power": "Power",
    "Battery Life": "Usage Time",
    "Play Time": "Usage Time",
    "Usage Time": "Usage Time",
    "Charging Time": "Charge Time",
    "Charge Time": "Charge Time",
    "Noise Level": "Noise",
    "Noise": "Noise",
    "Waterproof": "Waterproof",
    "Discreet Level": "Discreet Level",
    "Vibration Modes": "Vibration Modes",
};

const getSpecIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('material')) return <Feather size={18} strokeWidth={1.5} />;
    if (k.includes('discreet')) return <EyeOff size={18} strokeWidth={1.5} />;
    if (k.includes('vibration') || k.includes('mode')) return <Waves size={18} strokeWidth={1.5} />;
    if (k.includes('size') || k.includes('dimension')) return <Ruler size={18} strokeWidth={1.5} />;
    if (k.includes('weight')) return <Scale size={18} strokeWidth={1.5} />;
    if (k.includes('noise')) return <Volume2 size={18} strokeWidth={1.5} />;
    if (k.includes('charg')) return <BatteryCharging size={18} strokeWidth={1.5} />;
    if (k.includes('power')) return <Zap size={18} strokeWidth={1.5} />;
    if (k.includes('usage')) return <Hourglass size={18} strokeWidth={1.5} />;
    if (k.includes('water')) return <Droplets size={18} strokeWidth={1.5} />;
    return <Activity size={18} strokeWidth={1.5} />;
};

interface ProductDetailClientProps {
    product: ProductResponse;
    breadcrumbs: any[];
    galleryItems: any[];
    specifications: any[];
    features: string[];
    description: string;
    defaultColor: string | null;
    colorMap: { [key: string]: string };
}

const getFeatureIconAndStyle = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('water') || lowerText.includes('proof')) return { icon: Droplets, color: 'text-gray-600' };
    if (lowerText.includes('usb') || lowerText.includes('charg')) return { icon: BatteryCharging, color: 'text-gray-600' };
    if (lowerText.includes('quiet') || lowerText.includes('noise')) return { icon: Volume2, color: 'text-gray-600' };
    if (lowerText.includes('app') || lowerText.includes('remote')) return { icon: Smartphone, color: 'text-gray-600' };
    if (lowerText.includes('silicone') || lowerText.includes('safe')) return { icon: ShieldCheck, color: 'text-gray-600' };
    return { icon: Check, color: 'text-gray-600' };
};

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

// --- WAITLIST COMPONENT (UPDATED) ---
const WaitlistForm = ({ skuColor, productTitle }: { skuColor: string | undefined, productTitle: string }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);

        // Call the server action
        const result = await joinWaitlist(formData);

        if (result.success) {
            setStatus('success');
            showToast('success', 'Subscribed', 'You have joined the waitlist.');
        } else {
            setStatus('idle');
            showToast('error', 'Error', result.error || 'Something went wrong. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="bg-[#F0FDF4] border border-green-100 rounded-xl p-6 text-center animate-fade-in">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
                    <Check size={24} strokeWidth={3} />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-2">You're on the list!</h3>
                <p className="text-green-700 text-sm">We'll email you as soon as the <strong>{skuColor}</strong> variant is back.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
                <BellRing size={24} className="text-black flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Join the Waitlist</h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 font-light">
                        Get notified when this item is back. Subscribers get a priority discount.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
                {/* Hidden inputs to pass product context to server action */}
                <input type="hidden" name="productTitle" value={productTitle} />
                <input type="hidden" name="skuColor" value={skuColor || 'Default'} />

                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full bg-black text-white font-bold text-sm uppercase tracking-widest py-3.5 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Notify Me'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function ProductDetailClient({
                                                product,
                                                breadcrumbs,
                                                galleryItems,
                                                specifications,
                                                features,
                                                description,
                                                defaultColor,
                                                colorMap
                                            }: ProductDetailClientProps) {
    const router = useRouter();
    const waitlistRef = useRef<HTMLDivElement>(null);
    const [addingToCart, setAddingToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const [isFavorited, setIsFavorited] = useState(product.favorited || false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
    const [relatedProducts, setRelatedProducts] = useState<ProductResponse[]>([]);
    const [recentlyViewed, setRecentlyViewed] = useState<ProductResponse[]>([]);

    const { showToast } = useToast();
    const { openAuthModal, isLoggedIn } = useAuth();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    const isProductActive = product.status === 'ACTIVE';
    const getAvailableStock = (sku: ProductSku | null | undefined) => sku ? (sku.stock || 0) - (sku.lockedStock || 0) : 0;
    const currentStock = getAvailableStock(selectedSku); // 获取当前库存

    const isOutOfStock = isProductActive && selectedSku && currentStock <= 0;

    const isLowStock = isProductActive && selectedSku && currentStock > 0 && currentStock < 5;
    // Logic: Can purchase only if active AND has stock
    const canPurchase = isProductActive && selectedSku && currentStock > 0;

    const manualUrl = useMemo(() => {
        const baseTitle = product.title.split('|')[0].trim();
        const slug = baseTitle.toLowerCase().replace(/\s+/g, '-');
        return `/manuals/${slug}-guide.pdf`;
    }, [product.title]);

    const highlightData: HighlightData | null = useMemo(() => {
        if (!product.highlightData) return null;
        try { return JSON.parse(product.highlightData); } catch (e) { return null; }
    }, [product.highlightData]);

    const boxContents: string[] = useMemo(() => {
        if (!product.boxContents) return [];
        try {
            const parsed = JSON.parse(product.boxContents);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }, [product.boxContents]);

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
            setRecentlyViewed(otherViewed.slice(0, 4));
        } catch (e) { console.error(e); }
    }, [product]);

    const getMappedColor = (color: string) => colorMap[color.toLowerCase().trim()] || color;
    const isOnSale = product.originalPrice > product.currentPrice;

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
        if (!isProductActive) {
            showToast('error', 'Unavailable', 'This product is no longer available.');
            return false;
        }
        if (!product || !selectedSku || getAvailableStock(selectedSku) <= 0) return false;
        try {
            await addItemToCart({
                productId: product.id,
                productSlug: product.slug,
                productTitle: product.title,
                productName: product.name,
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

    const handleAddToCart = async () => { setAddingToCart(true); await performAddToCart(); setAddingToCart(false); };
    const handleBuyNow = async () => { setBuyingNow(true); const success = await performAddToCart(); if (success) router.push('/checkout'); setBuyingNow(false); };

    const scrollToWaitlist = () => {
        waitlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const toggleAccordion = (id: string) => setActiveAccordion(activeAccordion === id ? null : id);

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
            stockStatus={isProductActive && (selectedSku ? getAvailableStock(selectedSku) > 0 : true)}
            originalPrice={product.originalPrice}
            currentPrice={product.currentPrice}
            badge={!isProductActive ? 'OFF-SHELF' : product.badge}
            className="absolute top-6 left-6 z-20 scale-110"
        />
    );

    return (
        <div className="w-full">
            <div className="container mx-auto px-4 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={false} />
            </div>

            <div className="container mx-auto px-4 max-w-7xl pb-16 lg:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="w-full">
                        <ProductGallery
                            images={galleryItems}
                            productTitle={product.title}
                            // @ts-ignore
                            badges={galleryBadges}
                        />
                    </div>

                    <div className="flex flex-col h-full justify-center">
                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <div className="flex justify-between items-start gap-4 mb-2">
                                <div className="flex-1 min-w-0 pr-2">{renderDetailTitle(product.title)}</div>
                                <button onClick={handleToggleFavorite} className={`p-3 rounded-full transition-all flex-shrink-0 ${isFavorited ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400 hover:text-red-500'}`}>
                                    <Heart size={24} fill={isFavorited ? "currentColor" : "none"} strokeWidth={isFavorited ? 0 : 2} />
                                </button>
                            </div>

                            {!isProductActive && (
                                <div className="mt-4 mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3 text-gray-500">
                                    <span className="text-sm font-bold uppercase tracking-wider">This item is currently unavailable</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-4">
                                        {isProductActive ? (
                                            isOnSale ? (
                                                <>
                                                    <span className="text-3xl font-bold text-[#E11D48]">${product.currentPrice.toFixed(2)}</span>
                                                    <span className="text-xl text-gray-400 line-through decoration-gray-300">${product.originalPrice.toFixed(2)}</span>
                                                </>
                                            ) : (<span className="text-3xl font-bold text-gray-900">${product.currentPrice.toFixed(2)}</span>)
                                        ) : (
                                            <span className="text-3xl font-bold text-gray-300">Unavailable</span>
                                        )}
                                    </div>
                                    {isOutOfStock && (
                                        <p className="text-[#B22222] font-bold text-sm mt-2 flex items-center gap-2 animate-pulse">
                                            SOLD OUT - RESTOCKING SOON
                                        </p>
                                    )}
                                    {isLowStock && (
                                        <p className="text-[#B22222] font-bold text-sm mt-2 flex items-center gap-2">
                                            Selling Fast - Low Stock
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 self-start mt-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                                    <span className="text-sm text-gray-500 ml-2 font-medium">{product.rating}</span>
                                </div>
                            </div>
                        </div>

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

                        {product.productSkus && product.productSkus.length > 0 && (
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                                    Select Shade: <span className="text-gray-500 font-normal capitalize ml-2">{selectedSku?.color || 'Select'}</span>
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.productSkus.map((sku) => {
                                        const isSelected = selectedSku?.id === sku.id;
                                        // A variant is "Out of stock" if stock <= 0, but we still allow clicking it to see the waitlist form
                                        const stock = getAvailableStock(sku);
                                        const isVariantOutOfStock = stock <= 0;
                                        const colorHex = getMappedColor(sku.color || '');

                                        return (
                                            <button
                                                key={sku.id}
                                                onClick={() => isProductActive && setSelectedSku(sku)}
                                                disabled={!isProductActive}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'} ${!isProductActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer shadow-sm'}`}
                                                style={{ backgroundColor: colorHex === '#FFFFFF' ? '#F3F4F6' : colorHex }}
                                                title={sku.color}
                                            >
                                                {isVariantOutOfStock && isProductActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-full">
                                                        <div className="w-full h-0.5 bg-gray-500 rotate-45"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Purchase Buttons OR Waitlist Form */}
                        {isOutOfStock ? (
                            <div className="mb-10" ref={waitlistRef}>
                                <WaitlistForm skuColor={selectedSku?.color} productTitle={product.title} />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <button
                                    className={`flex-1 py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${!canPurchase ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || buyingNow || !canPurchase}
                                >
                                    {addingToCart ? <Loader2 size={24} className="animate-spin" /> : (
                                        <>
                                            <ShoppingBag size={20} strokeWidth={2} />
                                            {!isProductActive ? 'Off-shelf' : 'Add to Bag'}
                                        </>
                                    )}
                                </button>
                                <button
                                    className={`flex-1 py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-sm border-2 ${!canPurchase ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-black text-black hover:bg-gray-50'}`}
                                    onClick={handleBuyNow}
                                    disabled={addingToCart || buyingNow || !canPurchase}
                                >
                                    {buyingNow ? <Loader2 size={24} className="animate-spin" /> : (
                                        <>
                                            <Zap size={20} strokeWidth={2} />
                                            {!isProductActive ? 'Unavailable' : 'Buy Now'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center py-6 border-t border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Truck size={16} /> Discreet Shipping</span>
                            <span className="flex items-center gap-2"><ShieldCheck size={16} /> Body-Safe</span>
                            <span className="flex items-center gap-2"><Package size={16} /> Plain Box</span>
                        </div>
                    </div>
                </div>
            </div>

            {highlightData && (
                <div className="w-full relative bg-black overflow-hidden group">
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
                    <div className="relative w-full h-[500px] md:h-[700px]">
                        <Image
                            src={getProductImageUrl('', highlightData.image)}
                            alt={highlightData.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            quality={90}
                        />
                    </div>
                    <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start">
                        <div className="container mx-auto px-6 md:px-12">
                            <div className="max-w-xl text-center md:text-left text-white animate-fade-in-up">
                                <span className="inline-block px-3 py-1 mb-6 border border-white/30 rounded-full text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm">
                                    Why You'll Love It
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6 leading-tight drop-shadow-lg">
                                    {highlightData.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed drop-shadow-md">
                                    {highlightData.body}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {boxContents.length > 0 && (
                <div className="w-full bg-[#F9FAFB] py-20 border-y border-gray-100">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-12">
                            <div className="w-full md:w-1/3 flex justify-center">
                                {highlightData?.imageBox ? (
                                    <div className="relative w-full aspect-square max-w-[280px]">
                                        <Image
                                            src={getProductImageUrl('', highlightData.imageBox)}
                                            alt="What's included"
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    </div>
                                ) : (
                                    // 回退到原来的 Box 图标
                                    <div className="text-gray-300">
                                        <Box size={120} strokeWidth={0.5} />
                                    </div>
                                )}
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

            <div className="w-full bg-white py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    {description && (
                        <div className="border-b border-gray-100">
                            <button onClick={() => toggleAccordion('details')} className="w-full flex justify-between items-center py-6 text-left">
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

                    {specifications.length > 0 && (
                        <div className="border-b border-gray-100">
                            <button onClick={() => toggleAccordion('specs')} className="w-full flex justify-between items-center py-6 text-left">
                                <span className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Technical Specifications</span>
                                {activeAccordion === 'specs' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {activeAccordion === 'specs' && (
                                <div className="pb-8 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                        {specifications.map((spec, idx) => {
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

                    <div className="border-b border-gray-100">
                        <button onClick={() => toggleAccordion('manual')} className="w-full flex justify-between items-center py-6 text-left">
                            <span className="text-xl font-bold text-gray-900 font-['Playfair_Display']">User Guide & Manual</span>
                            {activeAccordion === 'manual' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {activeAccordion === 'manual' && (
                            <div className="pb-8 animate-fadeIn">
                                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                    Download the complete guide for usage, charging, and safety instructions.
                                </p>
                                <a
                                    href={manualUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-full text-sm font-bold transition-colors border border-gray-200"
                                >
                                    <FileText size={16} />
                                    View Guide
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-gray-100">
                        <button onClick={() => toggleAccordion('shipping')} className="w-full flex justify-between items-center py-6 text-left">
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

            <div className="w-full bg-white pb-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <FAQSection context="product" />
                </div>
            </div>

            {/* ✅ Unboxing Seeding Section - 高级动效版 */}
            {highlightData?.imageTail && (
                <div className="w-full relative bg-black overflow-hidden mt-12 md:mt-24 min-h-[500px] group">
                    {/* 注入局部 CSS 动画，确保 100% 兼容 */}
                    <style dangerouslySetInnerHTML={{ __html: `
            @keyframes unboxFadeUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes lineGrow {
                from { width: 0; }
                to { width: 48px; }
            }
            .animate-unbox-text { opacity: 0; animation: unboxFadeUp 1s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
            .animate-unbox-line { width: 0; animation: lineGrow 1s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        `}} />

                    <div className="relative w-full h-[500px] md:h-[800px]">
                        <Image
                            src={getProductImageUrl('', highlightData.imageTail)}
                            alt="Unboxing Ritual"
                            fill
                            className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
                            quality={95}
                        />
                        {/* 电影感渐变遮罩 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
                    </div>

                    <div className="absolute inset-0 z-20 flex items-center">
                        <div className="container mx-auto px-6 md:px-12 lg:px-20">
                            <div className="max-w-2xl text-left text-white">

                                {/* 1. 顶部小标 - 最先浮现 */}
                                <div className="flex items-center gap-3 mb-8 animate-unbox-text" style={{ animationDelay: '0.2s' }}>
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-white/80">
                            The Unboxing Experience
                        </span>
                                    <div className="h-[1px] bg-white/40 animate-unbox-line" style={{ animationDelay: '0.8s' }} />
                                </div>

                                {/* 2. 主标题 - 延迟 0.4s 浮现 */}
                                <h2 className="text-5xl md:text-8xl font-bold font-['Playfair_Display'] mb-8 leading-[1.05] drop-shadow-2xl animate-unbox-text"
                                    style={{ animationDelay: '0.4s' }}>
                                    Elevate Your <br className="hidden md:block" />
                                    Intimate Rituals
                                </h2>

                                {/* 3. 副标题 - 延迟 0.6s 浮现 */}
                                <div className="animate-unbox-text" style={{ animationDelay: '0.6s' }}>
                                    <p className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed tracking-wide max-w-lg">
                                        Beautifully packaged. Thoughtfully designed.
                                    </p>
                                    <p className="mt-2 text-xl md:text-3xl font-medium text-white/90 italic font-['Playfair_Display']">
                                        Ready for you.
                                    </p>
                                </div>

                                {/* 4. 底部装饰 (可选) - 增加呼吸感 */}
                                <div className="mt-12 opacity-40 animate-unbox-text" style={{ animationDelay: '1s' }}>
                                    <div className="w-px h-16 bg-gradient-to-b from-white to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ProductReviews productId={product.id} />

            {/* Mobile Sticky Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center gap-3 safe-area-pb" style={{ zIndex: Z_INDEX.STICKY }}>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
                    <p className={`text-xs font-bold ${isProductActive && !isOutOfStock ? 'text-[#E11D48]' : 'text-gray-400'}`}>
                        {!isProductActive
                            ? 'Unavailable'
                            : isOutOfStock
                                ? 'Sold Out'
                                : `$${product.currentPrice}`
                        }
                    </p>
                </div>
                {/*
                    Mobile Logic:
                    - If OOS (Active but 0 stock): Button says "Notify Me" and scrolls to form.
                    - If Active & Stock: Normal Add to Bag.
                    - If Inactive: Off-shelf disabled.
                */}
                <button
                    className={`h-11 px-8 rounded-full font-bold text-sm transition-all shadow-md whitespace-nowrap flex-shrink-0 flex items-center justify-center ${
                        isOutOfStock
                            ? 'bg-black text-white hover:bg-gray-800' // Notify button style
                            : !canPurchase
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                    }`}
                    onClick={() => {
                        if (isOutOfStock) {
                            scrollToWaitlist();
                        } else {
                            handleAddToCart();
                        }
                    }}
                    disabled={addingToCart || (!canPurchase && !isOutOfStock)}
                >
                    {addingToCart ? <Loader2 size={18} className="animate-spin" /> : (
                        !isProductActive
                            ? 'Off-shelf'
                            : isOutOfStock
                            ? 'Notify Me'
                            : 'Add to Bag'
                    )}
                </button>
            </div>

            <div className="mt-8">
                {relatedProducts.length > 0 && <ProductCarousel title="You May Also Like" products={relatedProducts} />}
                {recentlyViewed.length > 0 && <ProductCarousel title="Recently Viewed" products={recentlyViewed} />}
            </div>
        </div>
    );
}