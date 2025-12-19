'use client';

import { useState } from 'react';
import { Search, Loader2, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { orderService } from '@/services/orderService';

// 订单状态枚举 (根据你后端实际情况修改)
const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTracking() {
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setOrderData(null);

        const formData = new FormData(e.currentTarget);
        const orderNumber = formData.get('orderNumber') as string;
        const email = formData.get('email') as string;

        try {
            // ✅ 调用 Service 查询
            const data = await orderService.trackGuestOrder(orderNumber, email);
            console.log('tracking order page: ', data)
            setOrderData(data);
        } catch (err: any) {
            setError(err.message || 'Order not found. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    // 辅助函数：判断进度条状态
    const getCurrentStepIndex = (status: string) => {
        const index = STATUS_STEPS.findIndex(s => s.key === status);
        return index === -1 ? 0 : index; // 如果是 CANCELLED 或其他，默认0
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">Track Your Order</h1>
                    <p className="text-gray-500">Enter your order number and email to see the latest status.</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="orderNumber" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order Number</label>
                                <input
                                    name="orderNumber"
                                    type="text"
                                    placeholder="e.g. #MYT2512345"
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-[#E11D48] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Track Order</>}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 animate-in fade-in">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Result Section */}
                {orderData && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">

                        {/* Header */}
                        <div className="bg-gray-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold font-['Playfair_Display']">Order #{orderData.orderNumber}</h2>
                                <p className="text-gray-400 text-sm mt-1">Placed on {new Date(orderData.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold border border-white/20">
                                {orderData.status}
                            </span>
                        </div>

                        {/* Tracking Timeline (Vertical) */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Shipment Progress</h3>

                            <div className="space-y-8 relative pl-4">
                                {/* Vertical Line */}
                                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-100"></div>

                                {STATUS_STEPS.map((step, index) => {
                                    const currentIdx = getCurrentStepIndex(orderData.status);
                                    const isCompleted = index <= currentIdx;
                                    const isCurrent = index === currentIdx;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.key} className={`relative flex items-center gap-6 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`
                                                relative z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                                ${isCompleted ? 'bg-black border-gray-100 text-white' : 'bg-white border-gray-100 text-gray-300'}
                                                ${isCurrent ? 'ring-4 ring-green-100 border-green-500 bg-green-500 text-white scale-110' : ''}
                                            `}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-lg ${isCurrent ? 'text-green-600' : 'text-gray-900'}`}>{step.label}</h4>
                                                {isCurrent && <p className="text-xs text-gray-500 mt-1">Current Status</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items & Address Summary */}
                        <div className="p-8 bg-gray-50/50 grid md:grid-cols-2 gap-8">
                            {/* Address */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Shipping To</h3>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 text-sm text-gray-600 leading-relaxed">
                                    <p className="font-bold text-gray-900 mb-1">
                                        {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                                    </p>
                                    <p>{orderData.shippingAddress.addressLine1}</p>
                                    <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</p>
                                    <p>{orderData.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Carrier Info */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Carrier Details</h3>
                                <div className="bg-white p-5 rounded-xl border border-gray-200 text-sm text-gray-600 leading-relaxed">
                                    <p className="mb-2"><strong>Method:</strong> {orderData.shippingMethod}</p>
                                    {orderData.trackingNumber ? (
                                        <>
                                            <p className="mb-1"><strong>Tracking #:</strong> {orderData.trackingNumber}</p>
                                            <a href="#" className="text-blue-600 underline hover:text-blue-800 text-xs">Track on Carrier Site</a>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 italic">Tracking number pending...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}