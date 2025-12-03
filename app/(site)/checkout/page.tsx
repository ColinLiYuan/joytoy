// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag, Lock, ArrowLeft, LogIn } from 'lucide-react';
import ShippingForm from './shipping';
import OrderSummary from './orderSummary';
import { useShipping } from '@/hooks/useShipping';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderItemRequest } from '@/types/order';
import { getUserFullName, getUserEmail } from '@/lib/user-utils';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);

    // Coupon & Shipping State
    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [shippingFee, setShippingFee] = useState(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const { isLoggedIn, openAuthModal, isClient } = useAuth();
    const { cart, getCart, loading: cartLoading } = useCartStore();
    const { getShippingFormData } = useShipping({ userEmail: getUserEmail(), userName: getUserFullName() });

    // 1. 初始化检查
    useEffect(() => {
        const init = async () => {
            // 等待客户端挂载
            if (!isClient) return;

            try {
                setIsLoading(true);

                // 如果没登录，弹窗提示，并停止加载购物车
                if (!isLoggedIn) {
                    openAuthModal('login', {
                        onSuccess: () => {
                            // 登录成功后重新初始化（获取购物车）
                            init();
                        }
                    });
                    setIsLoading(false);
                    return;
                }

                // 已登录，获取购物车
                await getCart();
            } catch (e) {
                console.error(e);
                router.push('/');
            } finally {
                // 如果已登录，数据加载完后取消 Loading
                if (isLoggedIn) setIsLoading(false);
            }
        };

        init();
    }, [router, getCart, isLoggedIn, openAuthModal, isClient]);

    // 2. 转换购物车数据结构
    useEffect(() => {
        if (cart?.items?.length) {
            setOrderItems(cart.items.map(item => ({
                productId: item.productId,
                productTitle: item.productTitle,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                productSku: item.productSku,
                productImage: item.productImage,
                color: item.color || 'Default',
            })));
        }
    }, [cart?.items]);

    // Coupon Logic (Mock)
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        // TODO: Replace with backend call: POST /api/coupons/validate
        setTimeout(() => {
            if (couponCode.toUpperCase() === 'MYTH20') {
                const subtotal = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
                setDiscountAmount(subtotal * 0.2);
            } else {
                setDiscountAmount(0);
            }
            setIsApplyingCoupon(false);
        }, 500);
    };

    // Create Order
    const handleProceedToPayment = async () => {
        setIsCreatingOrder(true);
        try {
            const formData = getShippingFormData();
            const orderData: OrderCreateRequest = {
                items: orderItems,
                shippingAddress: {
                    ...formData.shippingAddress,
                    addressLine2: formData.shippingAddress.addressLine2 || ''
                },
                paymentMethod: 'CREDIT_CARD',
                shippingMethod: 'STANDARD',
                customerNote: formData.orderNotes,
                shippingFee,
                discountAmount
            };

            const res = await orderService.createOrder(orderData);
            if (res.success && res.data) {
                localStorage.setItem('currentOrder', JSON.stringify({
                    orderId: res.data.id,
                    orderNumber: res.data.orderNumber,
                    totalAmount: res.data.finalAmount,
                    items: orderItems
                }));
                useCartStore.getState().clearCart();
                router.push(`/payment?orderId=${res.data.id}`);
            }
        } catch (e) {
            console.error(e);
            // 可以添加 toast 提示
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // 1. Global Loading
    if (!isClient || (isLoading && isLoggedIn) || cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center w-full max-w-full overflow-x-hidden">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
                <p className="text-sm font-medium tracking-wide text-gray-500">SECURE CHECKOUT LOADING...</p>
            </div>
        );
    }

    // 2. ✅ Not Logged In State (强制阻断)
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 w-full max-w-full overflow-x-hidden">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">Account Required</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        For security reasons and to manage your order details, please sign in to access checkout.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => openAuthModal('login', { onSuccess: () => window.location.reload() })}
                            className="w-full bg-black text-white px-6 py-3.5 rounded-xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <LogIn size={18} />
                            Sign In / Register
                        </button>
                        <button
                            onClick={() => router.push('/collections/all')}
                            className="w-full bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Empty Cart State
    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full max-w-full overflow-x-hidden">
                <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">Your bag is empty</h2>
                    <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
                    <button
                        className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
                        onClick={() => router.push('/collections/all')}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    // 4. Main Checkout Content
    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">Checkout</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10">
                            <ShippingForm
                                userEmail={getUserEmail()}
                                userName={getUserFullName()}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    {/* Right: Summary & Coupon */}
                    <div className="lg:col-span-5 space-y-6">
                        <OrderSummary
                            orderItems={orderItems}
                        />

                        {/* Coupon Input */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Tag size={16} /> Gift Card or Discount Code
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all uppercase placeholder:normal-case"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon || !couponCode}
                                    className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all min-w-[80px]"
                                >
                                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
                                </button>
                            </div>
                            {discountAmount > 0 && (
                                <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
                                    <Tag size={12} /> Coupon applied successfully!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}