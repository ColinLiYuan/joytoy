// app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';
import { getUserId } from '@/lib/user-utils';
import {
    Box, Truck, CheckCircle, XCircle, Clock, Search, Filter,
    Eye, Receipt, CreditCard, Package, Loader2
} from 'lucide-react'; // ✅ Lucide

// Lucide Icons for status
const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    'PENDING': { label: 'Pending', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-100' },
    'CONFIRMED': { label: 'Confirmed', icon: Receipt, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },
    'PROCESSING': { label: 'Processing', icon: Box, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-100' },
    'SHIPPED': { label: 'Shipped', icon: Truck, color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-100' },
    'DELIVERED': { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50 border-green-100' },
    'CANCELLED': { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50 border-red-100' }
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
            const orderResponse = await orderService.getUserOrders(userId, 20);
            setOrders(orderResponse);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
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
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-2">My Orders</h1>
                        <p className="text-gray-500">Track and manage your purchases</p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={fetchOrders} className="text-sm underline font-bold">Retry</button>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search order number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="relative w-full md:w-48">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            {Object.entries(statusConfig).map(([status, config]) => (
                                <option key={status} value={status}>{config.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="text-gray-400 w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No orders match your search' : 'No orders yet'}
                            </h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                            {!searchTerm && statusFilter === 'all' && (
                                <Link href="/collections/all" className="inline-block bg-black text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                    Start Shopping
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredOrders.map((order) => {
                            const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">

                                            {/* Order Info */}
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <h3 className="text-lg font-bold text-gray-900">#{order.orderNumber}</h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bgColor} ${statusInfo.color}`}>
                                                        <StatusIcon size={12} />
                                                        {statusInfo.label}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 block mb-1">Date</span>
                                                        <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block mb-1">Total</span>
                                                        <span className="font-bold text-gray-900">${order.finalAmount?.toFixed(2)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block mb-1">Payment</span>
                                                        <span className="flex items-center gap-1.5 font-medium text-gray-900">
                                                            <CreditCard size={14} className="text-gray-400" />
                                                            {order.paymentMethod.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium rounded-xl transition-colors border border-gray-200"
                                                >
                                                    <Eye size={16} />
                                                    Details
                                                </Link>
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