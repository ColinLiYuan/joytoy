// components/common/add-to-cart-discount-popup.tsx
'use client';

// 加购成功后弹出的优惠码弹窗（与 footer 的 Get 15% Off 订阅框同款逻辑）：
// 用户填邮箱订阅 -> 邮箱登记到后端（newsletter_subscriber）并保存到购物车（cart.customer_email）
// -> 展示 MYTH15 优惠码（结算时手动使用，不自动应用到购物车）
// 展示门槛与 discount-popup 一致：登录用户 / 联盟用户 / 已订阅(永久抑制) / 3天内已展示 均不弹

import { useState, useEffect } from 'react';
import { X, Gift, Mail, CheckCircle2, Loader2, Copy } from 'lucide-react';
import { Z_INDEX } from '@/lib/constants/z-index';
import { useToast } from '@/contexts/toastContext';
import { subscribeToNewsletter } from '@/app/actions/email';
import { saveCustomerEmailToCart } from '@/app/actions/cart';
import { useAuth } from '@/contexts/authContext';
import { affiliateService } from '@/services/affiliateService';
import { useCartStore } from '@/stores/useCartStore';

const POPUP_COOKIE_NAME = 'discount_popup_shown';
const POPUP_SUPPRESS_FOREVER = 'discount_popup_suppress_forever';
const DISCOUNT_CODE = 'MYTH15';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export default function AddToCartDiscountPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null);
    const { showToast } = useToast();
    const { userInfo, isClient } = useAuth();
    const discountPopupRequest = useCartStore(state => state.discountPopupRequest);
    const clearDiscountPopupRequest = useCartStore(state => state.clearDiscountPopupRequest);
    const getCart = useCartStore(state => state.getCart);

    // ✅ 加购成功后触发（一次性事件，消费后立即清除）
    useEffect(() => {
        if (!discountPopupRequest) return;
        clearDiscountPopupRequest();

        if (!isClient) return;

        // 1. 已登录用户不弹
        if (userInfo) return;

        // 2. 已订阅 / 永久抑制不弹
        if (localStorage.getItem(POPUP_SUPPRESS_FOREVER) === 'true') return;

        // 3. 3 天内已展示过不弹
        const lastShown = localStorage.getItem(POPUP_COOKIE_NAME);
        if (lastShown) {
            const diff = Date.now() - parseInt(lastShown, 10);
            if (!isNaN(diff) && diff < THREE_DAYS_MS) return;
        }

        // 4. 联盟用户不弹（URL 参数或 Cookie）
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('aff') || affiliateService.getTrackingData() !== null) return;

        setIsOpen(true);
        localStorage.setItem(POPUP_COOKIE_NAME, Date.now().toString());
    }, [discountPopupRequest, clearDiscountPopupRequest, isClient, userInfo]);

    const handleClose = () => setIsOpen(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            showToast('error', 'Error', 'Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('email', email);

            const result = await subscribeToNewsletter(formData, 'ADD_TO_CART_POPUP');

            if (result.success) {
                const code = result.code || DISCOUNT_CODE;
                setSuccessCode(code);
                // 订阅成功后永久不再展示（与 discount-popup 共用抑制标记）
                localStorage.setItem(POPUP_SUPPRESS_FOREVER, 'true');

                // ✅ 把邮箱保存到后端购物车（cart.customer_email），供管理端识别游客；
                // 不应用优惠券 —— 优惠码由用户在结算页手动使用
                try {
                    await saveCustomerEmailToCart(email);
                    await getCart().catch(err => console.warn('Refresh cart failed:', err));
                    showToast('success', 'Welcome!', 'Your discount code is unlocked — use it at checkout.');
                } catch (saveError) {
                    console.warn('Save customer email to cart failed:', saveError);
                    showToast('warning', 'Code Unlocked', 'Use this code at checkout.');
                }
            } else {
                showToast('error', 'Error', result.error || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Subscribe error:', error);
            showToast('error', 'Error', 'Failed to subscribe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (successCode) {
            navigator.clipboard.writeText(successCode);
            showToast('success', 'Copied!', 'Code copied to clipboard');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                style={{ zIndex: Z_INDEX.MODAL - 1 }}
                onClick={handleClose}
            />

            {/* Modal（深色 + 金色，与 footer 订阅框风格一致） */}
            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                <div className="bg-[#0A0A0A] border border-[#C5A059]/30 rounded-3xl shadow-2xl overflow-hidden relative text-white">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>

                    <div className="p-8">
                        {successCode ? (
                            // Success State
                            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                                <div className="w-16 h-16 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-[#C5A059]" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">You're In!</h3>
                                <p className="text-gray-400 mb-6">Here's your exclusive discount code:</p>

                                <div
                                    className="flex items-center justify-between bg-white/5 border border-[#C5A059]/50 border-dashed rounded-xl p-4 cursor-pointer group hover:border-[#C5A059] transition-colors mb-4"
                                    onClick={handleCopyCode}
                                >
                                    <span className="text-2xl font-bold text-[#C5A059] tracking-widest">{successCode}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white font-medium">
                                        <Copy size={14} /> Copy
                                    </span>
                                </div>

                                <p className="text-sm text-gray-400">
                                    Get <span className="font-bold text-[#C5A059]">15% OFF</span> at checkout
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Code also sent to your email.</p>

                                <button
                                    onClick={handleClose}
                                    className="mt-6 w-full bg-white text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#C5A059] hover:text-white text-sm"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            // Default State（footer 订阅框风格）
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="text-[#C5A059]" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Get 15% Off</h2>
                                    <p className="text-gray-400 text-sm">
                                        Nice choice! Subscribe to unlock your exclusive discount code — use it at checkout.
                                    </p>
                                </div>

                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white rounded-xl outline-none focus:border-[#C5A059] focus:bg-white/10 transition-all placeholder:text-gray-600"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl text-base hover:bg-[#C5A059] hover:text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            'Unlock My Discount'
                                        )}
                                    </button>
                                </form>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    No spam, unsubscribe anytime. We respect your privacy.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
