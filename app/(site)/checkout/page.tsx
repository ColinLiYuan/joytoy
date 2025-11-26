// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, Tag } from 'lucide-react'; // ✅ Tag for coupon
import ShippingForm from './shipping';
import OrderSummary from './orderSummary';
import { useShipping } from '@/hooks/useShipping';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderItemRequest, AddressRequest } from '@/types/order';
import { getUserFullName, getUserEmail, getUserId, getCartId } from '@/lib/user-utils';
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

    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                if (!isLoggedIn) { openAuthModal('login', { onSuccess: () => init() }); return; }
                await getCart();
            } catch (e) { console.error(e); router.push('/'); } finally { setIsLoading(false); }
        };
        if (isClient) init();
    }, [router, getCart, isLoggedIn, openAuthModal, isClient]);

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
                alert('Coupon Applied!');
            } else {
                alert('Invalid Code');
                setDiscountAmount(0);
            }
            setIsApplyingCoupon(false);
        }, 500);
    };

    // Create Order
    const handleProceedToPayment = async () => {
        setIsCreatingOrder(true);
        try {
            const userId = getUserId();
            const cartId = getCartId();
            if (!userId || !cartId) throw new Error('Session Error');

            const formData = getShippingFormData();
            const orderData: OrderCreateRequest = {
                userId, cartId, items: orderItems,
                shippingAddress: { ...formData.shippingAddress, addressLine2: formData.shippingAddress.addressLine2 || '' },
                paymentMethod: 'CREDIT_CARD', shippingMethod: 'STANDARD', customerNote: formData.orderNotes,
                shippingFee, discountAmount
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
        } catch (e) { alert('Order Failed'); } finally { setIsCreatingOrder(false); }
    };

    if (!isClient || isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 font-['Playfair_Display']">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <ShippingForm
                                userEmail={getUserEmail()} userName={getUserFullName()}
                                onProceedToPayment={handleProceedToPayment} isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    {/* Right: Summary & Coupon */}
                    <div className="lg:col-span-5 space-y-6">
                        <OrderSummary
                            orderItems={orderItems}
                            discount={discountAmount}
                            shipping={shippingFee}
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
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black uppercase"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon || !couponCode}
                                    className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isApplyingCoupon ? '...' : 'Apply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}