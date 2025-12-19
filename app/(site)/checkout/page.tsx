// app/checkout/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag, ArrowLeft, User } from 'lucide-react';
import ShippingForm from './shipping';
import OrderSummary from './orderSummary';
import { useShipping } from '@/hooks/useShipping';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderItemRequest } from '@/types/order';
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

    // 游客模式下收集邮箱
    const [guestEmail, setGuestEmail] = useState('');

    const { isLoggedIn, openAuthModal, isClient } = useAuth();
    const { cart, getCart, loading: cartLoading } = useCartStore();
    const { showToast } = useToast();

    // Hook: 如果已登录，自动填充；未登录则为空
    const {
        shippingAddress,
        updateShippingAddress,
        getShippingFormData
    } = useShipping({
        userEmail: isLoggedIn ? getUserEmail() : '',
        userName: isLoggedIn ? getUserFullName() : ''
    });

    // 1. 初始化 (不再强制拦截登录)
    useEffect(() => {
        const init = async () => {
            if (!isClient) return;
            try {
                setIsLoading(true);
                await getCart();
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [getCart, isClient]);

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

    // 3. 计算逻辑
    const { subtotal, shippingFee, discountAmount, total } = useMemo(() => {
        const sub = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
        let discount = 0;
        if (appliedCoupon === 'MYTH20') discount = sub * 0.2;
        const shipping = sub >= 49 ? 0 : 5.99;
        return { subtotal: sub, shippingFee: shipping, discountAmount: discount, total: Math.max(0, sub - discount + shipping) };
    }, [orderItems, appliedCoupon]);

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

    // 4. 创建订单逻辑
    const handleProceedToPayment = async () => {
        const userId = getUserId();
        const cartId = getCartId();

        const formData = getShippingFormData();
        const addr = formData.shippingAddress;

        // ✅ 手动校验必填项 (防御性编程)
        if (!addr.firstName || !addr.lastName || !addr.addressLine1 || !addr.city || !addr.zipCode || !addr.country) {
            showToast('error', 'Incomplete Address', 'Please fill in all required shipping fields.');
            return;
        }

        // ✅ 校验邮箱 (游客或登录用户都必须有邮箱)
        const emailToUse = isLoggedIn ? (addr.email || getUserEmail()) : addr.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailToUse || !emailRegex.test(emailToUse)) {
            showToast('error', 'Invalid Email', 'Please provide a valid email address.');
            return;
        }

        setIsCreatingOrder(true);

        const addressData = {
            firstName: addr.firstName,
            lastName: addr.lastName,
            phone: addr.phone,
            email: emailToUse,
            country: addr.country,
            province: addr.province,
            city: addr.city,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            zipCode: addr.zipCode,
            company: '',
            useAsBilling: true
        };

        const orderData: OrderCreateRequest = {
            userId: userId ?? undefined,
            cartId: cartId ?? undefined,
            items: orderItems,
            shippingAddress: addressData,
            billingAddress: addressData,
            paymentMethod: 'CREDIT_CARD',
            shippingMethod: 'STANDARD',
            customerNote: formData.orderNotes,
            shippingFee: shippingFee,
            discountAmount: discountAmount,
            guestEmail: !userId ? addressData.email : undefined
        };

        try {
            const result = await orderService.createOrder(orderData);

            // ✅ 核心修复：存储完整的 addressData，供支付页使用
            localStorage.setItem('currentOrder', JSON.stringify({
                orderId: result.id,
                orderNumber: result.orderNumber,
                totalAmount: result.finalAmount,
                items: orderItems,
                guestEmail: addressData.email,
                shippingAddress: addressData // 👈 必须存这个！
            }));

            useCartStore.getState().clearCart();

            // ✅ URL 参数去 # 号
            const cleanOrderNumber = result.orderNumber.replace(/^#/, '');
            router.push(`/payment?orderNumber=${cleanOrderNumber}`);

        } catch (error: any) {
            showToast('error', 'Order Failed', error.message || 'Could not create order');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // UI 状态
    if (!isClient || isLoading || cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
            </div>
        );
    }

    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 w-full max-w-full overflow-x-hidden">
                <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
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

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">Checkout</h1>

                    {!isLoggedIn && (
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-sm font-medium text-black underline flex items-center gap-2 hover:text-gray-600"
                        >
                            <User size={16} /> Already have an account? Sign in
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left: Form */}
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

                    {/* Right: Summary */}
                    <div className="lg:col-span-5 space-y-6">
                        <OrderSummary
                            orderItems={orderItems}
                            subtotal={subtotal}
                            shipping={shippingFee}
                            discount={discountAmount}
                            total={total}
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