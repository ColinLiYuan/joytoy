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
import { validateCoupon, Coupon } from '@/lib/constants/coupons';

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const [guestEmail, setGuestEmail] = useState('');
    const { isLoggedIn, openAuthModal, isClient } = useAuth();
    const { cart, getCart, loading: cartLoading } = useCartStore();
    const { showToast } = useToast();
    const {
        shippingAddress,
        updateShippingAddress,
        getShippingFormData
    } = useShipping({
        userEmail: isLoggedIn ? getUserEmail() : '',
        userName: isLoggedIn ? getUserFullName() : ''
    });

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

    useEffect(() => {
        if (cart?.items?.length) {
            setOrderItems(cart.items.map(item => ({
                productId: item.productId,
                productTitle: item.productTitle,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                productSku: item.productSku,
                productImage: item.productImage,
                color: item.color || 'Default',
                skuId: item.itemId
            })));
        }
    }, [cart?.items]);

    // ✅ 计算逻辑（简化版，因为已经验证过产品适用性）
    const { subtotal, shippingFee, discountAmount, total } = useMemo(() => {
        const sub = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
        let discount = 0;

        if (appliedCoupon) {
            // ✅ 这里直接计算，因为已经验证过购物车中所有产品都适用
            if (appliedCoupon.type === 'PERCENTAGE') {
                discount = sub * appliedCoupon.value;
            } else if (appliedCoupon.type === 'FIXED') {
                discount = Math.min(appliedCoupon.value, sub);
            }

            // 防止折扣金额超过商品总额
            discount = Math.min(discount, sub);
        }

        const shipping = sub >= 49 ? 0 : 7.99;
        const finalTotal = Math.max(0, sub - discount + shipping);

        return {
            subtotal: sub,
            shippingFee: shipping,
            discountAmount: discount,
            total: finalTotal
        };
    }, [orderItems, appliedCoupon]);

    // ✅ 应用折扣码逻辑（增加产品适用性检查）
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);

        setTimeout(() => {
            // 先验证优惠券是否存在
            const validCoupon = validateCoupon(couponCode);

            if (!validCoupon) {
                setAppliedCoupon(null);
                showToast('error', 'Invalid Code', 'This coupon code is invalid or expired.');
                setIsApplyingCoupon(false);
                return;
            }

            // ✅ 如果优惠券有产品限制
            if (validCoupon.applicableProduct && validCoupon.applicableProduct.length > 0) {
                // 检查购物车中所有产品是否都适用
                const allItemsApplicable = orderItems.every(item => {
                    // 注意：这里用的是 productTitle，根据你的数据结构调整
                    const itemName = item.productName; // 如果实际是 productName，改为 item.productName

                    return validCoupon.applicableProduct.some(applicableName =>
                        applicableName.toLowerCase() === itemName.toLowerCase()
                    );
                });

                if (!allItemsApplicable) {
                    setAppliedCoupon(null);
                    showToast('error', 'Not Applicable',
                        'This coupon is only valid for specific products. ' +
                        'Please remove other items from your cart to use this coupon.');
                    setIsApplyingCoupon(false);
                    return;
                }
            }

            // ✅ 所有检查通过，应用优惠券
            setAppliedCoupon(validCoupon);
            showToast('success', 'Success', validCoupon.description);
            setIsApplyingCoupon(false);
        }, 600);
    };

    const handleProceedToPayment = async () => {
        const userId = getUserId();
        const cartId = getCartId();
        const formData = getShippingFormData();
        const addr = formData.shippingAddress;

        if (!addr.firstName || !addr.lastName || !addr.addressLine1 || !addr.city || !addr.zipCode || !addr.country) {
            showToast('error', 'Incomplete Address', 'Please fill in all required shipping fields.');
            return;
        }

        const emailToUse = isLoggedIn ? (addr.email || getUserEmail()) : addr.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailToUse || !emailRegex.test(emailToUse)) {
            showToast('error', 'Invalid Email', 'Please provide a valid email address.');
            return;
        }

        if (total === 0) {
            setIsCreatingOrder(true);
            try {
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
                    paymentMethod: 'FREE', // 新增支付方式
                    shippingMethod: 'STANDARD',
                    customerNote: formData.orderNotes,
                    shippingFee: shippingFee,
                    discountAmount: discountAmount,
                    guestEmail: !userId ? addressData.email : undefined
                };

                const result = await orderService.createOrder(orderData);

                // 清空购物车
                useCartStore.getState().clearCart();

                const cleanOrderNumber = result.orderNumber.replace(/^#/, '');

                // ✅ 根据你的 payment.tsx 逻辑跳转：
                if (isLoggedIn) {
                    router.push(`/orders/${cleanOrderNumber}?free_order=true`);
                } else {
                    router.push(`/order-confirmation?orderNumber=${cleanOrderNumber}&free_order=true`);
                }

            } catch (error: any) {
                showToast('error', 'Order Failed', error.message || 'Could not create order');
            } finally {
                setIsCreatingOrder(false);
            }
            return; // 直接返回，不走正常支付流程
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
            localStorage.setItem('currentOrder', JSON.stringify({
                orderId: result.id,
                orderNumber: result.orderNumber,
                shippingFee: result.shippingFee,
                discountAmount: result.discountAmount,
                totalAmount: result.finalAmount,
                items: orderItems,
                guestEmail: addressData.email,
                shippingAddress: addressData
            }));
            useCartStore.getState().clearCart();
            const cleanOrderNumber = result.orderNumber.replace(/^#/, '');
            router.push(`/payment?orderNumber=${cleanOrderNumber}`);
        } catch (error: any) {
            showToast('error', 'Order Failed', error.message || 'Could not create order');
        } finally {
            setIsCreatingOrder(false);
        }
    };

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
                    <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your bag is empty</h2>
                    <button
                        onClick={() => router.push('/collections/all')}
                        className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold mt-4"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full max-w-[100vw] overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display']">Checkout</h1>
                    {!isLoggedIn && (
                        <button
                            onClick={() => openAuthModal('login')}
                            className="text-sm font-medium text-black underline flex items-center gap-2 hover:text-gray-600 self-start md:self-auto"
                        >
                            <User size={16} /> Already have an account? Sign in
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full">
                    {/* Left: Form */}
                    <div className="lg:col-span-7 w-full">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 lg:p-10 w-full overflow-hidden">
                            <ShippingForm
                                shippingAddress={shippingAddress}
                                updateShippingAddress={updateShippingAddress}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-5 space-y-6 w-full">
                        <div className="w-full overflow-hidden rounded-2xl">
                            <OrderSummary
                                orderItems={orderItems}
                                subtotal={subtotal}
                                shipping={shippingFee}
                                discount={discountAmount}
                                total={total}
                                appliedCoupon={appliedCoupon}
                            />
                        </div>

                        {/* Coupon Input */}
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Tag size={16} /> Gift Card or Discount Code
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-base md:text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all uppercase placeholder:normal-case"
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button
                                        onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                                        className="bg-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-gray-300 transition-all whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !couponCode}
                                        className="bg-black text-white px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-gray-800 disabled:opacity-50 transition-all min-w-[70px] whitespace-nowrap"
                                    >
                                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
                                    </button>
                                )}
                            </div>

                            {/* 显示折扣描述 */}
                            {appliedCoupon && (
                                <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1">
                                    <Tag size={12} /> Code <strong>{appliedCoupon.code}</strong>: {appliedCoupon.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}