// app/(site)/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import { getUserId } from '@/lib/user-utils';
import { getProductImageUrl } from '@/lib/image-utils';
import {
    Package, Truck, CheckCircle, Clock, Search,
    ArrowRight, AlertCircle, ShoppingBag, XCircle, CreditCard, RefreshCw
} from 'lucide-react';

// 状态映射配置 (包含所有9个状态)
const getStatusConfig = (status: string) => {
    const s = status?.toUpperCase() || 'PENDING';
    switch (s) {
        case 'COMPLETED':
            return { label: 'Completed', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100', action: 'view' };
        case 'DELIVERED':
            return { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100', action: 'view' };
        case 'SHIPPED':
            return { label: 'Shipped', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', action: 'track' };
        case 'PROCESSING':
            return { label: 'Processing', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', action: 'view' };
        case 'PAID':
            return { label: 'Paid', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', action: 'view' };
        case 'CANCELLED':
            return { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-100', action: 'reorder' };
        case 'REFUNDED':
            return { label: 'Refunded', icon: RefreshCw, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-100', action: 'reorder' };
        case 'EXPIRED':
            return { label: 'Expired', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100', action: 'reorder' };
        default: // PENDING
            return { label: 'Pending Payment', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100', action: 'pay' };
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError('');
            const userId = getUserId();
            if (!userId) {
                setOrders([]);
                return;
            }
            const data = await orderService.getUserOrders(userId, 20);
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setError('Unable to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    // 处理订单操作
    const handleOrderAction = (e: React.MouseEvent, order: OrderResponse, action: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (action === 'pay') {
            // 跳转到支付页面
            window.location.href = `/payment?orderId=${order.id}`;
        } else if (action === 'reorder') {
            // 重新购买逻辑
            // 这里可以根据需要实现重新购买功能
            console.log('Reorder order:', order.id);
            // 例如：router.push(`/cart?reorder=${order.id}`)
        } else if (action === 'track') {
            // 跳转到物流跟踪页面
            window.location.href = `/orders/${order.id}/tracking`;
        }
        // 'view' 动作保持原有链接行为
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 w-full overflow-x-hidden">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm font-medium tracking-wide">LOADING ORDERS...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">My Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">Track past purchases and returns</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Order #..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                        />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={fetchOrders} className="ml-auto text-xs underline font-bold">Retry</button>
                    </div>
                )}

                {/* Empty State */}
                {filteredOrders.length === 0 && !isLoading ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                            {searchTerm ? `We couldn't find any order matching "${searchTerm}"` : "You haven't placed any orders yet."}
                        </p>
                        <Link href="/collections/all" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-all shadow-md hover:-translate-y-0.5">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const status = getStatusConfig(order.status);
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={order.id}
                                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center flex-wrap gap-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-gray-900">#{order.orderNumber}</span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.color}`}>
                                            <StatusIcon size={12} strokeWidth={2.5} />
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        {/* Product Images Preview */}
                                        <div className="flex -space-x-3 overflow-hidden py-1 pl-1">
                                            {order.items.slice(0, 4).map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex-shrink-0"
                                                >
                                                    {item.productImage ? (
                                                        <Image
                                                            src={getProductImageUrl('', item.productImage)}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                                            {item.productTitle?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 4 && (
                                                <div className="w-14 h-14 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 line-clamp-1">
                                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                <CreditCard size={12} />
                                                <span>{order.paymentMethod?.replace(/_/g, ' ') || 'Credit Card'}</span>
                                            </div>
                                        </div>

                                        {/* Action Button & Price */}
                                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 mb-0.5">Total</p>
                                                <p className="font-bold text-lg text-gray-900">${order.finalAmount.toFixed(2)}</p>
                                            </div>

                                            {/* 根据状态显示操作按钮 */}
                                            {status.action === 'pay' && (
                                                <button
                                                    onClick={(e) => handleOrderAction(e, order, 'pay')}
                                                    className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
                                                >
                                                    Pay Now
                                                </button>
                                            )}

                                            {status.action === 'track' && (
                                                <button
                                                    onClick={(e) => handleOrderAction(e, order, 'track')}
                                                    className="px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                                                >
                                                    Track
                                                </button>
                                            )}

                                            {/* 查看详情链接 */}
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-colors"
                                            >
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}