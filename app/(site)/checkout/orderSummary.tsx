// app/checkout/orderSummary.tsx
import { ShieldCheck, Lock } from 'lucide-react';
import { OrderItemRequest } from '@/types/order';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';

interface OrderSummaryProps {
    orderItems: OrderItemRequest[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
}

export default function OrderSummary({ orderItems, subtotal, discount, shipping, total }: OrderSummaryProps) {
    const getColorValue = (n: string) => colorMap[n.toLowerCase().trim()] || '#CCCCCC';

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Order Summary</h3>

            {/* 商品列表 */}
            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                        {/* ✅ 锁定图片：禁止点击、禁止长按保存 */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 pointer-events-none select-none">
                            {item.productImage ? (
                                <Image
                                    src={getProductImageUrl('', item.productImage)}
                                    alt={item.productTitle}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-gray-100">
                                    {item.productTitle.charAt(0)}
                                </div>
                            )}
                            <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-lg">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.productTitle}</h4>
                            <p className="text-xs text-gray-500 mt-1 capitalize flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block border border-gray-200" style={{backgroundColor: getColorValue(item.color)}}></span>
                                {item.color}
                            </p>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            {/* 金额计算区 (保持不变) */}
            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-pink-600 font-medium">
                        <span>Discount (10% OFF)</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                        <span className="text-green-600 font-bold text-xs uppercase tracking-wide">Free</span>
                    ) : (
                        <span className="font-medium">${shipping.toFixed(2)}</span>
                    )}
                </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Total</span>
                <div className="flex items-end gap-2">
                    <span className="text-xs text-gray-400 mb-1">USD</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-3 flex items-center justify-center gap-4 text-xs text-gray-500 border border-gray-100">
                <div className="flex items-center gap-1.5"><Lock size={12} /> SSL Encrypted</div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Payment</div>
            </div>
        </div>
    );
}