'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, AlertCircle, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/authContext';
import { COUNTRY_DATA } from '@/lib/constants/country-data';
import { useCartStore } from '@/stores/useCartStore';
import { sendOrderConfirmationEmail } from '@/app/actions/send-order-email';
// ⚠️ 确保你创建了这个 Server Action 文件
import { createStripePaymentIntent } from '@/app/actions/stripe';

// --- 配置区域 ---
// 针对高风险行业，这里做开关。如果 PayPal 被封，改为 false 即可。
const PAYMENT_CONFIG = {
    ENABLE_PAYPAL: true,
    ENABLE_STRIPE: false,
};

// 初始化 Stripe (放在组件外)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- 子组件: Stripe 支付表单 ---
function StripeCheckoutForm({ orderData, onSuccess, onError }: { orderData: any, onSuccess: () => void, onError: (msg: string) => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            // 1. 向 Stripe 提交支付
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: window.location.href },
                redirect: "if_required",
            });

            if (error) throw new Error(error.message);

            if (paymentIntent && paymentIntent.status === "succeeded") {
                // 2. 支付成功，通知后端记录
                await orderService.payOrder(orderData.orderNumber, {
                    transactionId: paymentIntent.id,
                    paymentMethod: 'STRIPE',
                    currency: 'USD'
                });
                // 3. 触发通用成功回调
                onSuccess();
            }
        } catch (err: any) {
            onError(err.message || "Payment verification failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <PaymentElement />
            </div>
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : <Lock className="w-4 h-4" />}
                {isProcessing ? 'Processing...' : `Pay $${Number(orderData.finalAmount).toFixed(2)}`}
            </button>
        </form>
    );
}

