// app/orders/[id]/route.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrderResponse } from '@/types/order';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faBox,
    faTruck,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faReceipt,
    faCreditCard,
    faUser,
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
    faDownload,
    faPrint,
    faShoppingBag
} from '@fortawesome/free-solid-svg-icons';

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string; description: string }> = {
    'PENDING': {
        label: 'Pending',
        icon: faClock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        description: 'Your order is being processed'
    },
    'CONFIRMED': {
        label: 'Confirmed',
        icon: faReceipt,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        description: 'Order has been confirmed'
    },
    'PROCESSING': {
        label: 'Processing',
        icon: faBox,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 border-purple-200',
        description: 'Your items are being prepared for shipment'
    },
    'SHIPPED': {
        label: 'Shipped',
        icon: faTruck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
        description: 'Your order is on the way'
    },
    'DELIVERED': {
        label: 'Delivered',
        icon: faCheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        description: 'Order has been delivered'
    },
    'CANCELLED': {
        label: 'Cancelled',
        icon: faTimesCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        description: 'Order has been cancelled'
    }
};

const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const orderId = params.id as string;

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setIsLoading(true);
            setError('');

            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const orderData = await response.json();
                setOrder(orderData);
            } else if (response.status === 404) {
                setError('Order not found');
            } else {
                setError('Failed to load order details');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setError('An error occurred while loading the order');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusStep = (status: string) => {
        return statusSteps.indexOf(status);
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-4xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Link
                            href="/orders"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
    const currentStep = getStatusStep(order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/orders"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order {order.orderNumber}
                            </h1>
                            <p className="text-gray-600">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <FontAwesomeIcon icon={faPrint} className="w-4 h-4 mr-2" />
                                Print
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                <FontAwesomeIcon icon={faDownload} className="w-4 h-4 mr-2" />
                                Invoice
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>

                            {/* Status Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border`}>
                                    <FontAwesomeIcon icon={statusInfo.icon} className="w-4 h-4 mr-2" />
                                    {statusInfo.label}
                                </span>
                                <p className="text-gray-600 text-sm">{statusInfo.description}</p>
                            </div>

                            {/* Progress Steps */}
                            <div className="relative">
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200"></div>
                                <div
                                    className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-500"
                                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                                ></div>

                                <div className="relative flex justify-between">
                                    {statusSteps.map((step, index) => {
                                        const stepConfig = statusConfig[step];
                                        const isCompleted = index <= currentStep;
                                        const isCurrent = index === currentStep;

                                        return (
                                            <div key={step} className="flex flex-col items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                                    isCompleted
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                                                    <FontAwesomeIcon
                                                        icon={stepConfig.icon}
                                                        className="w-3 h-3"
                                                    />
                                                </div>
                                                <span className={`text-xs mt-2 text-center ${
                                                    isCompleted ? 'text-blue-600 font-medium' : 'text-gray-500'
                                                }`}>
                                                    {stepConfig.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                                        <img
                                            src={item.productImage || '/images/placeholder-product.jpg'}
                                            alt={item.productTitle}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <Link
                                                href={item.productDetailUrl || '#'}
                                                className="font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {item.productTitle}
                                            </Link>
                                            <p className="text-sm text-gray-500">SKU: {item.productSku}</p>
                                            {item.stockStatus && (
                                                <span className={`inline-block text-xs px-2 py-1 rounded ${
                                                    item.stockStatus === 'In Stock'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.stockStatus}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.unitPrice)} × {item.quantity}
                                            </p>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {formatCurrency(item.totalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="font-medium text-green-600">
                                            -{formatCurrency(order.discountAmount)}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(order.finalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Actions</h2>
                            <div className="space-y-2">
                                {order.status === 'DELIVERED' && (
                                    <>
                                        <button className="w-full text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            Return Items
                                        </button>
                                        <button className="w-full text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            Write a Review
                                        </button>
                                    </>
                                )}
                                {order.status === 'SHIPPED' && (
                                    <button className="w-full text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        Track Package
                                    </button>
                                )}
                                <button className="w-full text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    Contact Support
                                </button>
                                <button className="w-full text-left py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    Reorder Items
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}