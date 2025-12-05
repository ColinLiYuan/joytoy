// app/(site)/orders/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { OrderResponse } from '@/types/order'; // 确保这里引入的是更新后的类型
import { getProductImageUrl } from '@/lib/image-utils';
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
    Receipt
} from 'lucide-react';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15: 解包异步 params
    const { id } = use(params);
    const searchParams = useSearchParams();

    // 获取 URL 参数判断是否刚支付成功
    const isJustPaid = searchParams.get('payment_success') === '1';

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // 注意：如果你的后端接收的是数字ID，这里可能需要转换，或者后端兼容字符串
                // 假设 getOrder 接收 string | number
                const data = await orderService.getOrder(id);
                setOrder(data);
            } catch (error) {
                console.error('Failed to load order:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

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
                <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <Link href="/orders" className="text-pink-600 hover:underline">Return to My Orders</Link>
            </div>
        );
    }

    // 格式化日期
    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // 假设 OrderResponse 中没有 shippingAddress，需要从 context 或其他地方获取，
    // 或者你的 API 实际上返回了 address。
    // 为了不报错，这里做个防御性检查，或者你需要确认 OrderResponse 是否真的包含了 Address。
    // **根据你提供的类型，OrderResponse 里并没有 shippingAddress**。
    // 如果后端确实没返回地址，这部分UI需要隐藏或调整。
    // 这里我假设你的 API 返回数据比类型定义多，或者你需要去更新类型定义。
    // 为了代码不报错，我先用 any 绕过，请务必在类型文件中添加 shippingAddress: AddressRequest
    const shippingAddress = (order as any).shippingAddress || {
        firstName: 'Guest', lastName: '', addressLine1: 'Address not available', city: '', country: '', zipCode: ''
    };

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
                                        {/* 这里的 price 应该是 unitPrice，根据你的类型定义 */}
                                        <p className="font-bold text-gray-900 text-lg">${item.unitPrice.toFixed(2)}</p>
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
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        {/* 计算 Subtotal，因为 OrderResponse 里没有单独的 subtotal 字段，可以用 totalAmount 减去 shippingFee */}
                                        <span>${(order.totalAmount - (order.shippingFee || 0)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">
                                            {order.shippingFee > 0 ? `$${order.shippingFee.toFixed(2)}` : 'Free & Discreet'}
                                        </span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                        <div className="flex justify-between text-pink-600">
                                            <span>Discount</span>
                                            <span>-${order.discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-gray-900 text-xl border-t border-gray-100 pt-3 mt-1">
                                        <span>Total</span>
                                        {/* 使用 finalAmount 或者是 totalAmount，根据你的业务逻辑，通常 finalAmount 是实付 */}
                                        <span>${order.finalAmount.toFixed(2)}</span>
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

                {/* 底部帮助 */}
                <div className="text-center mt-12 mb-8">
                    <p className="text-gray-400 text-sm">Need help with this order?</p>
                    <a href="mailto:support@mythtoy.com" className="text-black font-bold text-sm hover:underline mt-1 inline-block">
                        Contact Support
                    </a>
                </div>

            </div>
        </div>
    );
}