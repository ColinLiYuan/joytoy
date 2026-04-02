'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/contexts/authContext';
import { COUNTRY_DATA } from '@/lib/constants/country-data';
import { useCartStore } from '@/stores/useCartStore';
import { sendOrderConfirmationEmail } from '@/app/actions/send-order-email';

// --- 配置区域 ---
const PAYMENT_CONFIG = {
    ENABLE_PAYPAL: true,
};

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
    const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');

    useEffect(() => { setIsMounted(true); }, []);

    // 加载订单数据
    useEffect(() => {
        if (!isMounted) return;
        const fetchOrder = async () => {
            if (!orderNumber) {
                setErrorMessage('Order number is missing');
                setIsLoading(false);
                return;
            }
            try {
                const data = await orderService.getOrder(orderNumber);
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

    console.log('orderData: ', orderData)

    // --- 核心：成功处理逻辑 ---
    const handlePaymentSuccess = async () => {
        try {
            setPaymentStatus('success');
            clearCart();

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

            sendOrderConfirmationEmail(emailData).catch(err => console.error('Email failed', err));

            if (isLoggedIn) {
                localStorage.removeItem('currentOrder');
                router.push(`/orders/${orderNumber}?payment_success=1`);
            } else {
                router.push(`/order-confirmation?orderNumber=${orderNumber}`);
            }
        } catch (error) {
            console.error("Post-payment error:", error);
            setPaymentStatus('success');
        }
    };

    // --- PayPal 专用逻辑 ---
    const createPayPalOrder = (data: any, actions: any) => {
        const shippingAddr = orderData.shippingAddress;
        const calculatedItemTotal = (orderData.items || []).reduce((acc: number, item: any) => {
            return acc + (Number(item.unitPrice || 0) * Number(item.quantity || 1));
        }, 0);
        const shippingValue = Number(orderData.shippingFee || 0);
        const discountValue = Number(orderData.discountAmount || 0);
        const calculatedTotal = calculatedItemTotal + shippingValue - discountValue;
        const cleanPhone = (shippingAddr.phone || "").replace(/\D/g, '');

        return actions.order.create({
            // 1. 添加 payer 对象来预填账单地址信息
            payer: {
                name: {
                    given_name: shippingAddr.firstName,
                    surname: shippingAddr.lastName
                },
                email_address: shippingAddr.email || orderData.guestEmail,
                phone: {
                    phone_type: "MOBILE",
                    phone_number: {
                        national_number: cleanPhone
                    }
                },
                address: {
                    address_line_1: shippingAddr.addressLine1,
                    address_line_2: shippingAddr.addressLine2 || "",
                    admin_area_2: shippingAddr.city,
                    admin_area_1: shippingAddr.province,
                    postal_code: shippingAddr.zipCode,
                    country_code: shippingAddr.country
                }
            },
            purchase_units: [{
                reference_id: orderNumber,
                description: `Order #${orderData.orderNumber}`,
                items: (orderData.items || []).map((item: any) => {
                    const rawName = item.productTitle || 'Item';
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
                // 2. 确保 shipping 里的地址也传了，通常 PayPal 会默认账单地址同收货地址
                shipping: {
                    name: { full_name: `${shippingAddr.firstName} ${shippingAddr.lastName}`.trim() },
                    address: {
                        address_line_1: shippingAddr.addressLine1,
                        address_line_2: shippingAddr.addressLine2 || "",
                        admin_area_2: shippingAddr.city,
                        admin_area_1: shippingAddr.province,
                        postal_code: shippingAddr.zipCode,
                        country_code: shippingAddr.country
                    }
                }
            }],
            application_context: {
                brand_name: "MYTH TOY",
                user_action: "PAY_NOW",
                // 强制使用提供的地址，减少用户修改机会
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
                        {PAYMENT_CONFIG.ENABLE_PAYPAL ? (
                            <div className="relative z-0 min-h-[150px] w-full overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {paypalClientId ? (
                                    <PayPalScriptProvider options={{
                                        clientId: paypalClientId,
                                        currency: "USD",
                                        intent: "capture",
                                        // 💡 去掉 Pay Later 选项的核心配置
                                        components: "buttons",
                                        "disable-funding": "paylater,credit"
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
                        ) : (
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