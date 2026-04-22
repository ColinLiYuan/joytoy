// components/cart/cart.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useToast } from '@/contexts/toastContext';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { productService } from '@/services/productService';
import { ProductResponse } from '@/types/product';
import { Z_INDEX } from '@/lib/constants/z-index';
import { colorMap } from '@/lib/constants/color-map';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { X, ShoppingBag, Plus, Minus, Loader2, Trash2, ArrowRight, Sparkles, Truck } from 'lucide-react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 49;

const truncateText = (text: string, maxLength: number = 30): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export default function Cart({ isOpen, onClose }: CartProps) {
    const { cart, totalItems, getCart, updateItemQuantity, removeItemFromCart, addItemToCart } = useCartStore();
    const { showToast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn } = useAuth();

    // UI States
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [addingAddOnId, setAddingAddOnId] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Data States for Upsell
    const [upsellProducts, setUpsellProducts] = useState<ProductResponse[]>([]);
    const [upsellTitle, setUpsellTitle] = useState('');
    const [upsellLoading, setUpsellLoading] = useState(false);

    // 1. 初始化 & 挂载
    useEffect(() => {
        setIsMounted(true);
        // ✅ 购物车组件挂载时不再主动获取，由 navigation.tsx 统一处理
        // 这里只负责显示loading状态
        if (isOpen && isLoggedIn) {
            setIsInitialLoading(false);  // 数据应该已经从 navigation 获取了
        }
    }, [isOpen, isLoggedIn]);

    // 2. 路由变化自动关闭
    useEffect(() => {
        if (isOpen) {
            onClose();
            setIsCheckingOut(false);
        }
    }, [pathname]);

    // 3. ✅ 修复：前端实时计算总金额 (解决后端同步延迟问题)
    const subtotal = useMemo(() => {
        if (!cart?.items) return 0;
        return cart.items.reduce((t, i) => t + (i.unitPrice * i.quantity), 0);
    }, [cart?.items]);

    // 4. ✅ 智能推荐逻辑 (Smart Upsell Logic)
    useEffect(() => {
        // 如果没打开，或者没登录，或者购物车为空，不加载推荐
        if (!isOpen || !cart?.items || cart.items.length === 0) return;

        const fetchSmartUpsells = async () => {
            setUpsellLoading(true);
            try {
                let products: ProductResponse[] = [];

                // 处理浮点数精度
                const currentTotal = parseFloat(subtotal.toFixed(2));

                // === 场景 1: 未满 $49 (凑单模式) ===
                if (currentTotal < FREE_SHIPPING_THRESHOLD) {
                    const gap = FREE_SHIPPING_THRESHOLD - currentTotal;
                    setUpsellTitle(`Complete Your Routine`);

                    // 获取低价凑单品
                    products = await productService.getAddOnProducts(8);
                }

                // === 场景 2: 已满 $49 (体验升级模式) ===
                else {
                    setUpsellTitle("Complete Your Experience");

                    // A. 找出购物车里最贵的商品
                    const maxPriceItem = [...cart.items].sort((a, b) => b.unitPrice - a.unitPrice)[0];
                    // console.log('maxPriceItem : ', maxPriceItem)

                    // B. 尝试获取该商品的关联推荐 (需要 productSlug)
                    if (maxPriceItem && (maxPriceItem as any).productSlug) {
                        products = await productService.getRelatedProducts((maxPriceItem as any).productSlug);
                    }

                    // C. 兜底：如果没关联品，还是展示 Add-ons
                    if (!products || products.length === 0) {
                        products = await productService.getAddOnProducts(8);
                    }
                }

                setUpsellProducts(products);

            } catch (error) {
                console.error("Failed to load upsells", error);
            } finally {
                setUpsellLoading(false);
            }
        };

        // 简单的防抖，避免频繁请求
        const timer = setTimeout(fetchSmartUpsells, 300);
        return () => clearTimeout(timer);

    }, [isOpen, isLoggedIn, subtotal, cart?.items?.length]);

    // 5. 过滤掉已经在购物车里的商品
    const filteredUpsells = useMemo(() => {
        if (!upsellProducts.length) return [];
        const cartProductIds = new Set(cart?.items?.map(item => item.productId.toString()) || []);
        return upsellProducts.filter(p => !cartProductIds.has(p.id.toString()));
    }, [upsellProducts, cart?.items]);


    // --- Actions ---

    const handleAddAddOn = async (product: ProductResponse) => {
        // 默认选择第一个有库存的 SKU
        const defaultSku = product.productSkus?.find(s => (s.stock || 0) > 0) || product.productSkus?.[0];

        if (!defaultSku) {
            showToast('error', 'Out of Stock', 'This item is currently unavailable.');
            return;
        }
        // console.log('handleAddAddOn product : ', product)

        setAddingAddOnId(product.id.toString());
        try {
            await addItemToCart({
                productId: product.id,
                productSlug: product.slug,
                productTitle: product.title,
                productName: product.name,
                productSku: defaultSku.sku,
                productImage: getProductImageUrl('', product.image),
                unitPrice: product.currentPrice,
                quantity: 1,
                color: defaultSku.color === '__generic__' ? 'Default' : defaultSku.color,
                skuId: defaultSku.id
            });
            // showToast('success', 'Added', 'Item added to bag');
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to add item');
        } finally {
            setAddingAddOnId(null);
        }
    };

    const handleIncreaseQuantity = async (itemId: number, currentQuantity: number) => {
        setIsUpdating(itemId);
        try { await updateItemQuantity(itemId, currentQuantity + 1); } catch { } finally { setIsUpdating(null); }
    };

    const handleDecreaseQuantity = async (itemId: number, currentQuantity: number) => {
        if (currentQuantity <= 1) return;
        setIsUpdating(itemId);
        try { await updateItemQuantity(itemId, currentQuantity - 1); } catch { } finally { setIsUpdating(null); }
    };

    const handleRemoveItem = async (itemId: number) => {
        setIsUpdating(itemId);
        try { await removeItemFromCart(itemId); } catch { } finally { setIsUpdating(null); }
    };

    const handleCheckout = () => {
        if (!cart?.items || cart.items.length === 0) {
            showToast('warning', 'Empty', 'Cart is empty');
            return;
        }
        setIsCheckingOut(true);
        router.push('/checkout');
    };

    // --- Helpers ---
    const getColorValue = (n: string) => colorMap[n.toLowerCase().trim()] || '#CCCCCC';
    const formatColorDisplay = (color: string | undefined) => {
        if (!color) return null;
        const bgStyle = color.startsWith('#') ? color : getColorValue(color);
        const borderStyle = bgStyle.toLowerCase() === '#ffffff' ? '1px solid #e5e7eb' : 'none';
        return (<div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full inline-block shadow-sm" style={{ backgroundColor: bgStyle, border: borderStyle }} /><span className="text-gray-400 text-xs capitalize">{color}</span></div>);
    };

    if (!isMounted) return null;
    const hasCartItems = cart?.items && cart.items.length > 0;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-2xl flex flex-col 
                    transition-transform duration-300 ease-out
                    w-full sm:w-[450px]
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    ${isOpen ? 'visible' : 'invisible'}
                `}
                style={{ zIndex: Z_INDEX.DRAWER }}
            >
                {/* Header  */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white z-10 relative shadow-sm">
                    <h3 className="text-gray-900 font-bold text-xl font-['Playfair_Display'] m-0 flex items-center gap-2">
                        Bag <span className="text-sm font-sans font-normal text-gray-500">({totalItems})</span>
                        {isInitialLoading && <Loader2 className="animate-spin text-gray-400 w-4 h-4" />}
                    </h3>
                    <button className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500" onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* Free Shipping Progress (Sticky top under header) */}
                {hasCartItems && (
                    <div className="px-6 py-4 bg-white border-b border-gray-50">
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                            <p className="text-xs font-bold text-emerald-700 flex items-center gap-2 animate-in fade-in">
                                <Truck size={14} /> You've unlocked Free Express Shipping!
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500">
                                    You are <span className="text-black font-bold">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</span> away from Free Shipping
                                </p>
                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${(subtotal / FREE_SHIPPING_THRESHOLD) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Cart Items List (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-white">
                    {!isInitialLoading && !hasCartItems && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-gray-300" /></div>
                            <div>
                                <h4 className="text-base font-bold text-gray-900">Your bag is empty</h4>
                                <p className="text-xs text-gray-400 mt-1">Start filling it with pleasure.</p>
                            </div>
                            <button className="px-8 py-3 bg-black text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#E11D48] transition-colors" onClick={onClose}>Shop Now</button>
                        </div>
                    )}

                    {hasCartItems && (
                        <div className="flex flex-col gap-8 pb-4">
                            {cart.items.map(item => (
                                <div key={item.itemId} className="flex gap-5 group animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="relative w-20 h-24 flex-shrink-0 border border-gray-100 rounded-sm overflow-hidden bg-[#F9FAFB]">
                                        {item.productImage && <Image src={getProductImageUrl('', item.productImage)} alt={item.productTitle} fill className="object-cover mix-blend-multiply" />}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start gap-3">
                                                <h4
                                                    className="font-medium text-sm text-gray-900 line-clamp-2 leading-relaxed cursor-pointer hover:text-[#E11D48] transition-colors"
                                                    onClick={() => {
                                                        if (item.productId) {
                                                            router.push(`/toys${item.productSlug}`);
                                                            onClose();
                                                        }
                                                    }}
                                                >
                                                    {item.productTitle}
                                                </h4>
                                                <button className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0 transition-colors" onClick={() => handleRemoveItem(item.itemId)} disabled={isUpdating === item.itemId}>
                                                    {isUpdating === item.itemId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {item.color && formatColorDisplay(item.color)}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center border border-gray-200 rounded-sm h-7 w-20">
                                                <button onClick={() => handleDecreaseQuantity(item.itemId, item.quantity)} className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"><Minus size={10} /></button>
                                                <span className="flex-1 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                                                <button onClick={() => handleIncreaseQuantity(item.itemId, item.quantity)} className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"><Plus size={10} /></button>
                                            </div>
                                            <p className="font-bold text-sm text-gray-900">${item.unitPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section: Upsell + Checkout (Fixed at bottom) */}
                {hasCartItems && (
                    <div className="border-t border-gray-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 relative">

                        {/* ✅ In-Cart Upsell Carousel */}
                        {filteredUpsells.length > 0 && !upsellLoading && (
                            <div className="pt-5 pb-2 pl-6 bg-white">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles size={12} className="text-[#E11D48] fill-[#E11D48]" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">{upsellTitle}</span>
                                </div>

                                <div className="flex gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide snap-x">
                                    {filteredUpsells.map((addon) => (
                                        <div key={addon.id} className="flex-shrink-0 w-[200px] flex gap-3 items-center snap-start group cursor-pointer">
                                            {/* Mini Image (No Border, Light BG) */}
                                            <div className="relative w-14 h-14 bg-[#F5F5F7] rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={getProductImageUrl('', addon.image)}
                                                    alt={addon.title}
                                                    fill
                                                    className="object-cover mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
                                                />
                                            </div>

                                            {/* Info & Add Btn */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-900 truncate mb-1 leading-tight group-hover:text-[#E11D48] transition-colors">{addon.title}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-500">${addon.currentPrice}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAddAddOn(addon);
                                                        }}
                                                        disabled={addingAddOnId === addon.id.toString()}
                                                        className="h-6 px-3 rounded-full border border-gray-200 text-[10px] font-bold uppercase text-gray-900 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center"
                                                    >
                                                        {addingAddOnId === addon.id.toString() ? <Loader2 size={10} className="animate-spin" /> : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Subtotal & Checkout Button */}
                        <div className="px-6 pb-8 pt-4 bg-white safe-area-pb border-t border-gray-50">
                            <div className="flex justify-between text-base font-bold mb-2 text-gray-900">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-5 text-center">Shipping & taxes calculated at checkout.</p>

                            <button
                                className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-[#E11D48] transition-all shadow-lg hover:shadow-[#E11D48]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs uppercase tracking-[0.15em] active:scale-[0.99]"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Checkout <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}