// app/(site)/orders/[orderNumber]/route.ts
'use client';

import { Suspense, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import { getProductImageUrl } from '@/lib/image-utils';
import { getUserId } from '@/lib/user-utils';
import Image from 'next/image';
import {
    Loader2,
    ArrowLeft,
    CheckCircle2,
    Package,
    MapPin,
    Calendar,
    ShieldCheck,
    CreditCard,
    Receipt,
    XCircle
} from 'lucide-react';

function OrderDetailsContent({ params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = use(params);
    const searchParams = useSearchParams();
    const isJustPaid = searchParams.get('payment_success') === '1';

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // ✅ 先检查是否登录（跟订单列表一样）
                const userId = getUserId();
                if (!userId) {
                    console.log('[Order Detail] User not logged in, redirecting to orders page');
                    setAuthError(true);
                    setIsLoading(false);
                    return;
                }

                let data = null;
                
                // ✅ 先尝试从 localStorage 获取（游客模式）
                const savedOrder = localStorage.getItem('currentOrder');
                if (savedOrder) {
                    const parsed = JSON.parse(savedOrder);
                    if (parsed.orderNumber === orderNumber || parsed.orderNumber === `#${orderNumber}`) {
                        console.log('[Order Detail] Found order in localStorage');
                        data = parsed;
                    }
                }
                
                // ✅ 如果 localStorage 没有或订单号不匹配，调用 API
                if (!data) {
                    console.log('[Order Detail] Fetching order from API...');
                    data = await orderService.getOrder(orderNumber);
                }
                
                console.log('📦 Order Detail Data:', data);
                
                if (!data) {
                    console.error('⚠️ Order data is null');
                    setOrder(null);
                    return;
                }
                
                console.log('📦 First Item:', data.items?.[0]);
                setOrder(data);

                // 计算商品小计
                const calculatedSubtotal = data.items.reduce((total: number, item: any) => {
                    return total + (item.unitPrice * (item.quantity || 1));
                }, 0);
                setSubtotal(calculatedSubtotal);
            } catch (error: any) {
                console.error('Failed to load order:', error);
                console.log('[Order Detail] Error response status:', error.response?.status);
                console.log('[Order Detail] Error message:', error.message);
                
                // 检测是否是认证错误
                if (error.message?.includes('请先登录') || error.message?.includes('login') || error.response?.status === 401) {
                    console.log('[Order Detail] Auth error detected, trying localStorage...');
                    
                    // ✅ 尝试从 localStorage 恢复
                    const savedOrder = localStorage.getItem('currentOrder');
                    console.log('[Order Detail] localStorage currentOrder:', savedOrder ? 'exists' : 'not found');
                    
                    if (savedOrder) {
                        const parsed = JSON.parse(savedOrder);
                        console.log('[Order Detail] Parsed order number:', parsed.orderNumber, 'vs requested:', orderNumber);
                        
                        if (parsed.orderNumber === orderNumber || parsed.orderNumber === `#${orderNumber}`) {
                            console.log('[Order Detail] Using localStorage order due to auth error');
                            setOrder(parsed);
                            const calculatedSubtotal = parsed.items.reduce((total: number, item: any) => {
                                return total + (item.unitPrice * (item.quantity || 1));
                            }, 0);
                            setSubtotal(calculatedSubtotal);
                            return;
                        } else {
                            console.log('[Order Detail] Order number mismatch, cannot use localStorage');
                        }
                    }
                    setAuthError(true);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full max-w-full overflow-x-hidden">
                <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 w-full max-w-full overflow-x-hidden">
                {authError ? (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                        <p className="text-gray-600 mb-4">You need to login to view order details.</p>
                        <Link href="/orders" className="text-pink-600 hover:underline">Return to My Orders</Link>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <Link href="/orders" className="text-pink-600 hover:underline">Return to My Orders</Link>
                    </>
                )}
            </div>
        );
    }

    // 格式化日期
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // 获取收货地址
    const shippingAddress = (order as any).shippingAddress || {
        firstName: 'Guest', lastName: '', addressLine1: 'Address not available', city: '', country: '', zipCode: ''
    };

    // 金额验证（可选，用于开发调试）
    const calculatedTotal = subtotal + (order.shippingFee || 0) - (order.discountAmount || 0);
    const isConsistent = Math.abs(calculatedTotal - order.finalAmount) < 0.01;

    return (
        <div className="min-h-screen bg-gray-50 py-12 w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* 顶部返回导航 */}
                <div className="mb-8">
                    <Link href="/orders" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Orders
                    </Link>
                </div>

                {/* ✅ 支付成功后的感谢横幅 */}
                {isJustPaid && (
                    <div className="bg-green-600 text-white rounded-3xl p-8 mb-8 text-center shadow-lg animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2">Thank You!</h1>
                        <p className="text-green-50 text-lg">Your order #{order.orderNumber} has been confirmed.</p>
                        {shippingAddress.email && (
                            <p className="text-green-100 text-sm mt-4 bg-green-700/50 inline-block px-4 py-1.5 rounded-full">
                                A confirmation email has been sent to {shippingAddress.email}
                            </p>
                        )}
                    </div>
                )}

                {/* 金额验证提示（仅开发环境或当不一致时显示） */}
                {!isConsistent && process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                        <div className="font-bold mb-1">💰 Amount Calculation Note:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Items Subtotal: ${subtotal.toFixed(2)}</div>
                            <div>+ Shipping: ${order.shippingFee.toFixed(2)}</div>
                            {order.discountAmount > 0 && (
                                <div>- Discount: ${order.discountAmount.toFixed(2)}</div>
                            )}
                            <div className="font-bold">Calculated: ${calculatedTotal.toFixed(2)}</div>
                            <div className="font-bold">API Final: ${order.finalAmount.toFixed(2)}</div>
                        </div>
                    </div>
                )}

                {/* 主卡片 */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Number</p>
                            <h2 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">#{order.orderNumber}</h2>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Calendar size={14} /> {formattedDate}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wide border 
                                ${order.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* 商品列表 */}
                        <div className="mb-10">
                            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                                <Package size={20} className="text-pink-600" /> Items
                            </h3>
                            <div className="space-y-6">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                            {item.productImage ? (
                                                <Image
                                                    src={getProductImageUrl('', item.productImage)}
                                                    alt={item.productTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">
                                                    {item.productTitle.charAt(0)}
                                                </div>
                                            )}
                                            <span className="absolute bottom-0 right-0 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                                                x{item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 line-clamp-2">{item.productTitle}</p>
                                            {item.color && (
                                                <p className="text-sm text-gray-500 mt-1 capitalize">Color: {item.color}</p>
                                            )}
                                            <p className="text-xs text-gray-400 mt-0.5">SKU: {item.productSku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-lg">
                                                ${(item.unitPrice * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${item.unitPrice.toFixed(2)} × {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10 border-t border-gray-100 pt-8">

                            {/* 左侧：配送信息 */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin size={20} className="text-gray-400" /> Shipping Details
                                </h3>
                                <div className="bg-gray-50 rounded-2xl p-6 text-sm text-gray-600 leading-relaxed border border-gray-100">
                                    <p className="font-bold text-gray-900 mb-1">
                                        {shippingAddress.firstName} {shippingAddress.lastName}
                                    </p>
                                    <p>{shippingAddress.addressLine1}</p>
                                    {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                    <p>
                                        {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zipCode}
                                    </p>
                                    <p>{shippingAddress.country}</p>
                                    {shippingAddress.phone && (
                                        <p className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
                                            Phone: {shippingAddress.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 右侧：支付摘要 */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Receipt size={20} className="text-gray-400" /> Payment Summary
                                </h3>
                                <div className="space-y-3 text-sm mb-6">
                                    {/* 商品小计 */}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({order.items.length} items)</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>

                                    {/* 运费 */}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <div className="text-right">
                                            {order.shippingFee > 0 ? (
                                                <span className="text-green-600 font-medium">
                                                    ${order.shippingFee.toFixed(2)}
                                                </span>
                                            ) : (
                                                <span className="text-green-600 font-medium">Free & Discreet</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 折扣 */}
                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between text-pink-600">
                                            <span>Discount</span>
                                            <span>-${order.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {/* 总计 */}
                                    <div className="flex justify-between font-bold text-gray-900 text-xl border-t border-gray-100 pt-3 mt-1">
                                        <span>Total</span>
                                        <div className="text-right">
                                            <div>${order.finalAmount.toFixed(2)}</div>
                                            {!isConsistent && (
                                                <div className="text-xs text-gray-400">
                                                    (Adjusted during checkout)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ 支付方式 & 隐私账单提示 */}
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard size={16} className="text-blue-900" />
                                        <span className="font-bold text-blue-900 text-sm">
                                            Paid via {order.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Credit Card'}
                                        </span>
                                    </div>

                                    {/* 隐私安抚文案 */}
                                    <div className="flex gap-2 items-start mt-3 pt-3 border-t border-blue-100/50">
                                        <ShieldCheck size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-blue-800/70 leading-relaxed">
                                            <strong>Privacy Note:</strong> This charge will appear discreetly as
                                            <span className="font-mono bg-white px-1 py-0.5 rounded mx-1 text-black border border-blue-100">M-Tech Global</span>
                                            (or similar generic name) on your bank statement. No product details are listed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部操作区 */}
                <div className="flex justify-between items-center mt-8 mb-12">
                    <Link href="/orders" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                        <ArrowLeft size={16} /> Back to Orders
                    </Link>
                    
                    {order.status?.toUpperCase() === 'PENDING' && (
                        <button
                            onClick={async () => {
                                if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                                    try {
                                        await orderService.cancelOrder(order.orderNumber);
                                        alert('Order cancelled successfully.');
                                        window.location.reload();
                                    } catch (error: any) {
                                        alert(error.message || 'Failed to cancel order');
                                    }
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                        >
                            <XCircle size={16} />
                            Cancel Order
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function OrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full max-w-full overflow-x-hidden">
                <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
            </div>
        }>
            <OrderDetailsContent params={params} />
        </Suspense>
    );
}