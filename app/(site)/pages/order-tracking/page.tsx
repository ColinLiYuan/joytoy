// app/pages/order-tracking/route.ts
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2, Package, Truck, CheckCircle2, Clock, AlertCircle, Hourglass, MapPin, Copy } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { OrderResponse, LogisticsCheckpoint } from '@/types/order';

const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'PROCESSING', label: 'Processing', icon: Package },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

/**
 * ✅ 极致优化的物流数据清洗函数 (基于燕文真实轨迹深度定制)
 */
const curateCheckpoints = (rawCheckpoints: LogisticsCheckpoint[]): LogisticsCheckpoint[] => {
    if (!rawCheckpoints || rawCheckpoints.length === 0) return [];

    // ==========================================
    // 0. 强制按时间戳倒序排列（最新时间排最上面）
    // 修复燕文 API 整合多家物流商时导致的时间线乱序问题
    // ==========================================
    const sortedRaw = [...rawCheckpoints].sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    let curated: LogisticsCheckpoint[] = [];
    let lastMessage = "";

    for (const cp of sortedRaw) {
        let msg = cp.message || "";

        // ==========================================
        // 1. 黑名单机制 (直接隐藏掉毫无意义的内部流转节点)
        // ==========================================
        const hiddenKeywords = [
            "Consolidated package",
            "waybill",
            "Finished goods",
            "weighing",
            "Processing information input", // 隐藏：内部信息录入
            "Parcel data received",         // 隐藏：包裹数据接收
            "domestic terminal station",    // 隐藏：国内转运中心 (老外看了觉得还没出国)
            "Batch delivery to carrier",    // 隐藏：批量交接 (通常与交给本地快递重复)
            "End of the Exceptional case",
            "Package data received"
        ];

        if (hiddenKeywords.some(keyword => msg.toLowerCase().includes(keyword.toLowerCase()))) {
            continue;
        }

        // ==========================================
        // 2. 核心轨迹专业化翻译 (按物流生命周期替换)
        // ==========================================

        // --- 阶段 A: 卖家发货与头程揽收 ---
        if (msg.includes("Order processed by shipper")) {
            msg = "Shipping label created, awaiting carrier pickup";
        }
        else if (msg.includes("Shipping information received")) {
            msg = "Tracking details uploaded to local delivery partner";
        }
        else if (msg.includes("Yanwen Pickup Scan")) {
            msg = "Shipment received by international processing center";
        }
        else if (msg.includes("Yanwen facility - Inbound")) {
            msg = "Arrived at origin sorting facility";
        }
        else if (msg.includes("Yanwen facility - Outbound")) {
            msg = "Departed from origin sorting facility";
        }

        // --- 阶段 B: 出口与国际运输 ---
        else if (msg.includes("International shipment release - Export") || msg.includes("Customs clearance EDI - Export")) {
            msg = "Export customs clearance completed";
        }
        else if (msg.includes("Port of departure - Received by carrier")) {
            msg = "Arrived at origin export hub";
        }
        else if (msg.includes("Port of departure - Departure") || msg.includes("Flight departure")) {
            msg = "Departed from origin country (In transit to destination)";
        }

        // --- 阶段 C: 进口与清关 ---
        else if (msg.includes("Port of destination - Arrival") || msg.includes("Flight arrival")) {
            msg = "Arrived in destination country";
        }
        else if (msg.includes("International shipment release - Import") || msg.includes("Custom clearance completed")) {
            msg = "Import customs clearance completed";
        }

        // --- 阶段 D: 尾程本地派送 (原汁原味保留本地快递名称) ---
        else if (msg.includes("Pick up by local carrier")) {
            msg = "Handed over to local delivery partner";
        }
        else if (msg.includes("Parcel received by")) {
            // 保留本地快递接收状态
        }
        else if (msg.includes("assigned to a delivery driver")) {
            msg = "Assigned to a local delivery driver";
        }
        else if (msg.includes("Out for delivery")) {
            msg = "Out for delivery";
        }
        else if (msg.includes("Delivered")) {
            msg = "Delivered";
        }

        // ==========================================
        // 3. 去重逻辑 (防止相同状态连续刷屏)
        // ==========================================
        if (msg === lastMessage) {
            continue;
        }

        lastMessage = msg;
        curated.push({ ...cp, message: msg });
    }

    return curated;
};

