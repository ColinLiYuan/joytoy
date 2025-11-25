// app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react'; // ✅ Lucide
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

    const { isLoggedIn, openAuthModal, isClient } = useAuth();
    const { cart, getCart, loading: cartLoading } = useCartStore();

    const { getShippingFormData } = useShipping({
        userEmail: getUserEmail(),
        userName: getUserFullName()
    });

    useEffect(() => {
        const initializeCheckout = async () => {
            try {
                setIsLoading(true);
                if (!isLoggedIn) {
                    openAuthModal('login', {
                        onSuccess: () => initializeCheckout()
                    });
                    return;
                }
                await getCart();
            } catch (error) {
                console.error('Failed to initialize checkout:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        if (isClient) initializeCheckout();
    }, [router, getCart, isLoggedIn, openAuthModal, isClient]);

    useEffect(() => {
        if (cart?.items && cart.items.length > 0) {
            const convertedOrderItems: OrderItemRequest[] = cart.items.map(item => {
                if (!item.color || item.color.trim() === '') {
                    throw new Error(`Product "${item.productTitle}" must have a color`);
                }
                return {
                    productId: item.productId,
                    productTitle: item.productTitle,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    productSku: item.productSku,
                    productImage: item.productImage,
                    color: item.color,
                };
            });
            setOrderItems(convertedOrderItems);
        }
    }, [cart?.items]);

    const calculateTotal = () => {
        const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const tax = subtotal * 0.08;
        return subtotal + tax;
    };

    const handleProceedToPayment = async () => {
        setIsCreatingOrder(true);
        try {
            const orderResponse = await createOrder();
            if (orderResponse) {
                const paymentData = {
                    orderId: orderResponse.id,
                    orderNumber: orderResponse.orderNumber,
                    totalAmount: orderResponse.finalAmount || calculateTotal(),
                    items: orderItems
                };
                localStorage.setItem('currentOrder', JSON.stringify(paymentData));
                useCartStore.getState().clearCart();
                router.push(`/payment?orderId=${orderResponse.id}`);
            }
        } catch (error) {
            console.error('Failed to create order:', error);
            alert(`Order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const createOrder = async () => {
        const userId = getUserId();
        const cartId = getCartId();
        if (!userId || !cartId) {
            alert('Session expired. Please login again.');
            return null;
        }

        if (orderItems.length === 0) {
            alert('Your cart is empty.');
            return null;
        }

        try {
            const formData = getShippingFormData();
            const shippingAddressRequest: AddressRequest = {
                firstName: formData.shippingAddress.firstName,
                lastName: formData.shippingAddress.lastName,
                email: formData.shippingAddress.email,
                phone: formData.shippingAddress.phone,
                country: formData.shippingAddress.country,
                province: formData.shippingAddress.province,
                city: formData.shippingAddress.city,
                addressLine1: formData.shippingAddress.addressLine1,
                addressLine2: formData.shippingAddress.addressLine2 || '',
                zipCode: formData.shippingAddress.zipCode
            };

            const orderCreateRequest: OrderCreateRequest = {
                userId,
                cartId,
                items: orderItems,
                shippingAddress: shippingAddressRequest,
                paymentMethod: 'CREDIT_CARD',
                shippingMethod: 'STANDARD',
                customerNote: formData.orderNotes,
                shippingFee: 0,
                discountAmount: 0
            };

            const result = await orderService.createOrder(orderCreateRequest);
            if (!result.success) throw new Error(result.error || 'Order creation failed');
            return result.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    // Loading State
    if (!isClient || isLoading || cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
                <p className="text-sm font-medium tracking-wide">SECURE CHECKOUT LOADING...</p>
            </div>
        );
    }

    // Not Logged In State
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-black" />
                <p>Redirecting to login...</p>
            </div>
        );
    }

    // Empty Cart State
    if (orderItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">Your bag is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                    <button
                        className="w-full bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
                        onClick={() => router.push('/collections')}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 pt-8 md:pt-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 font-['Playfair_Display'] text-center md:text-left">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left: Shipping Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
                            <ShippingForm
                                userEmail={getUserEmail()}
                                userName={getUserFullName()}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    {/* Right: Order Summary (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-8">
                            <OrderSummary orderItems={orderItems} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}