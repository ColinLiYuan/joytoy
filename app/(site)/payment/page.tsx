// app/(site)/payment/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/authContext';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');
    const { isLoggedIn } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);
    const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [errorMessage, setErrorMessage] = useState('');

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!clientId) {
                // console.log('🔍 fetchOrder function called');
                setErrorMessage("Configuration Error: PayPal Client ID missing");
                setIsLoading(false);
                return;
            }
            // console.log('payment fetch order: ', orderNumber)
            if (!orderNumber) {
                setErrorMessage('Order number is missing');
                setIsLoading(false);
                return;
            }

            try {
                // 1. 尝试从 LocalStorage 获取（最快）
                const storedOrder = localStorage.getItem('currentOrder');
                // console.log('payment fetch order from storedOrder: ', storedOrder)
                if (storedOrder) {
                    const parsed = JSON.parse(storedOrder);
                    // 强制转字符串对比，防止类型不一致
                    if (String(parsed.orderNumber) === String(orderNumber)) {
                        setOrderData(parsed);
                        setIsLoading(false);
                        return;
                    }
                }

                // 2. 如果 LocalStorage 没有，或者 ID 不匹配，尝试从后端获取
                const data = await orderService.getOrder(orderNumber);
                setOrderData(data);
                setIsLoading(false);

                // 暂时这就样：
                setIsLoading(false);

            } catch (error) {
                console.error(error);
                setErrorMessage('Failed to load order details');
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber, clientId]);

    const createPayPalOrder = (data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    reference_id: orderNumber || 'unknown',
                    description: `Order #${orderData?.orderNumber}`,
                    amount: {
                        currency_code: "USD",
                        value: orderData?.totalAmount ? Number(orderData.totalAmount).toFixed(2) : "0.00",
                    },
                },
            ],
        });
    };

    // app/(site)/payment/page.tsx - 更新 onApprove 函数
    const onApprove = async (data: any) => {
        try {
            if (!orderNumber) {
                setErrorMessage('Order number is missing');
                setPaymentStatus('error');
                return;
            }

            setPaymentStatus('processing');

            // 2. 调用后端支付接口
            await orderService.payOrder(orderNumber, {
                transactionId: data.orderID,
                paymentMethod: 'PAYPAL',
                amount: orderData.totalAmount,
                currency: 'USD'
            });

            setPaymentStatus('success');

            // 3. ✅ 分流跳转逻辑
            if (isLoggedIn) {
                // === 登录用户 ===
                // 清除临时数据
                localStorage.removeItem('currentOrder');
                // 跳转到会员中心的订单详情页 (受保护路由)
                router.push(`/orders/${orderNumber}?payment_success=1`);
            } else {
                // === 游客 ===
                // ⚠️ 注意：不要清除 'currentOrder'，因为下一页(Order Confirmation)
                // 需要读取里面的 email 来提示用户 "Receipt sent to xxx@..."

                // 跳转到公开的订单确认页
                router.push(`/order-confirmation?orderNumber=${orderNumber}`);
            }

        } catch (error: any) {
            console.error(error);
            setPaymentStatus('error');
        }
    };

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
                    <p className="text-gray-500 mb-6">We couldn't retrieve the order details.</p>
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
                                <p className="text-gray-500">Redirecting to your receipt...</p>
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

                                <div className="relative z-0">
                                    <PayPalScriptProvider options={{
                                        clientId: clientId!,
                                        currency: "USD",
                                        intent: "capture"
                                    }}>
                                        <PayPalButtons
                                            style={{ layout: "vertical", shape: "rect", borderRadius: 12, height: 48 }}
                                            createOrder={createPayPalOrder}
                                            onApprove={onApprove}
                                        />
                                    </PayPalScriptProvider>
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
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <PaymentContent />
        </Suspense>
    );
}