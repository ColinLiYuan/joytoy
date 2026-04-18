'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag, User } from 'lucide-react';
import ShippingForm from './shipping';
import OrderSummary from './orderSummary';
import { useShipping } from '@/hooks/useShipping';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderItemRequest, AddressRequest } from '@/types/order';
import { getUserFullName, getUserEmail, getUserId, getCartId } from '@/lib/user-utils';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';
import { useToast } from '@/contexts/toastContext';
import { CheckoutValidateRequest, CouponResponse } from '@/types/checkout';
import { affiliateService } from '@/services/affiliateService';
import { checkoutService } from '@/services/checkoutService';

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isPaid, setIsPaid] = useState(false); // 新增:跟踪支付状态
    const [hasSubmitted, setHasSubmitted] = useState(false); // 新增:防止重复提交

    // ✅ 账单地址相关状态
    const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
    const [billingAddress, setBillingAddress] = useState<Partial<AddressRequest>>({});

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

    const { subtotal, shippingFee, discountAmount, total } = useMemo(() => {
        const sub = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'PERCENTAGE') {
                discount = sub * appliedCoupon.value;
            } else if (appliedCoupon.type === 'FIXED_AMOUNT') {
                discount = Math.min(appliedCoupon.value, sub);
            }
            discount = Math.min(discount, sub);
        }
        const shipping = sub >= 49 ? 0 : 4.99;
        const finalTotal = Math.max(0, sub - discount + shipping);
        return { subtotal: sub, shippingFee: shipping, discountAmount: discount, total: finalTotal };
    }, [orderItems, appliedCoupon]);

    const handleApplyCoupon = async () => {
        const trimmedCode = couponCode.trim().toUpperCase();
        if (!trimmedCode) return;
        const formData = getShippingFormData();
        const emailToValidate = isLoggedIn ? getUserEmail() : formData.shippingAddress.email;
        
        // 优化:邮箱格式验证
        if (!emailToValidate || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate)) {
            showToast('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }
        
        setIsApplyingCoupon(true);
        try {
            const validateRequest: CheckoutValidateRequest = { code: trimmedCode, email: emailToValidate };
            const couponResponse: CouponResponse = await checkoutService.validateCoupon(validateRequest);
            setAppliedCoupon(couponResponse);
            showToast('success', 'Coupon Applied', couponResponse.description);
        } catch (error: any) {
            showToast('error', 'Invalid Coupon', error.message || 'The coupon code is invalid.');
            setCouponCode('');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleProceedToPayment = async () => {
        // 优化:防止重复提交
        if (isCreatingOrder || hasSubmitted) {
            console.warn('⚠️ Order creation already in progress');
            return;
        }
        
        const userId = getUserId();
        const cartId = getCartId();
        const formData = getShippingFormData();
        const addr = formData.shippingAddress;
    
        // 优化:邮箱格式验证
        const emailToUse = isLoggedIn ? (addr.email || getUserEmail()) : addr.email;
        if (!emailToUse || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
            showToast('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }
    
        // 优化:统一在 shipping.tsx 中验证,这里只检查返回结果
        if (!addr.firstName || !addr.addressLine1 || !addr.city || !addr.zipCode || !addr.country) {
            showToast('error', 'Incomplete Address', 'Please fill in all required shipping fields.');
            return;
        }
    
        // 校验账单地址(如果取消勾选相同)
        if (!isBillingSameAsShipping) {
            if (!billingAddress.firstName || !billingAddress.addressLine1 || !billingAddress.city || !billingAddress.country) {
                showToast('error', 'Incomplete Billing', 'Please fill in required billing fields.');
                return;
            }
        }
    
        setIsCreatingOrder(true);
        setHasSubmitted(true); // 标记已提交

        const shippingAddressData = {
            firstName: addr.firstName,
            lastName: addr.lastName || '',
            phone: addr.phone || '',
            email: emailToUse || '',
            country: addr.country,
            province: addr.province || '',
            city: addr.city,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            zipCode: addr.zipCode,
            company: '',
            useAsBilling: isBillingSameAsShipping
        };

        const billingAddressData = isBillingSameAsShipping
            ? shippingAddressData
            : {
                firstName: billingAddress.firstName || '',
                lastName: billingAddress.lastName || '',
                phone: billingAddress.phone || addr.phone || '',
                email: emailToUse || '',
                country: billingAddress.country || 'US',
                province: billingAddress.province || '',
                city: billingAddress.city || '',
                addressLine1: billingAddress.addressLine1 || '',
                addressLine2: billingAddress.addressLine2 || '',
                zipCode: billingAddress.zipCode || '',
                company: '',
                useAsBilling: true
            };

        const affTrack = affiliateService.getTrackingData();
        const orderData: OrderCreateRequest = {
            userId: userId ?? undefined,
            cartId: cartId ?? undefined,
            items: orderItems,
            shippingAddress: shippingAddressData,
            billingAddress: billingAddressData as any,
            paymentMethod: 'CREDIT_CARD',
            shippingMethod: 'STANDARD',
            customerNote: formData.orderNotes,
            shippingFee: shippingFee,
            discountAmount: discountAmount,
            guestEmail: !userId ? shippingAddressData.email : undefined,
            couponCode: couponCode?.toUpperCase().trim(),
            affiliateCode: affTrack?.affiliateCode,
            source: affTrack?.source,
            campaign: affTrack?.campaign,
            content: affTrack?.content,
        };

        try {
            const result = await orderService.createOrder(orderData);
            
            // 优化:保存订单信息,但不立即清空购物车
            localStorage.setItem('currentOrder', JSON.stringify({
                ...result,
                items: orderItems,
                shippingAddress: shippingAddressData,
                billingAddress: billingAddressData,
            }));
            
            // 跳转到支付页面
            router.push(`/payment?orderNumber=${result.orderNumber.replace(/^#/, '')}`);
        } catch (error: any) {
            console.error('❌ Order creation failed:', error);
            
            // 优化:详细的错误处理
            let errorMessage = 'Could not create order';
            if (error.message?.includes('inventory') || error.message?.includes('stock')) {
                errorMessage = 'Some items are out of stock. Please update your cart.';
            } else if (error.message?.includes('coupon') || error.message?.includes('discount')) {
                errorMessage = 'Coupon is invalid or expired. Please remove it and try again.';
            } else if (error.message?.includes('email')) {
                errorMessage = 'Please check your email address.';
            }
            
            showToast('error', 'Order Failed', errorMessage);
            setHasSubmitted(false); // 允许重试
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (!isClient || isLoading || cartLoading) {
        return <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>;
    }

    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your bag is empty</h2>
                    <button onClick={() => router.push('/collections/all')} className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold mt-4">Start Shopping</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 w-full max-w-[100vw] overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-6xl w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-['Playfair_Display']">Checkout</h1>
                    {!isLoggedIn && (
                        <button onClick={() => openAuthModal('login')} className="text-sm font-medium text-black underline flex items-center gap-2 hover:text-gray-600">
                            <User size={16} /> Already have an account? Sign in
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 w-full">
                    <div className="lg:col-span-7 w-full">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-8 lg:p-10">
                            <ShippingForm
                                shippingAddress={shippingAddress}
                                updateShippingAddress={updateShippingAddress}
                                billingAddress={billingAddress}
                                setBillingAddress={setBillingAddress}
                                isBillingSameAsShipping={isBillingSameAsShipping}
                                setIsBillingSameAsShipping={setIsBillingSameAsShipping}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-6 w-full">
                        <OrderSummary orderItems={orderItems} subtotal={subtotal} shipping={shippingFee} discount={discountAmount} total={total} appliedCoupon={appliedCoupon} />
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 w-full">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} /> Gift Card or Discount Code</h3>
                            <div className="flex gap-2">
                                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter code" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-all uppercase" disabled={!!appliedCoupon} />
                                {appliedCoupon ? (
                                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="bg-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-bold">Remove</button>
                                ) : (
                                    <button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode} className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 min-w-[70px]">
                                        {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply'}
                                    </button>
                                )}
                            </div>
                            {appliedCoupon && <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1"><Tag size={12} /> Code <strong>{appliedCoupon.code}</strong>: {appliedCoupon.description}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}