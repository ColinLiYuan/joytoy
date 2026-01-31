// app/order-confirmation/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Mail, ShoppingBag, CreditCard, Gift } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderNumber = searchParams.get('orderNumber');

    // 判断是否是免费订单（通过URL参数或订单金额）
    const isFreeOrder = searchParams.get('free_order') === 'true';

    // 从 LocalStorage 获取刚才下单的临时信息
    const [orderInfo, setOrderInfo] = useState<{
        orderNumber?: string;
        totalAmount?: number;
        guestEmail?: string;
        discountAmount?: number;
        shippingFee?: number;
    } | null>(null);

    useEffect(() => {
        // 1. 清空购物车 UI
        useCartStore.getState().clearCart();

        // 2. 读取临时订单信息
        const storedOrder = localStorage.getItem('currentOrder');
        const freeOrderInfo = localStorage.getItem('freeOrderInfo');

        if (storedOrder) {
            try {
                const parsed = JSON.parse(storedOrder);
                // 简单的校验，确保是刚刚那个订单
                if (String(parsed.orderNumber) === String(orderNumber)) {
                    setOrderInfo(parsed);
                }
            } catch (e) {}
        } else if (freeOrderInfo) {
            try {
                const parsed = JSON.parse(freeOrderInfo);
                if (String(parsed.orderNumber) === String(orderNumber)) {
                    setOrderInfo(parsed);
                }
            } catch (e) {}
        }

        // 清理 localStorage
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('freeOrderInfo');
    }, [orderNumber]);

    if (!orderNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Invalid Request</p>
            </div>
        );
    }

    // 判断是否真的是免费订单
    const actualIsFreeOrder = isFreeOrder || (orderInfo?.totalAmount === 0);

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-xl mx-auto">
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Header - 根据是否免费订单显示不同图标 */}
                    <div className="bg-black p-10 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 to-black opacity-50"></div>
                        <div className="relative z-10">
                            <div className={`w-20 h-20 ${actualIsFreeOrder ? 'bg-purple-500 shadow-purple-500/30' : 'bg-green-500 shadow-green-500/30'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                {actualIsFreeOrder ? (
                                    <Gift size={40} className="text-white" />
                                ) : (
                                    <CheckCircle2 size={40} className="text-white" />
                                )}
                            </div>
                            <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2">
                                {actualIsFreeOrder ? 'Free Order Confirmed!' : 'Order Confirmed!'}
                            </h1>
                            <p className="text-gray-400">
                                {actualIsFreeOrder ? 'You got it for free!' : 'Thank you for your purchase.'}
                            </p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 md:p-10 space-y-8">

                        <div className="text-center space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</p>
                            <p className="text-2xl font-mono font-bold text-gray-900">
                                {orderInfo?.orderNumber || orderNumber}
                            </p>

                            {/* 显示订单金额 */}
                            <div className="mt-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                                <p className={`text-2xl font-bold ${actualIsFreeOrder ? 'text-purple-600' : 'text-gray-900'}`}>
                                    ${actualIsFreeOrder ? '0.00' : (orderInfo?.totalAmount?.toFixed(2) || '0.00')}
                                </p>
                                {actualIsFreeOrder && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        (100% discount applied)
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Info Box - 根据是否免费订单显示不同信息 */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                            {actualIsFreeOrder ? (
                                // 免费订单的特殊提示
                                <div className="flex items-start gap-4">
                                    <Gift className="text-purple-400 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">🎁 Free Product Order</h4>
                                        <p className="text-gray-500 text-sm mt-1">
                                            This order was processed as a complimentary gift. No payment was required.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // 正常支付订单的提示
                                <div className="flex items-start gap-4">
                                    <CreditCard className="text-gray-400 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Payment Successful</h4>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Your payment has been processed successfully.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <Package className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Shipping Update</h4>
                                    <p className="text-gray-500 text-sm mt-1">
                                        You will receive a tracking number as soon as your package ships (usually within 24 hours).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    const query = new URLSearchParams({
                                        orderNumber: (orderInfo?.orderNumber || orderNumber || '').replace(/^#/, ''),
                                        email: orderInfo?.guestEmail || ''
                                    }).toString();
                                    router.push(`/pages/order-tracking?${query}`);
                                }}
                                className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-xl font-bold hover:border-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                Track Order Status
                            </button>

                            <Link
                                href="/collections/all"
                                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-[#E11D48] transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                Continue Shopping <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Help */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Need help? <a href="mailto:support@mythtoy.com" className="underline hover:text-black">Contact Support</a></p>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <ConfirmationContent />
        </Suspense>
    );
}