// orderSummary.tsx - 已更新为使用 Tailwind CSS 类名
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingBag,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
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
        <div className="bg-white rounded-lg shadow-md p-8 sticky top-8">
            <div className="mb-8">
                <h3 className="flex items-center gap-3 mb-4 text-xl font-semibold text-gray-800">
                    <FontAwesomeIcon icon={faShoppingBag} />
                    Order Summary
                </h3>
                {orderItems.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                        {/* 商品图片 - 显示主图 */}
                        <div className="w-15 h-15 rounded-lg overflow-hidden flex-shrink-0">
                            {item.productImage ? (
                                <Image
                                    src={item.productImage}
                                    alt={item.productTitle}
                                    width={60}
                                    height={60}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-semibold text-lg rounded-lg">
                                    {item.productTitle.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1 text-sm">{item.productTitle}</h4>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                {item.color && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Color: </span>
                                        <div className="flex items-center gap-1">
                                            <span
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{
                                                    backgroundColor: getColorValue(item.color),
                                                    border: getColorValue(item.color) === '#FFFFFF' ? '1px solid #ddd' : 'none'
                                                }}
                                                title={item.color}
                                            ></span>
                                            <span className="text-sm text-gray-800 capitalize">{item.color}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* 价格样式使用全局变量 */}
                        <div className="font-semibold text-gray-800 text-right" style={{ color: 'var(--price-color)' }}>
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span style={{ color: 'var(--price-color)' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 border-t border-gray-200 mt-2 text-xl font-semibold text-gray-800">
                    <span>Total</span>
                    <span style={{ color: 'var(--price-color)' }}>${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center p-4 bg-gray-50 rounded-lg mt-4 text-gray-600 text-sm">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>Secure checkout • SSL encrypted</span>
            </div>
        </div>
    );
}