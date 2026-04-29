'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Z_INDEX } from '@/lib/constants/z-index';
import { useToast } from '@/contexts/toastContext';
import { subscribeToNewsletter } from '@/app/actions/email';
import { useAuth } from '@/contexts/authContext';
import { affiliateService } from '@/services/affiliateService';
import { usePathname } from 'next/navigation';

export default function DiscountPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null);
    const { showToast } = useToast();
    const { userInfo } = useAuth();
    const pathname = usePathname();

    const POPUP_COOKIE_NAME = 'discount_popup_shown';
    const POPUP_SUPPRESS_FOREVER = 'discount_popup_suppress_forever';
    const DISCOUNT_CODE = 'MYTH15';

    // 检查是否应该显示弹窗
    useEffect(() => {
        console.log('[DiscountPopup] Checking if should show popup...');
        
        // 1. 博客页面不弹框
        if (pathname?.startsWith('/blog')) {
            console.log('[DiscountPopup] Skipped: Blog page');
            return;
        }

        // 2. 联盟用户不弹框 (检查 URL 参数或 Cookie)
        const urlParams = new URLSearchParams(window.location.search);
        const hasAffiliateParam = urlParams.has('aff');
        const affiliateData = affiliateService.getTrackingData();
        const hasAffiliateCookie = affiliateData !== null;
        
        console.log('[DiscountPopup] Affiliate check:', { 
            hasAffiliateParam, 
            hasAffiliateCookie,
            affiliateData 
        });
        
        if (hasAffiliateParam || hasAffiliateCookie) {
            console.log('[DiscountPopup] Skipped: Affiliate user');
            return;
        }

        // 3. 已登录用户永久不弹框
        if (userInfo) {
            console.log('[DiscountPopup] User logged in, setting suppress forever');
            localStorage.setItem(POPUP_SUPPRESS_FOREVER, 'true');
            return;
        }

        // 4. 检查是否永久抑制
        const isSuppressedForever = localStorage.getItem(POPUP_SUPPRESS_FOREVER);
        if (isSuppressedForever === 'true') {
            console.log('[DiscountPopup] Skipped: Suppressed forever');
            return;
        }

        // 5. 检查3天内是否已显示过
        const lastShown = localStorage.getItem(POPUP_COOKIE_NAME);
        if (lastShown) {
            const lastShownTime = parseInt(lastShown, 10);
            const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
            const now = Date.now();
            const timeDiff = now - lastShownTime;
            
            console.log('[DiscountPopup] Last shown:', new Date(lastShownTime).toLocaleString());
            console.log('[DiscountPopup] Time diff:', Math.round(timeDiff / (1000 * 60 * 60)), 'hours ago');
            
            if (timeDiff < threeDaysInMs) {
                console.log('[DiscountPopup] Skipped: Shown within 3 days');
                return; // 3天内已显示过，不再显示
            }
        }

        console.log('[DiscountPopup] Will show popup in 2 seconds...');
        // 延迟2秒后显示弹窗，提升用户体验
        const timer = setTimeout(() => {
            console.log('[DiscountPopup] Showing popup now!');
            setIsOpen(true);
            // 记录显示时间
            localStorage.setItem(POPUP_COOKIE_NAME, Date.now().toString());
            console.log('[DiscountPopup] Set discount_popup_shown to:', Date.now());
        }, 2000);

        return () => clearTimeout(timer);
    }, [pathname, userInfo]);

    const handleClose = () => {
        setIsOpen(false);
    };

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
            
            const result = await subscribeToNewsletter(formData);

            if (result.success) {
                setSuccessCode(result.code || DISCOUNT_CODE);
                showToast('success', 'Welcome!', 'Discount code unlocked!');
                // 订阅成功后永久不再显示
                localStorage.setItem(POPUP_SUPPRESS_FOREVER, 'true');
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                style={{ zIndex: Z_INDEX.MODAL - 1 }}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    {/* Content */}
                    <div className="p-8">
                        {successCode ? (
                            // Success State
                            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">You're In!</h3>
                                <p className="text-gray-600 mb-6">Here's your exclusive discount code:</p>

                                <div
                                    className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-indigo-500 rounded-xl p-4 cursor-pointer group hover:border-indigo-600 transition-colors mb-4"
                                    onClick={handleCopyCode}
                                >
                                    <span className="text-2xl font-bold text-indigo-600 tracking-widest">{successCode}</span>
                                    <span className="text-xs text-gray-500 group-hover:text-indigo-600 font-medium">Click to Copy</span>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Use this code at checkout for <span className="font-bold text-indigo-600">15% OFF</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">Code also sent to your email.</p>
                            </div>
                        ) : (
                            // Default State
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Gift className="text-indigo-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Get 15% Off</h2>
                                    <p className="text-gray-600">
                                        Subscribe to our newsletter and unlock your exclusive discount code!
                                    </p>
                                </div>

                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition-all"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
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
