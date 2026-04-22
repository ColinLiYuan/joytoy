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
    ArrowRight, AlertCircle, ShoppingBag, XCircle, CreditCard, ChevronRight, RefreshCw, Archive
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants/site-config';
import { useAuth } from '@/contexts/authContext';

// ✅ 严格按照后端枚举映射状态
const getStatusConfig = (status: string) => {
    const s = status?.toUpperCase() || 'PENDING';
    switch (s) {
        case 'PENDING':
            return { label: 'Pending Payment', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', action: 'pay' };

        case 'PAID':
            return { label: 'Paid', icon: CheckCircle, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', action: 'view' };

        case 'PROCESSING':
            return { label: 'Processing', icon: Package, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100', action: 'view' };

        case 'SHIPPED':
            return { label: 'Shipped', icon: Truck, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-100', action: 'track' };

        case 'DELIVERED':
            return { label: 'Delivered', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50 border-green-100', action: 'view' };

        case 'COMPLETED':
            return { label: 'Completed', icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', action: 'reorder' };

        case 'CANCELLED':
            return { label: 'Cancelled', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50 border-red-100', action: 'view' };

        case 'REFUNDED':
            return { label: 'Refunded', icon: RefreshCw, color: 'text-gray-700', bg: 'bg-gray-100 border-gray-200', action: 'view' };

        case 'EXPIRED':
            return { label: 'Expired', icon: Archive, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100', action: 'view' };

        default:
            return { label: s, icon: Clock, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', action: 'view' };
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string>('');
    const [isAuthRequired, setIsAuthRequired] = useState(false);
    const { isLoggedIn, isClient, openAuthModal } = useAuth();

    useEffect(() => {
        console.log('[OrdersPage] Component mounted, fetching orders...');
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        console.log('[OrdersPage] fetchOrders called');
        try {
            setIsLoading(true);
            setError('');
            setIsAuthRequired(false);
            
            console.log('[OrdersPage] Calling orderService.getUserOrders()...');
            // ✅ 直接调用接口，让后端根据 Token 判断
            const data = await orderService.getUserOrders(0, 20);
            console.log('[OrdersPage] Got response from orderService:', data)
            
            // 如果返回 null，说明 session 过期或未登录
            if (data === null) {
                setIsAuthRequired(true);
                setOrders([]);
                return;
            }
            
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setError('Unable to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsAuthRequired(false);
        fetchOrders();
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const handleAction = (e: React.MouseEvent, order: OrderResponse, action: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (action === 'pay') {
            window.location.href = `/payment?orderNumber=${order.orderNumber}`;
        } else if (action === 'track') {
            // ✅ 跳转到订单追踪页面，自动带上订单号和邮箱
            const email = order.guestEmail || '';
            window.location.href = `/pages/order-tracking?orderNumber=${order.orderNumber}&email=${encodeURIComponent(email)}`;
        }
        // 其他状态保持默认跳转
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center w-full max-w-full overflow-x-hidden">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">{SITE_CONFIG.pages.orders.title.split('|')[0].trim()}</h1>
                        <p className="text-gray-500 text-sm mt-1">Track past purchases and returns</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search Order #"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all shadow-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {/* Empty State */}
                {isAuthRequired ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Please Login</h3>
                        <p className="text-gray-500 text-sm mb-6">You need to login to view your orders</p>
                        <button
                            onClick={() => openAuthModal('login', { onSuccess: handleLoginSuccess })}
                            className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                        >
                            Login to Continue
                        </button>
                    </div>
                ) : filteredOrders.length === 0 && !isLoading ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{SITE_CONFIG.pages.orders.emptyTitle}</h3>
                        <p className="text-gray-500 text-sm mb-6">{SITE_CONFIG.pages.orders.emptyDescription}</p>
                        <Link href="/collections/all" className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const status = getStatusConfig(order.status);
                            const StatusIcon = status.icon;
                            const firstItem = order.items[0];

                            return (
                                <Link
                                    href={`/orders/${order.orderNumber}`}
                                    key={order.orderNumber}
                                    className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Top Bar */}
                                    <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-gray-900">#{order.orderNumber}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${status.bg} ${status.color}`}>
                                            <StatusIcon size={12} strokeWidth={2.5} />
                                            {status.label}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">

                                        {/* Left: Product Info */}
                                        <div className="flex gap-4 flex-1">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-100 group-hover:border-gray-300 transition-colors">
                                                {firstItem?.productImage ? (
                                                    <Image
                                                        src={getProductImageUrl('', firstItem.productImage)}
                                                        alt="Product"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <Package size={24} />
                                                    </div>
                                                )}
                                                {order.items.length > 1 && (
                                                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md font-bold">
                                                        +{order.items.length - 1}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col justify-center min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-pink-600 transition-colors">
                                                    {firstItem?.productTitle || 'Unknown Item'}
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit">
                                                    <CreditCard size={12} />
                                                    <span className="capitalize">{order.paymentMethod?.replace(/_/g, ' ').toLowerCase() || 'Card'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Price & Actions */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:pl-6 md:border-l md:border-gray-100 md:min-w-[140px]">
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Total</p>
                                                <p className="font-bold text-lg text-gray-900">${order.finalAmount.toFixed(2)}</p>
                                            </div>

                                            {(status.action === 'pay' || status.action === 'track') ? (
                                                <button
                                                    onClick={(e) => handleAction(e, order, status.action)}
                                                    className={`
                                                        px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm
                                                        ${status.action === 'pay'
                                                        ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                    }
                                                    `}
                                                >
                                                    {status.action === 'pay' ? 'Pay Now' : 'Track'}
                                                </button>
                                            ) : (
                                                <div className="hidden md:flex items-center text-sm font-bold text-gray-400 gap-1 group-hover:text-black transition-colors">
                                                    Details <ChevronRight size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}