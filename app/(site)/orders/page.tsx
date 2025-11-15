// app/orders/route.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrderSummary } from '@/types/order';
import './order.css';
import { orderService } from '@/services/orderService';
import { OrderCreateRequest, OrderResponse } from '@/types/order';
import { getUserId } from '@/lib/user-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBox,
    faTruck,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faSearch,
    faFilter,
    faEye,
    faReceipt,
    faCreditCard,
    faTruckLoading
} from '@fortawesome/free-solid-svg-icons';

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    'PENDING': {
        label: 'Pending',
        icon: faClock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200'
    },
    'CONFIRMED': {
        label: 'Confirmed',
        icon: faReceipt,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200'
    },
    'PROCESSING': {
        label: 'Processing',
        icon: faBox,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200'
    },
    'SHIPPED': {
        label: 'Shipped',
        icon: faTruck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200'
    },
    'DELIVERED': {
        label: 'Delivered',
        icon: faCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
    },
    'CANCELLED': {
        label: 'Cancelled',
        icon: faTimesCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
    }
};

const paymentMethodConfig: Record<string, { label: string; icon: any }> = {
    'CREDIT_CARD': { label: 'Credit Card', icon: faCreditCard },
    'PAYPAL': { label: 'PayPal', icon: faCreditCard },
    'STRIPE': { label: 'Stripe', icon: faCreditCard }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError('');
            const userId = getUserId();

            if (userId === null) {
                setOrders([]);
                return;
            }

            const orderResponse: OrderResponse[] = await orderService.getUserOrders(userId, 20);
            setOrders(orderResponse);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('加载订单时发生意外错误');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">View and manage your orders</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                            {error}
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Search by order number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">All Status</option>
                                    {Object.entries(statusConfig).map(([status, config]) => (
                                        <option key={status} value={status}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <FontAwesomeIcon icon={faBox} className="text-gray-300 text-4xl mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'You haven\'t placed any orders yet'
                                }
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                                <Link
                                    href="/collections"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
                            const paymentInfo = paymentMethodConfig[order.paymentMethod] || { label: order.paymentMethod, icon: faCreditCard };

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border`}>
                                                        <FontAwesomeIcon icon={statusInfo.icon} className="w-3 h-3 mr-1" />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Placed on:</span>
                                                        <br />
                                                        {formatDate(order.createdAt)}
                                                    </div>
                                                    {/*<div>*/}
                                                    {/*    <span className="font-medium">Items:</span>*/}
                                                    {/*    <br />*/}
                                                    {/*    {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}*/}
                                                    {/*</div>*/}
                                                    <div>
                                                        <span className="font-medium">Payment:</span>
                                                        <br />
                                                        <span className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={paymentInfo.icon} className="w-3 h-3" />
                                                            {paymentInfo.label}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Total Amount:</span>
                                                        <br />
                                                        <span className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(order.finalAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Link>
                                                {order.status === 'DELIVERED' && (
                                                    <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                        Reorder
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}