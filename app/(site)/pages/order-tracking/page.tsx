// app/pages/order-tracking/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Search, Loader2, Package, Truck, CheckCircle2, Clock,
    AlertCircle, ExternalLink, Hourglass, MapPin
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order';

// 订单主流程状态枚举
const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

function TrackingContent() {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderResponse | null>(null);
    const [error, setError] = useState('');

    const [formOrderNumber, setFormOrderNumber] = useState('');
    const [formEmail, setFormEmail] = useState('');

    const executeTracking = async (orderNum: string, emailStr: string) => {
        setIsLoading(true);
        setError('');
        setOrderData(null);

        try {
            const data = await orderService.trackOrder(orderNum, emailStr);
            console.log('order: ', data)
            setOrderData(data);
        } catch (err: any) {
            setError(err.message || 'Order not found. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const urlOrderNum = searchParams.get('orderNumber');
        const urlEmail = searchParams.get('email');

        if (urlOrderNum) setFormOrderNumber(urlOrderNum);
        if (urlEmail) setFormEmail(urlEmail);

        if (urlOrderNum && urlEmail) {
            executeTracking(urlOrderNum, urlEmail);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await executeTracking(formOrderNumber, formEmail);
    };

    const getCurrentStepIndex = (status: string) => {
        const index = STATUS_STEPS.findIndex(s => s.key === status);
        // 如果是 COMPLETED，也视为 DELIVERED 的最后一步
        if (status === 'COMPLETED') return 3;
        return index === -1 ? 0 : index;
    };

    const displayOrderNumber = orderData?.orderNumber?.replace(/^#/, '') || '';

    // 燕文官方查询前台链接
    const trackingUrl = orderData?.trackingNumber
        ? `https://t.17track.net/en#nums=${orderData.trackingNumber}`
        : '#';

    // 格式化时间的辅助函数
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">Track Your Order</h1>
                    <p className="text-gray-500">Enter your order number and email to see the real-time logistics status.</p>
                </div>

                {/* 搜索表单 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Order Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MT2512345"
                                    value={formOrderNumber}
                                    onChange={(e) => setFormOrderNumber(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors font-mono"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
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

                {/* 错误提示 */}
                {error && (
                    <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 animate-in fade-in border border-red-100">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* 结果展示区 */}
                {orderData && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">

                        {/* 头部摘要 */}
                        <div className="bg-gray-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold font-['Playfair_Display']">Order #{displayOrderNumber}</h2>
                                <p className="text-gray-400 text-sm mt-1">Placed on {new Date(orderData.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 uppercase tracking-wide">
                                {orderData.status}
                            </span>
                        </div>

                        <div className="p-8 border-b border-gray-100">
                            {/* 顶部总体进度 */}
                            <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4">
                                {STATUS_STEPS.map((step, index) => {
                                    const currentIdx = getCurrentStepIndex(orderData.status);
                                    const isCompleted = index <= currentIdx;
                                    const isCurrent = index === currentIdx;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.key} className="flex-1 flex flex-col items-center min-w-[100px] relative">
                                            {/* 连接线 */}
                                            {index < STATUS_STEPS.length - 1 && (
                                                <div className={`absolute top-6 left-1/2 w-full h-1 -mt-0.5 z-0 ${index < currentIdx ? 'bg-black' : 'bg-gray-100'}`} />
                                            )}

                                            <div className={`
                                                relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 mb-3
                                                ${isCompleted ? 'bg-black border-white text-white shadow-md' : 'bg-white border-gray-100 text-gray-300'}
                                                ${isCurrent ? 'ring-4 ring-green-100 border-green-500 bg-green-500 text-white scale-110' : ''}
                                            `}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider text-center ${isCurrent ? 'text-green-600' : (isCompleted ? 'text-gray-900' : 'text-gray-400')}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 👇 实时物流轨迹详情 (仅在后端返回 logistics 对象且有 checkpoints 时显示) */}
                            {orderData.logistics && orderData.logistics.checkpoints && orderData.logistics.checkpoints.length > 0 && (
                                <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Live Tracking Updates</h3>
                                        {/* 燕文状态级别，1: 查询不到, 2: 揽收, 3: 运输, 4: 派送, 6: 签收 */}
                                        {orderData.logistics.statusLevel === 3 && <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold animate-pulse">In Transit</span>}
                                        {orderData.logistics.statusLevel === 4 && <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">Out for Delivery</span>}
                                        {orderData.logistics.statusLevel === 6 && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Delivered</span>}
                                    </div>

                                    <div className="space-y-6 relative pl-4 md:pl-32">
                                        {/* 垂直时间轴线 */}
                                        <div className="absolute left-[21px] md:left-[118px] top-2 bottom-4 w-0.5 bg-gray-200"></div>

                                        {orderData.logistics.checkpoints.map((cp, idx) => {
                                            const isLatest = idx === 0; // 假设后端已经按照倒序(最新在前)排列
                                            const { date, time } = formatDate(cp.timestamp);

                                            return (
                                                <div key={idx} className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${isLatest ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>

                                                    {/* 时间 (桌面端居左排版) */}
                                                    <div className="md:w-24 shrink-0 pt-1 text-left md:text-right flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-0">
                                                        <span className="text-sm font-bold text-gray-900">{date}</span>
                                                        <span className="text-xs text-gray-500 font-mono">{time}</span>
                                                    </div>

                                                    {/* 圆点指示器 */}
                                                    <div className="absolute left-0 md:left-[96px] top-1.5 z-10">
                                                        <div className={`w-3 h-3 rounded-full ring-4 ring-gray-50 ${isLatest ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                                                    </div>

                                                    {/* 内容卡片 */}
                                                    <div className={`flex-1 pb-6 ${idx !== orderData.logistics!.checkpoints.length - 1 ? 'border-b border-gray-100/50' : ''}`}>
                                                        <p className={`text-sm ${isLatest ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                            {cp.message}
                                                        </p>
                                                        {cp.location && (
                                                            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                                                                <MapPin size={12} />
                                                                <span>{cp.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 当已发货，但燕文还没扫件(或查不到轨迹)时 */}
                            {orderData.status === 'SHIPPED' && (!orderData.logistics || orderData.logistics.checkpoints.length === 0) && (
                                <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <Truck size={32} className="text-blue-400 mb-3" />
                                    <h4 className="font-bold text-blue-900 mb-1">Package is on the way</h4>
                                    <p className="text-sm text-blue-600/80 max-w-sm">
                                        Your package has been dispatched. Carrier scans may take 24-48 hours to appear here.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 详情与地址区块 */}
                        <div className="p-8 bg-gray-50/50 grid md:grid-cols-2 gap-8">
                            {/* 收货地址 */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Shipping To</h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-600 leading-relaxed shadow-sm h-full">
                                    <p className="font-bold text-gray-900 mb-2 text-base">
                                        {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                                    </p>
                                    <p>{orderData.shippingAddress.addressLine1}</p>
                                    {orderData.shippingAddress.addressLine2 && <p>{orderData.shippingAddress.addressLine2}</p>}
                                    <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</p>
                                    <p>{orderData.shippingAddress.country} {orderData.shippingAddress.zipCode}</p>
                                </div>
                            </div>

                            {/* 物流详情 */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Carrier Details</h3>
                                <div className="bg-white p-6 rounded-xl border border-gray-200 text-sm text-gray-600 leading-relaxed shadow-sm h-full flex flex-col justify-center">
                                    {orderData.trackingNumber ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tracking Number</p>
                                                <p className="font-mono text-lg font-bold text-gray-900 tracking-wide select-all">
                                                    {orderData.trackingNumber}
                                                </p>
                                            </div>

                                            <a
                                                href={trackingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#E11D48] transition-colors shadow-lg hover:-translate-y-0.5"
                                            >
                                                Track on 17Track <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-gray-900">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Hourglass size={16} className="text-gray-500" />
                                                </div>
                                                <span className="font-bold text-sm">Preparing Shipment</span>
                                            </div>
                                            <p className="text-xs text-gray-400 pl-11 leading-relaxed">
                                                Tracking info will update soon. Usually within 24 hours.
                                            </p>
                                        </div>
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

export default function OrderTrackingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
            <TrackingContent />
        </Suspense>
    );
}