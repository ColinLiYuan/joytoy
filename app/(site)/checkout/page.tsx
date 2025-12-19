// app/checkout/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag, ArrowLeft, User } from 'lucide-react'; // 新增 User 图标
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
                // 无论是否登录，都尝试获取购物车
                await getCart();
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, [getCart, isClient]); // 移除了 isLoggedIn 依赖

    // 2. 数据转换 (保持不变)
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

    // 3. 计算逻辑 (保持不变)
    const { subtotal, shippingFee, discountAmount, total } = useMemo(() => {
        const sub = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
        let discount = 0;
        if (appliedCoupon === 'MYTH20') discount = sub * 0.2;
        const shipping = sub >= 49 ? 0 : 5.99;
        return { subtotal: sub, shippingFee: shipping, discountAmount: discount, total: Math.max(0, sub - discount + shipping) };
    }, [orderItems, appliedCoupon]);

    const handleApplyCoupon = async () => { /* 保持不变 */ };

    // 4. 创建订单逻辑 (核心修改：兼容游客)
    const handleProceedToPayment = async () => {
        const userId = getUserId(); // 可能为空
        const cartId = getCartId(); // 必须有 (无论是登录还是游客的 LocalStorage 购物车)

        // if (!cartId) {
        //     showToast('error', 'Error', 'Cart session expired.');
        //     return;
        // }

        const formData = getShippingFormData();

        // 校验：游客必须填邮箱 (虽然 ShippingForm 里通常已经校验了)
        if (!isLoggedIn && !formData.shippingAddress.email) {
            showToast('error', 'Missing Email', 'Please provide an email for your receipt.');
            return;
        }

        setIsCreatingOrder(true);

        const addressData = {
            firstName: formData.shippingAddress.firstName,
            lastName: formData.shippingAddress.lastName,
            phone: formData.shippingAddress.phone,
            // 优先用表单填的邮箱，其次用游客输入的邮箱
            email: formData.shippingAddress.email || guestEmail,
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
            userId: userId || undefined, // ✅ 允许 undefined，后端需要处理 null userId
            cartId: cartId || undefined,
            items: orderItems,
            shippingAddress: addressData,
            billingAddress: addressData,
            paymentMethod: 'CREDIT_CARD',
            shippingMethod: 'STANDARD',
            customerNote: formData.orderNotes,
            shippingFee: shippingFee,
            discountAmount: discountAmount,
            // ✅ 新增：如果是游客，可能需要传 email 给后端记录 (如果后端 createOrder 支持的话)
            guestEmail: !userId ? addressData.email : undefined
        };

        try {
            const result = await orderService.createOrder(orderData);

            // 存储订单信息用于支付页
            localStorage.setItem('currentOrder', JSON.stringify({
                orderId: result.id,
                orderNumber: result.orderNumber,
                totalAmount: result.finalAmount,
                items: orderItems,
                guestEmail: addressData.email // ✅ 存下邮箱，支付页可能用到
            }));

            useCartStore.getState().clearCart();
            router.push(`/payment?orderNumber=${result.orderNumber}`);
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

    // 空购物车 (保持不变)
    if (orderItems.length === 0) { /* ... 保持不变 ... */ }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header: 新增登录提示条 (如果是游客) */}
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
                        {/* Coupon ... 保持不变 ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}