// --- 主组件 ---
function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawOrderNumber = searchParams.get('orderNumber');
    const orderNumber = rawOrderNumber ? rawOrderNumber.replace(/^#/, '') : null;

    const { isLoggedIn } = useAuth();
    const { clearCart } = useCartStore();
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    // State
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Payment State
    const [activeMethod, setActiveMethod] = useState<'PAYPAL' | 'STRIPE'>('PAYPAL');
    const [stripeClientSecret, setStripeClientSecret] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');

    useEffect(() => { setIsMounted(true); }, []);

    // 1. 智能设置默认支付方式
    useEffect(() => {
        if (!PAYMENT_CONFIG.ENABLE_PAYPAL && PAYMENT_CONFIG.ENABLE_STRIPE) {
            setActiveMethod('STRIPE');
        } else if (PAYMENT_CONFIG.ENABLE_PAYPAL) {
            setActiveMethod('PAYPAL');
        }
    }, []);

    // 2. 加载订单数据
    useEffect(() => {
        if (!isMounted) return;
        const fetchOrder = async () => {
            if (!orderNumber) {
                setErrorMessage('Order number is missing');
                setIsLoading(false);
                return;
            }
            try {
                // 优先从 LocalStorage 拿 (防止 API 延迟)
                // const storedOrder = localStorage.getItem('currentOrder');
                // console.log('get order from local: ', storedOrder);
                // if (storedOrder) {
                //     const parsed = JSON.parse(storedOrder);
                //     if (String(parsed.orderNumber).replace(/^#/, '') === orderNumber) {
                //         setOrderData(parsed);
                //         setIsLoading(false);
                //         return;
                //     }
                // }
                // API fallback
                const data = await orderService.getOrder(orderNumber);
                // console.log('order from api: ', data);

                if (data) setOrderData(data);
                else throw new Error('Order not found');
            } catch (error) {
                setErrorMessage('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber, isMounted]);

    // 3. 当切换到 Stripe 时，初始化 ClientSecret
    useEffect(() => {
        if (orderData && activeMethod === 'STRIPE' && !stripeClientSecret && PAYMENT_CONFIG.ENABLE_STRIPE) {
            createStripePaymentIntent(Number(orderData.finalAmount))
                .then(res => setStripeClientSecret(res.clientSecret!))
                .catch(err => {
                    console.error(err);
                    setErrorMessage("Unable to initialize secure credit card payment.");
                });
        }
    }, [orderData, activeMethod, stripeClientSecret]);

    // --- 核心：通用成功处理逻辑 (PayPal 和 Stripe 共用) ---
    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            clearCart();

            // 准备邮件数据
            const emailData = {
                orderNumber: orderData.orderNumber,
                email: orderData.shippingAddress?.email || orderData.guestEmail || '',
                firstName: orderData.shippingAddress?.firstName || 'Valued Customer',
                finalAmount: Number(orderData.finalAmount || 0),
                shippingFee: Number(orderData.shippingFee || 0),
                discountAmount: Number(orderData.discountAmount || 0),
                items: (orderData.items || []).map((item: any) => ({
                    title: item.productTitle || 'Unknown Item',
                    quantity: Number(item.quantity || 1),
                    price: Number(item.unitPrice || 0),
                    sku: item.productSku
                })),
                shippingAddress: {
                    addressLine1: orderData.shippingAddress?.addressLine1 || '',
                    city: orderData.shippingAddress?.city || '',
                    state: orderData.shippingAddress?.province || '',
                    zip: orderData.shippingAddress?.zipCode || '',
                    country: orderData.shippingAddress?.country || ''
                }
            };

            // 发送邮件 (不阻塞跳转)
            sendOrderConfirmationEmail(emailData).catch(err => console.error('Email failed', err));

            // 跳转
            if (isLoggedIn) {
                localStorage.removeItem('currentOrder');
                router.push(`/orders/${orderNumber}?payment_success=1`);
            } else {
                router.push(`/order-confirmation?orderNumber=${orderNumber}`);
            }
        } catch (error) {
            console.error("Post-payment error:", error);
            // 即使这里出错，支付其实已经成功了，所以还是算成功
            setPaymentStatus('success');
        }
    };

    // --- PayPal 专用逻辑 ---
    const createPayPalOrder = (data: any, actions: any) => {
        const shippingAddr = orderData.shippingAddress;

        let isoCountryCode = shippingAddr.country;
        if (shippingAddr.country && shippingAddr.country.length > 2) {
            isoCountryCode = COUNTRY_DATA[shippingAddr.country] || 'US';
        }

        // 动态计算总价，确保金额匹配
        const calculatedItemTotal = (orderData.items || []).reduce((acc: number, item: any) => {
            return acc + (Number(item.unitPrice || 0) * Number(item.quantity || 1));
        }, 0);

        const shippingValue = Number(orderData.shippingFee || 0);
        const discountValue = Number(orderData.discountAmount || 0);
        const calculatedTotal = calculatedItemTotal + shippingValue - discountValue;

        return actions.order.create({
            purchase_units: [{
                reference_id: orderNumber,
                description: `Order #${orderData.orderNumber}`,
                amount: {
                    currency_code: "USD",
                    value: calculatedTotal.toFixed(2),
                    breakdown: {
                        item_total: {
                            value: calculatedItemTotal.toFixed(2),
                            currency_code: "USD"
                        },
                        shipping: {
                            value: shippingValue.toFixed(2),
                            currency_code: "USD"
                        },
                        discount: {
                            value: discountValue.toFixed(2),
                            currency_code: "USD"
                        }
                    }
                },
                items: (orderData.items || []).map((item: any) => {
                    // 👇 核心修改在这里：获取 | 之前的名称
                    const rawName = item.productTitle || 'Item';
                    // 1. split('|')[0]: 取竖线前部分
                    // 2. trim(): 去除前后空格
                    // 3. substring(0, 127): 防止超长报错
                    const cleanName = rawName.split('|')[0].trim().substring(0, 127);

                    return {
                        name: cleanName,
                        sku: item.productSku ? item.productSku.substring(0, 127) : 'SKU',
                        quantity: String(item.quantity || 1),
                        unit_amount: {
                            currency_code: "USD",
                            value: Number(item.unitPrice || 0).toFixed(2)
                        },
                    };
                }),
                shipping: {
                    name: { full_name: `${shippingAddr.firstName} ${shippingAddr.lastName}`.trim() },
                    address: {
                        address_line_1: shippingAddr.addressLine1,
                        address_line_2: shippingAddr.addressLine2 || "",
                        admin_area_2: shippingAddr.city,
                        admin_area_1: shippingAddr.province,
                        postal_code: shippingAddr.zipCode,
                        country_code: isoCountryCode
                    }
                }
            }],
            application_context: {
                brand_name: "MYTH STORE",
                user_action: "PAY_NOW",
                shipping_preference: "SET_PROVIDED_ADDRESS"
            }
        });
    };

    const onPayPalApprove = async (data: any) => {
        try {
            await orderService.payOrder(orderNumber!, {
                transactionId: data.orderID,
                paymentMethod: 'PAYPAL',
                currency: 'USD'
            });
            await handlePaymentSuccess();
        } catch (error: any) {
            setErrorMessage(error.message || "PayPal verification failed");
        }
    };

    // --- Render ---

    if (!isMounted) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                <p className="text-gray-500">Loading secure checkout...</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-6">{errorMessage || "Please try again."}</p>
                    <button onClick={() => router.push('/checkout')} className="bg-black text-white px-6 py-3 rounded-lg">Return to Checkout</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 w-full max-w-[100vw] overflow-x-hidden flex flex-col items-center">
            <div className="container mx-auto px-4 max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="bg-black p-8 text-white text-center">
                        <p className="text-xs opacity-80 uppercase tracking-widest mb-2">Total Amount</p>
                        <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] break-all">
                            ${Number(orderData.finalAmount).toFixed(2)}
                        </h1>
                        <p className="text-xs mt-3 opacity-60">Ref: {orderData.orderNumber}</p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* 支付方式切换 Tab */}
                        {PAYMENT_CONFIG.ENABLE_PAYPAL && PAYMENT_CONFIG.ENABLE_STRIPE && (
                            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                <button
                                    onClick={() => setActiveMethod('PAYPAL')}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                        activeMethod === 'PAYPAL' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    PayPal
                                </button>
                                <button
                                    onClick={() => setActiveMethod('STRIPE')}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                        activeMethod === 'STRIPE' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <CreditCard size={16}/> Credit Card
                                </button>
                            </div>
                        )}

                        {/* 安全提示 */}
                        <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
                            <Lock size={14} />
                            <span>256-bit SSL Encrypted & Discreet Billing</span>
                        </div>

                        {/* Error Display */}
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errorMessage}
                            </div>
                        )}

                        {/* --- PayPal Section --- */}
                        {PAYMENT_CONFIG.ENABLE_PAYPAL && activeMethod === 'PAYPAL' && (
                            <div className="relative z-0 min-h-[150px] w-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {paypalClientId ? (
                                    <PayPalScriptProvider options={{
                                                clientId: paypalClientId,
                                                currency: "USD",
                                                intent: "capture"
                                                // "disable-funding": "card"
                                            }}>
                                        <PayPalButtons
                                            style={{ layout: "vertical", shape: "rect", borderRadius: 12, height: 48 }}
                                            className="w-full"
                                            createOrder={createPayPalOrder}
                                            onApprove={onPayPalApprove}
                                        />
                                    </PayPalScriptProvider>
                                ) : (
                                    <div className="text-red-500 text-center text-sm">PayPal Configuration Missing</div>
                                )}
                            </div>
                        )}

                        {/* --- Stripe Section --- */}
                        {PAYMENT_CONFIG.ENABLE_STRIPE && activeMethod === 'STRIPE' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {stripeClientSecret ? (
                                    <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                                        <StripeCheckoutForm
                                            orderData={orderData}
                                            onSuccess={handlePaymentSuccess}
                                            onError={setErrorMessage}
                                        />
                                    </Elements>
                                ) : (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="animate-spin text-gray-300 w-8 h-8"/>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- All Disabled --- */}
                        {!PAYMENT_CONFIG.ENABLE_PAYPAL && !PAYMENT_CONFIG.ENABLE_STRIPE && (
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">Payment system is currently under maintenance.</p>
                            </div>
                        )}

                        <div className="text-center mt-6">
                            <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                                Cancel Payment
                            </button>
                        </div>
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