// app/checkout/orderSummary.tsx
import { ShieldCheck, Lock } from 'lucide-react'; // ✅ Lucide
import { OrderItemRequest } from '@/types/order';
import Image from 'next/image';
import { colorMap } from '@/lib/constants/color-map';
import { getProductImageUrl } from '@/lib/image-utils';

interface OrderSummaryProps {
    orderItems: OrderItemRequest[];
}

const getColorValue = (colorName: string): string => {
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#CCCCCC';
};

export default function OrderSummary({ orderItems }: OrderSummaryProps) {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const total = subtotal;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Order Summary</h3>

            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {orderItems.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                            {item.productImage ? (
                                <Image src={getProductImageUrl('', item.productImage)} alt={item.productTitle} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold">{item.productTitle.charAt(0)}</div>
                            )}
                            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-bl-lg">
                                {item.quantity}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.productTitle}</h4>
                            {item.color && (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: getColorValue(item.color) }} />
                                    <span className="text-xs text-gray-500 capitalize">{item.color}</span>
                                </div>
                            )}
                        </div>
                        <div className="font-bold text-gray-900 text-sm">${(item.unitPrice * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium text-xs uppercase tracking-wide">Free - Discreet</span>
                </div>
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