// 时间格式化辅助
const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: '', time: '' };
    const d = new Date(dateString);
    return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
};

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
        if (status === 'COMPLETED') return 3;
        const index = STATUS_STEPS.findIndex(s => s.key === status);
        return index === -1 ? 0 : index;
    };

    const displayOrderNumber = orderData?.orderNumber?.replace(/^#/, '') || '';

    // 获取清洗后的轨迹数据
    const cleanCheckpoints = orderData?.logistics?.checkpoints
        ? curateCheckpoints(orderData.logistics.checkpoints)
        : [];

    return (
        <div className="min-h-screen bg-[#FDFDFD] py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-4">Track Your Order</h1>
                    <p className="text-gray-500">Enter your order number and email to see the real-time logistics status.</p>
                </div>

                {/* 搜索表单 */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
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
                            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Search size={18} /> Track Order</>}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-100">
                        <AlertCircle size={20} />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* 结果展示区 */}
                {orderData && (
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">

                        <div className="bg-black text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold font-['Playfair_Display']">Order #{displayOrderNumber}</h2>
                                <p className="text-gray-400 text-sm mt-1">Placed on {new Date(orderData.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 uppercase tracking-wide">
                                {orderData.status}
                            </span>
                        </div>

                        <div className="p-8 border-b border-gray-100">
                            {/* 总体进度条 */}
                            <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4">
                                {STATUS_STEPS.map((step, index) => {
                                    const currentIdx = getCurrentStepIndex(orderData.status);
                                    const isCompleted = index <= currentIdx;
                                    const isCurrent = index === currentIdx;
                                    const Icon = step.icon;

                                    return (
                                        <div key={step.key} className="flex-1 flex flex-col items-center min-w-[100px] relative">
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

                            {/* ✅ 重新设计的垂直实时物流时间轴 */}
                            {cleanCheckpoints.length > 0 && (
                                <div className="mt-12 bg-gray-50/50 rounded-2xl p-6 md:p-8 border border-gray-100">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Live Tracking Updates</h3>
                                            {/* ✅ 补充：非常优雅地展示 Tracking Number */}
                                            {orderData.trackingNumber && (
                                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                                    <span>Tracking #:</span>
                                                    <span className="font-mono font-bold text-gray-900 select-all">{orderData.trackingNumber}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 顶部右侧物流状态角标 */}
                                        <div className="flex items-center gap-2">
                                            {/*{orderData.carrier && <span className="text-xs text-gray-400 font-medium border border-gray-200 px-3 py-1 rounded-full">{orderData.carrier}</span>}*/}
                                            {orderData.logistics?.statusLevel === 3 && <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">In Transit</span>}
                                            "
                                            {orderData.logistics?.statusLevel === 4 && <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold">Out for Delivery</span>}
                                            {orderData.logistics?.statusLevel === 6 && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Delivered</span>}
                                        </div>
                                    </div>

                                    {/* 时间轴容器 */}
                                    <div className="relative">
                                        {cleanCheckpoints.map((cp, idx) => {
                                            const isLatest = idx === 0;
                                            const isLast = idx === cleanCheckpoints.length - 1;
                                            const { date, time } = formatDateTime(cp.timestamp);

                                            return (
                                                <div key={idx} className="flex gap-4 md:gap-8">

                                                    {/* 1. 左侧日期区域 */}
                                                    <div className="w-20 md:w-32 shrink-0 pt-0.5 text-right flex flex-col">
                                                        <span className={`text-sm md:text-base ${isLatest ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>
                                                            {date}
                                                        </span>
                                                        <span className={`text-xs mt-0.5 font-mono ${isLatest ? 'text-gray-500' : 'text-gray-400'}`}>
                                                            {time}
                                                        </span>
                                                    </div>

                                                    {/* 2. 中间时间轴图标区域 */}
                                                    <div className="relative flex flex-col items-center">
                                                        <div className={`relative z-10 w-3.5 h-3.5 rounded-full ring-4 ring-[#FDFDFD] mt-1.5 
                                                            ${isLatest ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`}
                                                        />
                                                        {!isLast && (
                                                            <div className="w-0.5 bg-gray-200 flex-1 my-1"></div>
                                                        )}
                                                    </div>

                                                    {/* 3. 右侧信息详情区域 */}
                                                    <div className={`flex-1 pb-10 pt-0.5 ${!isLatest && 'opacity-70'}`}>
                                                        <p className={`text-sm md:text-base leading-snug ${isLatest ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                                            {cp.message}
                                                        </p>
                                                        {cp.location && (
                                                            <div className="flex items-start gap-1 mt-2 text-xs text-gray-400">
                                                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                                                <span className="leading-tight">{cp.location}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 等待揽收状态 */}
                            {orderData.status === 'SHIPPED' && cleanCheckpoints.length === 0 && (
                                <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                    <Truck size={36} className="text-blue-400 mb-4" />
                                    <h4 className="font-bold text-blue-900 mb-2">Package is on the way</h4>
                                    {/* 补充：这里也展示一下追踪号 */}
                                    {orderData.trackingNumber && (
                                        <p className="font-mono font-bold text-blue-800 bg-white px-3 py-1 rounded-md border border-blue-100 select-all mb-3">
                                            {orderData.trackingNumber}
                                        </p>
                                    )}
                                    <p className="text-sm text-blue-600/80 max-w-sm leading-relaxed">
                                        Your package has been dispatched. The tracking timeline will update here automatically within 24-48 hours once scanned by the carrier.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 底部地址栏 */}
                        <div className="p-8 bg-white">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Shipping Details</h3>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed max-w-xl">
                                <p className="font-bold text-gray-900 mb-2 text-base">
                                    {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                                </p>
                                <p>{orderData.shippingAddress.addressLine1}</p>
                                {orderData.shippingAddress.addressLine2 && <p>{orderData.shippingAddress.addressLine2}</p>}
                                <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.province}</p>
                                <p>{orderData.shippingAddress.country} {orderData.shippingAddress.zipCode}</p>
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