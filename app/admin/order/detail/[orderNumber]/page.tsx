'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderDetail } from '@/app/actions/admin/order-detail';
import { OrderResponse } from '@/types/order';
import { getProductImageUrl } from '@/lib/image-utils';
import {
    ChevronLeft, Package, Truck, CreditCard, User,
    MapPin, Mail, Phone, Loader2, Calendar, Hash
} from 'lucide-react';

export default function OrderDetailPage() {
    // 💡 因为你的文件夹叫 [orderNumber]，这里 params.orderNumber 才有值
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            // 获取 URL 里的 orderNumber
            const orderNo = params.orderNumber as string;

            if (!orderNo) {
                console.error("No orderNumber found in params");
                return;
            }

            try {
                // 调用 Server Action 获取数据
                const data = await getOrderDetail(orderNo);
                console.log('Fetched Detail:', data);
                setOrder(data);
            } catch (err) {
                console.error('获取详情失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [params.orderNumber]); // 💡 修正依赖项为 params.orderNumber

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
                <p className="text-sm text-gray-500">正在加载订单详情...</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className="p-8 text-center h-screen flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">未找到该订单 (#{params.orderNumber})</p>
            <button onClick={() => router.back()} className="px-4 py-2 bg-black text-white rounded-lg text-sm">
                返回列表
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
                        >
                            <ChevronLeft size={16} /> 返回订单列表
                        </button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">订单 #{order.orderNumber}</h1>
                            <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1"><Calendar size={14}/> {new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 主栏：商品和费用 */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                                <Package size={18} className="text-gray-400" />
                                <h2 className="font-bold text-gray-900">商品明细</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 text-gray-300 flex items-center justify-center">
                                            {item.productImage ? (
                                                <img src={getProductImageUrl('', item.productImage)} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={24}/>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">{item.productTitle}</p>
                                            <p className="text-[10px] text-gray-500 uppercase mt-1">SKU: {item.productSku} | Color: {item.color}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">${item.unitPrice.toFixed(2)}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>小计</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                <span>折扣 ({order.couponCode || 'N/A'})</span>
                                <span>-${order.discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t font-bold text-xl text-gray-900">
                                <span>实付金额</span>
                                <span>${order.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 侧栏：客户和收货地址 */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><User size={18} /> 客户信息</h3>
                            <div className="text-sm space-y-1">
                                <p className="font-bold text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-gray-500 break-all">{order.guestEmail}</p>
                                <p className="text-gray-500">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><MapPin size={18} /> 收货地址</h3>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                                <p className="font-bold text-gray-900 mt-2 uppercase">{order.shippingAddress.country} - {order.shippingAddress.zipCode}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2"><Truck size={18} /> 物流信息</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">支付方式</span>
                                    <span className="font-medium">{order.paymentMethod || 'Paypal/Card'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">追踪号码</span>
                                    <span className={`font-mono font-bold ${order.trackingNumber ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {order.trackingNumber || '未填写'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}