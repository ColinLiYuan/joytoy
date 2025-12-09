// app/checkout/page.tsx (覆盖原文件)
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag, Lock, ArrowLeft, LogIn } from 'lucide-react';
import ShippingForm from './shipping';
import OrderSummary from './orderSummary';
import { useShipping } from '@/hooks/useShipping';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderItemRequest, AddressRequest } from '@/types/order';
import { getUserFullName, getUserEmail, getUserId, getCartId } from '@/lib/user-utils';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const { isLoggedIn, openAuthModal, isClient } = useAuth();
    const { cart, getCart, loading: cartLoading } = useCartStore();
    const { getShippingFormData, shippingAddress, updateShippingAddress } = useShipping({
        userEmail: getUserEmail(),
        userName: getUserFullName()
    });
    const { showToast } = useToast();

    // 1. 初始化
    useEffect(() => {
        const init = async () => {
            if (!isClient) return;
            try {
                setIsLoading(true);
                if (!isLoggedIn) {
                    openAuthModal('login', { onSuccess: () => init() });
                    setIsLoading(false);
                    return;
                }
                await getCart();
            } catch (e) {
                console.error(e);
                router.push('/');
            } finally {
                if (isLoggedIn) setIsLoading(false);
            }
        };
        init();
    }, [router, getCart, isLoggedIn, openAuthModal, isClient]);

    // 2. 数据转换
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
                skuId: item.itemId
            })));
        }
    }, [cart?.items]);

    // ... (useMemo 金额计算保持不变) ...
    const { subtotal, shippingFee, discountAmount, total } = useMemo(() => {
        const sub = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
        let discount = 0;
        if (appliedCoupon === 'MYTH20') discount = sub * 0.2;
        const shipping = sub >= 40 ? 0 : 7.99;
        const finalTotal = Math.max(0, sub - discount + shipping);
        return { subtotal: sub, shippingFee: shipping, discountAmount: discount, total: finalTotal };
    }, [orderItems, appliedCoupon]);

    // ... (handleApplyCoupon 保持不变) ...
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        setTimeout(() => {
            if (couponCode.toUpperCase() === 'MYTH20') {
                setAppliedCoupon('MYTH20');
                showToast('success', 'Success', '20% discount applied!');
            } else {
                setAppliedCoupon('');
                showToast('error', 'Invalid Code', 'This coupon code is invalid.');
            }
            setIsApplyingCoupon(false);
        }, 600);
    };

    // ... (handleProceedToPayment 保持不变) ...
    const handleProceedToPayment = async () => {
        const userId = getUserId();
        const cartId = getCartId();
        if (!userId || !cartId) { showToast('error', 'Session Error', 'Please login again.'); return; }
        setIsCreatingOrder(true);
        try {
            const formData = getShippingFormData();
            const addressData = {
                firstName: formData.shippingAddress.firstName,
                lastName: formData.shippingAddress.lastName,
                phone: formData.shippingAddress.phone,
                email: formData.shippingAddress.email,
                country: formData.shippingAddress.country,
                province: formData.shippingAddress.province,
                city: formData.shippingAddress.city,
                addressLine1: formData.shippingAddress.addressLine1,
                addressLine2: formData.shippingAddress.addressLine2 || '',
                zipCode: formData.shippingAddress.zipCode,
                company: '',
                useAsBilling: true
            };
            const orderData: OrderCreateRequest = {
                userId, cartId, items: orderItems,
                shippingAddress: addressData, billingAddress: addressData,
                paymentMethod: 'CREDIT_CARD', shippingMethod: 'STANDARD',
                customerNote: formData.orderNotes, shippingFee, discountAmount
            };
            const result = await orderService.createOrder(orderData);
            if (result.success && result.data) {
                localStorage.setItem('currentOrder', JSON.stringify({
                    orderId: result.data.id, orderNumber: result.data.orderNumber,
                    totalAmount: result.data.finalAmount, items: orderItems
                }));
                useCartStore.getState().clearCart();
                router.push(`/payment?orderId=${result.data.id}`);
            } else { throw new Error(result.error || 'Order creation failed'); }
        } catch (e: any) { console.error(e); showToast('error', 'Order Failed', e.message || 'Could not create order'); } finally { setIsCreatingOrder(false); }
    };

    // ✅ UI 状态处理

    // Loading
    if (!isClient || (isLoading && isLoggedIn) || cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center w-full max-w-full overflow-x-hidden">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
                <p className="text-sm font-medium tracking-wide text-gray-500">SECURE CHECKOUT LOADING...</p>
            </div>
        );
    }

    // Not Logged In
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 w-full max-w-full overflow-x-hidden">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Sign in to Checkout</h2>
                    <button onClick={() => openAuthModal('login')} className="bg-black text-white px-6 py-3 rounded-lg font-bold w-full">Sign In</button>
                </div>
            </div>
        );
    }

    // ✅ 修复：Empty Cart (美化版)
    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center w-full max-w-full overflow-x-hidden">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">Your bag is empty</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Let's change that.</p>
                <button
                    className="bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2"
                    onClick={() => router.push('/collections/all')}
                >
                    <ArrowLeft size={18} />
                    Start Shopping
                </button>
            </div>
        );
    }

    // Main Content
    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">Checkout</h1>
                    <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-10">
                            <ShippingForm
                                shippingAddress={shippingAddress}
                                updateShippingAddress={updateShippingAddress}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-5 space-y-6">
                        <OrderSummary
                            orderItems={orderItems}
                            subtotal={subtotal}
                            shipping={shippingFee}
                            discount={discountAmount}
                            total={total}
                        />
                        {/* Coupon ... */}
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
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button
                                        onClick={() => { setAppliedCoupon(''); setCouponCode(''); }}
                                        className="bg-gray-200 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !couponCode}
                                        className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all min-w-[80px]"
                                    >
                                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
                                    </button>
                                )}
                            </div>
                            {appliedCoupon && (
                                <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
                                    <Tag size={12} /> Code <strong>{appliedCoupon}</strong> applied!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}