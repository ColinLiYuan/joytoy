// app/(site)/payment/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/authContext';
import { COUNTRY_DATA } from '@/lib/constants/country-data';
import { useCartStore } from '@/stores/useCartStore';
import { sendOrderConfirmationEmail } from '@/app/actions/send-order-email';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ 统一参数处理：去 #
    const rawOrderNumber = searchParams.get('orderNumber');
    const orderNumber = rawOrderNumber ? rawOrderNumber.replace(/^#/, '') : null;

    const { isLoggedIn } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const { clearCart } = useCartStore();

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const fetchOrder = async () => {
            if (!clientId) {
                setErrorMessage("Configuration Error: PayPal Client ID missing");
                setIsLoading(false);
                return;
            }
            if (!orderNumber) {
                setErrorMessage('Order number is missing');
                setIsLoading(false);
                return;
            }

            try {
                // 1. 尝试从 LocalStorage 获取
                const storedOrder = localStorage.getItem('currentOrder');
                if (storedOrder) {
                    try {
                        const parsed = JSON.parse(storedOrder);
                        const storedNumber = String(parsed.orderNumber).replace(/^#/, '');

                        if (storedNumber === orderNumber) {
                            setOrderData(parsed);
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        console.error('LS parse error', e);
                    }
                }

                // 2. LocalStorage 没命中，尝试 API (游客可能失败)
                const data = await orderService.getOrder(orderNumber);
                if (data) {
                    setOrderData(data);
                } else {
                    throw new Error('Order not found');
                }

            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderNumber, clientId, isMounted]);

    const createPayPalOrder = (data: any, actions: any) => {
        if (!orderData) return Promise.reject("Order data missing");

        const shippingAddr = orderData.shippingAddress;
        if (!shippingAddr) {
            setErrorMessage("Shipping address missing. Please go back.");
            return Promise.reject("Shipping address missing");
        }

        // ✅ 2. 国家代码转换 (PayPal 必须用 ISO 2位码)
        // 逻辑：如果本身就是2位，直接用；如果是全称，查表；查不到默认 US
        let isoCountryCode = shippingAddr.country;
        if (shippingAddr.country.length > 2) {
            isoCountryCode = COUNTRY_DATA[shippingAddr.country] || 'US';
        }

        return actions.order.create({
            purchase_units: [
                {
                    reference_id: orderNumber,
                    description: `Order #${orderData.orderNumber}`,
                    amount: {
                        currency_code: "USD",
                        value: Number(orderData.totalAmount).toFixed(2),
                    },
                    shipping: {
                        name: {
                            full_name: `${shippingAddr.firstName || ''} ${shippingAddr.lastName || ''}`.trim()
                        },
                        address: {
                            address_line_1: shippingAddr.addressLine1 || '',
                            address_line_2: shippingAddr.addressLine2 || "",
                            admin_area_2: shippingAddr.city || '',
                            admin_area_1: shippingAddr.province || '',
                            postal_code: shippingAddr.zipCode || '',
                            // ✅ 使用转换后的代码
                            country_code: isoCountryCode
                        }
                    }
                },
            ],
            application_context: {
                shipping_preference: "SET_PROVIDED_ADDRESS",
                brand_name: "MythToy",
                user_action: "PAY_NOW"
            }
        });
    };

    const onApprove = async (data: any) => {
        try {
            setPaymentStatus('processing');

            await orderService.payOrder(orderNumber!, {
                transactionId: data.orderID,
                paymentMethod: 'PAYPAL',
                amount: orderData.totalAmount,
                currency: 'USD'
            });

            setPaymentStatus('success');
            clearCart();

            const emailData = {
                orderNumber: orderData.orderNumber,
                email: orderData.shippingAddress.email || orderData.guestEmail, // 确保有邮箱
                firstName: orderData.shippingAddress.firstName,
                totalAmount: orderData.totalAmount,
                shippingFee: orderData.shippingFee,
                items: orderData.items.map((item: any) => ({
                    title: item.productTitle,
                    quantity: item.quantity,
                    price: item.unitPrice,
                    sku: item.productSku
                })),
                shippingAddress: {
                    addressLine1: orderData.shippingAddress.addressLine1,
                    city: orderData.shippingAddress.city,
                    state: orderData.shippingAddress.province,
                    zip: orderData.shippingAddress.zipCode,
                    country: orderData.shippingAddress.country
                }
            };

            // 触发 Server Action
            sendOrderConfirmationEmail(emailData).catch(err => console.error('Email failed', err));

            if (isLoggedIn) {
                localStorage.removeItem('currentOrder');
                router.push(`/orders/${orderNumber}?payment_success=1`);
            } else {
                // 游客去确认页
                router.push(`/order-confirmation?orderNumber=${orderNumber}`);
            }

        } catch (error: any) {
            console.error(error);
            setPaymentStatus('error');
            setErrorMessage(error.message || "Payment verification failed");
        }
    };

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">Loading secure payment...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-6">{errorMessage || "We couldn't retrieve the order details."}</p>
                    <button onClick={() => router.push('/checkout')} className="bg-black text-white px-6 py-3 rounded-lg font-bold">
                        Return to Checkout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-lg">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-black p-8 text-white text-center">
                        <p className="text-sm opacity-80 uppercase tracking-widest mb-2">Total to Pay</p>
                        <h1 className="text-5xl font-bold font-['Playfair_Display']">
                            ${Number(orderData.totalAmount).toFixed(2)}
                        </h1>
                        <p className="text-xs mt-3 opacity-60">Order Ref: {orderData.orderNumber}</p>
                    </div>

                    <div className="p-8">
                        {paymentStatus === 'success' ? (
                            <div className="text-center py-8 animate-in fade-in zoom-in">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                                <p className="text-gray-500">Redirecting...</p>
                            </div>
                        ) : paymentStatus === 'error' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                                <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
                                <button onClick={() => window.location.reload()} className="text-sm font-bold text-black underline">Try Again</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <Lock size={14} />
                                    <span>Secure 256-bit SSL Encrypted</span>
                                </div>

                                <div className="relative z-0 min-h-[150px]">
                                    {clientId && (
                                        <PayPalScriptProvider options={{
                                            clientId: clientId,
                                            currency: "USD",
                                            intent: "capture"
                                        }}>
                                            <PayPalButtons
                                                style={{ layout: "vertical", shape: "rect", borderRadius: 12, height: 48 }}
                                                createOrder={createPayPalOrder}
                                                onApprove={onApprove}
                                                onError={(err) => {
                                                    console.error("PayPal Error:", err);
                                                    setErrorMessage("PayPal encountered an error.");
                                                    setPaymentStatus('error');
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                                        Cancel Payment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center opacity-60">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                        <ShieldCheck size={14} />
                        <span>Guaranteed Safe & Discreet Checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <PaymentContent />
        </Suspense>
    );
}