// checkout/route.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
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

    // 所有 Hook 调用必须在顶部，不能有条件地调用
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItemRequest[]>([]);

    // 使用 AuthContext
    const { isLoggedIn, openAuthModal, isClient } = useAuth();

    // 使用 Zustand store
    const { cart, getCart, loading: cartLoading } = useCartStore();

    const {
        getShippingFormData
    } = useShipping({
        userEmail: getUserEmail(),
        userName: getUserFullName()
    });

    // console.log('Checkout auth state:', { isClient, isLoggedIn });

    // 初始化数据 - 这个 useEffect 必须始终存在
    useEffect(() => {
        const initializeCheckout = async () => {
            try {
                setIsLoading(true);

                // 检查用户登录状态 - 使用 AuthContext 的状态
                if (!isLoggedIn) {
                    console.log('User not logged in, opening auth modal...');
                    // 打开登录模态框，登录成功后返回当前页面
                    openAuthModal('login', {
                        onSuccess: () => {
                            console.log('Login successful, continuing checkout...');
                            // 登录成功后重新初始化结算页面
                            initializeCheckout();
                        }
                    });
                    return;
                }

                // console.log('User is logged in, fetching cart...');
                // 获取购物车数据
                await getCart();

            } catch (error) {
                console.error('Failed to initialize checkout:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        // 只有在客户端初始化完成后才执行
        if (isClient) {
            initializeCheckout();
        }
    }, [router, getCart, isLoggedIn, openAuthModal, isClient]);

    // 当购物车数据加载完成后，转换为订单商品
    useEffect(() => {
        if (cart?.items && cart.items.length > 0) {
            const convertedOrderItems: OrderItemRequest[] = cart.items.map(item => {
                if (!item.color || item.color.trim() === '') {
                    throw new Error(`product "${item.productTitle}" must have a color`);
                }
                return {
                    productId: item.productId,
                    productTitle: item.productTitle,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    productSku: item.productSku,
                    color: item.color,
                };
            });
            setOrderItems(convertedOrderItems);
        }
    }, [cart?.items]);

    // 计算总金额
    const calculateTotal = () => {
        const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const tax = subtotal * 0.08;
        return subtotal + tax;
    };

    // 处理继续到支付
    const handleProceedToPayment = async () => {
        setIsCreatingOrder(true);
        try {
            // 创建订单
            const orderResponse = await createOrder();

            if (orderResponse) {
                // 保存订单信息到localStorage，供支付页面使用
                const paymentData = {
                    orderId: orderResponse.id,
                    orderNumber: orderResponse.orderNumber,
                    totalAmount: orderResponse.finalAmount || calculateTotal(),
                    items: orderItems
                };

                localStorage.setItem('currentOrder', JSON.stringify(paymentData));
                useCartStore.getState().clearCart();

                // console.log('Order created, redirecting to payment...');

                // 跳转到支付页面，带上订单ID
                router.push(`/payment?orderId=${orderResponse.id}`);
            }
        } catch (error) {
            console.error('Failed to create order:', error);
            alert(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    // 创建订单
    const createOrder = async () => {
        const userId = getUserId();
        const cartId = getCartId();
        if (!userId) {
            alert('User information not found. Please login again.');
            return null;
        }

        if (!cartId) {
            alert('cart error, please contact support');
            return null;
        }

        // 检查是否有订单商品
        if (orderItems.length === 0) {
            alert('No items in order. Please add items to your cart first.');
            return null;
        }

        try {
            const formData = getShippingFormData();

            // 构建配送地址
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

            // 构建订单创建请求
            const orderCreateRequest: OrderCreateRequest = {
                userId: userId,
                cartId: cartId,
                items: orderItems,
                shippingAddress: shippingAddressRequest,
                paymentMethod: 'CREDIT_CARD',
                shippingMethod: 'STANDARD',
                customerNote: formData.orderNotes,
                shippingFee: 0,
                discountAmount: 0
            };

            // 使用 orderService 创建订单
            const result = await orderService.createOrder(orderCreateRequest);

            if (!result.success) {
                throw new Error(result.error || 'Order creation failed');
            }

            // console.log('Order created successfully:', result.data);
            return result.data;

        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    // 等待客户端初始化完成
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">正在加载...</p>
            </div>
        );
    }

    // 如果用户未登录，显示加载状态或登录提示
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">请先登录...</p>
            </div>
        );
    }

    // 空购物车状态
    if (orderItems.length === 0 && !isLoading && !cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400 text-6xl mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">您的购物车为空</h2>
                        <p className="text-gray-600 mb-8">请在结算前添加一些商品到购物车。</p>
                        <button
                            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            onClick={() => router.push('/collections')}
                        >
                            继续购物
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading || cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">正在加载结算页面...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 配送表单 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <ShippingForm
                                userEmail={getUserEmail()}
                                userName={getUserFullName()}
                                onProceedToPayment={handleProceedToPayment}
                                isCreatingOrder={isCreatingOrder}
                            />
                        </div>
                    </div>

                    {/* 订单摘要侧边栏 */}
                    <div className="lg:col-span-1">
                        <OrderSummary orderItems={orderItems} />
                    </div>
                </div>
            </div>
        </div>
    );
}