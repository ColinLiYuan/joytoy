// app/checkout/orderSummary.tsx
import { ShieldCheck, Lock } from 'lucide-react';
import { OrderItemRequest } from '@/types/order';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';

interface OrderSummaryProps {
    orderItems: OrderItemRequest[];
    discount?: number;
    shipping?: number;
}

export default function OrderSummary({ orderItems, discount = 0, shipping = 0 }: OrderSummaryProps) {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const total = Math.max(0, subtotal - discount + shipping);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Order Summary</h3>
            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                            {item.productImage && <Image src={getProductImageUrl('', item.productImage)} alt={item.productTitle} fill className="object-cover" />}
                            <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-lg">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.productTitle}</h4>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{item.color}</p>
                        </div>
                        <div className="font-bold text-gray-900 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Total</span>
                <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-3 flex items-center justify-center gap-4 text-xs text-gray-500 border border-gray-100">
                <div className="flex items-center gap-1.5"><Lock size={12} /> SSL Encrypted</div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1.5"><ShieldCheck size={12} /> Secure Payment</div>
            </div>
        </div>
    );
}