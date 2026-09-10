// app/checkout/orderSummary.tsx
import { ShieldCheck, Lock, Package, CreditCard, Award, EyeOff, Info } from 'lucide-react';
import { OrderItemRequest } from '@/types/order';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { getSizeFromCustomization } from '@/lib/product-utils';
import { colorMap } from '@/lib/constants/color-map';
import { CouponResponse } from '@/types/checkout';

interface OrderSummaryProps {
    orderItems: OrderItemRequest[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    appliedCoupon?: CouponResponse | null;
}

export default function OrderSummary({
                                         orderItems,
                                         subtotal,
                                         discount,
                                         shipping,
                                         total,
                                         appliedCoupon
                                     }: OrderSummaryProps) {
    const getColorValue = (n: string) => colorMap[n.toLowerCase().trim()] || '#CCCCCC';

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Order Summary</h3>

            {/* 商品列表 */}
            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
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
                            {getSizeFromCustomization(item.customization) && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Size: <span className="font-medium text-gray-700">{getSizeFromCustomization(item.customization)}</span>
                                </p>
                            )}
                        </div>
                        <div className="font-bold text-gray-900 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            {/* 金额计算区 */}
            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-pink-600 font-medium">
                        <span className="flex items-center gap-1">
                            Discount
                            {appliedCoupon?.type === 'PERCENTAGE' ? (
                                <span className="text-xs bg-pink-50 px-1.5 py-0.5 rounded ml-1">
                                    {Math.round(appliedCoupon.value * 100)}% OFF
                                </span>
                            ) : (
                                <span className="text-xs bg-pink-50 px-1.5 py-0.5 rounded ml-1">
                                    SAVED
                                </span>
                            )}
                        </span>
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

                {/* ✅ 新增：含税说明 */}
                <div className="flex justify-between text-gray-400 text-[11px] italic">
                    <span className="flex items-center gap-1"><Info size={10} /> Estimated Tax</span>
                    <span>Included</span>
                </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Total</span>
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">All taxes included</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-xs text-gray-400 mb-1">USD</span>
                    <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* 信任与隐私保障模块 */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {/* 1. 匿名包装 */}
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                        <Package size={18} className="text-gray-700 mb-2" />
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Discreet Shipping</span>
                        <p className="text-[10px] text-gray-500 mt-1 leading-tight">Anonymous poly bag & Kraft box. No branding or labels.</p>
                    </div>

                    {/* 2. 账单隐私 */}
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                        <EyeOff size={18} className="text-gray-700 mb-2" />
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Billing Privacy</span>
                        <p className="text-[10px] text-gray-500 mt-1 leading-tight">Billed as "MT TECH". Product listed as "Muse Swan".</p>
                    </div>

                    {/* 3. 官方保修 */}
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                        <Award size={18} className="text-gray-700 mb-2" />
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">1-Year Warranty</span>
                        <p className="text-[10px] text-gray-500 mt-1 leading-tight">Full 1-year quality guarantee and support.</p>
                    </div>

                    {/* 4. 全球支付支持 */}
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                        <CreditCard size={18} className="text-gray-700 mb-2" />
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Global Checkout</span>
                        <p className="text-[10px] text-gray-500 mt-1 leading-tight">PayPal, Apple Pay, Google Pay, Visa, Mastercard, AMEX & Discover supported.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-1"><Lock size={12} /> SSL Secured</div>
                        <div className="flex items-center gap-1"><ShieldCheck size={12} /> Privacy Guaranteed</div>
                    </div>
                </div>
            </div>
        </div>
    );
}