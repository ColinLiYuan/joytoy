'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2, ShieldCheck, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { COUNTRY_DATA } from '@/lib/constants/country-data';
import { useCartStore } from '@/stores/useCartStore';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawOrderNumber = searchParams.get('orderNumber');
    const orderNumber = rawOrderNumber ? rawOrderNumber.replace(/^#/, '') : null;

    const { clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    useEffect(() => {
        if (!isMounted) return;
        const fetchOrder = async () => {
            if (!orderNumber) return;
            try {
                const data = await orderService.getOrder(orderNumber);
                if (data) setOrderData(data);
            } catch (error) {
                setErrorMessage('Failed to load order');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber, isMounted]);

    const isoCountryCode = useMemo(() => {
        if (!orderData?.shippingAddress?.country) return 'US';
        const country = orderData.shippingAddress.country;
        // PayPal 只接受 2 位代码 (如 "US")，不接受 "United States"
        return country.length === 2 ? country : (COUNTRY_DATA[country] || 'US');
    }, [orderData]);

    const createPayPalOrder = (data: any, actions: any) => {
        const addr = orderData.shippingAddress;
        const finalAmount = Number(orderData.finalAmount).toFixed(2);
        const shippingValue = Number(orderData.shippingFee).toFixed(2);
        const discountValue = Number(orderData.discountAmount).toFixed(2);
        const itemTotal = (Number(orderData.finalAmount) - Number(orderData.shippingFee) + Number(orderData.discountAmount)).toFixed(2);

        return actions.order.create({
            // 💡 这里的 payer 对象负责把地址带入信用卡表单
            payer: {
                name: {
                    given_name: addr.firstName,
                    surname: addr.lastName
                },
                email_address: orderData.guestEmail || addr.email,
                address: {
                    address_line_1: addr.addressLine1,
                    address_line_2: addr.addressLine2 || "",
                    admin_area_2: addr.city,           // 城市
                    admin_area_1: addr.province,       // 州/省
                    postal_code: addr.zipCode,
                    country_code: isoCountryCode      // 必须是 2 位代码
                }
            },
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: finalAmount,
                    breakdown: {
                        item_total: { currency_code: "USD", value: itemTotal },
                        shipping: { currency_code: "USD", value: shippingValue },
                        discount: { currency_code: "USD", value: discountValue }
                    }
                },
                shipping: {
                    name: { full_name: `${addr.firstName} ${addr.lastName}` },
                    address: {
                        address_line_1: addr.addressLine1,
                        address_line_2: addr.addressLine2 || "",
                        admin_area_2: addr.city,
                        admin_area_1: addr.province,
                        postal_code: addr.zipCode,
                        country_code: isoCountryCode
                    }
                }
            }],
            application_context: {
                shipping_preference: "SET_PROVIDED_ADDRESS", // 强制使用提供的地址
                user_action: "PAY_NOW"
            }
        });
    };

    if (!isMounted || isLoading || !orderData) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-10 flex flex-col items-center">
            {/* 顶部安全条 */}
            <div className="mb-6 w-full max-w-[480px] px-4">
                <div className="bg-white border border-gray-100 rounded-full py-3 shadow-sm flex items-center justify-center gap-2">
                    <Lock size={14} className="text-slate-300" />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        256-bit SSL Encrypted & Discreet Billing
                    </span>
                </div>
            </div>

            <div className="w-full max-w-[500px] px-4">
                <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
                    {/* 金额展示 */}
                    <div className="p-10 text-center">
                        <span className="text-[13px] font-bold text-slate-300 uppercase tracking-widest block mb-3">Total Amount</span>
                        <div className="text-[52px] font-black text-[#1a1c3d] leading-none mb-3 tracking-tighter">
                            ${Number(orderData.finalAmount).toFixed(2)}
                        </div>
                        <div className="text-[12px] text-slate-400 font-medium">Order: #{orderData.orderNumber}</div>
                    </div>

                    <div className="px-10 pb-12">
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-2xl flex items-center gap-2">
                                <AlertCircle size={14} /> {errorMessage}
                            </div>
                        )}

                        <div className="space-y-4">
                            <PayPalScriptProvider options={{
                                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                                currency: "USD",
                                "disable-funding": "paylater,venmo"
                            }}>
                                <PayPalButtons
                                    style={{ layout: "vertical", shape: "rect", height: 55 }}
                                    createOrder={createPayPalOrder}
                                    onApprove={async (data, actions) => {
                                        const details = await actions.order?.capture();
                                        await orderService.payOrder(orderNumber!, {
                                            transactionId: details.id,
                                            paymentMethod: 'PAYPAL',
                                            currency: 'USD'
                                        });
                                        clearCart();
                                        router.push(`/order-confirmation?orderNumber=${orderNumber}`);
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>

                        {/* 底部导航 */}
                        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-8">
                            <button onClick={() => router.back()} className="text-[13px] text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors font-semibold">
                                <ChevronLeft size={16} /> Back to order details
                            </button>

                            {/* 图标区域 - 恢复彩色 */}
                            <div className="flex items-center justify-center gap-5">
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat/visa.svg" className="h-5" alt="Visa" />
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat/mastercard.svg" className="h-7" alt="Mastercard" />
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat/amex.svg" className="h-6" alt="Amex" />
                                <img src="https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/master/flat/discover.svg" className="h-5" alt="Discover" />
                                <ShieldCheck size={20} className="text-slate-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 px-10 max-w-[450px] text-center">
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Your financial information is encrypted. We do not store your card details.
                    Charges will appear discreetly on your statement.
                </p>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={null}>
            <PaymentContent />
        </Suspense>
    );
}