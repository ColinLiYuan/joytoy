// orderSummary.tsx - 已更新为使用 Tailwind CSS 类名
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingBag,
    faTruck,
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { OrderItemRequest } from '@/types/order';

interface OrderSummaryProps {
    orderItems: OrderItemRequest[];
}

const getColorValue = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#008000',
        'black': '#000000',
        'white': '#FFFFFF',
        'yellow': '#FFFF00',
        'purple': '#800080',
        'pink': '#FFC0CB',
        'orange': '#FFA500',
        'gray': '#808080',
        'brown': '#A52A2A',
        'navy': '#000080',
        'teal': '#008080',
        'gold': '#FFD700',
        'silver': '#C0C0C0'
    };

    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
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
                        <div className="w-15 h-15 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-semibold text-lg">
                                {item.productTitle.charAt(0)}
                            </div>
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
                        <div className="font-semibold text-gray-800 text-right">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-4 border-t border-gray-200 mt-2 text-xl font-semibold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mt-6">
                <FontAwesomeIcon icon={faTruck} className="text-blue-600" />
                <div>
                    <h4 className="font-semibold text-blue-800">Free Shipping</h4>
                    <p className="text-sm text-blue-600">All orders include free standard shipping</p>
                </div>
            </div>

            <div className="flex items-center gap-2 justify-center p-4 bg-gray-50 rounded-lg mt-4 text-gray-600 text-sm">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>Secure checkout • SSL encrypted</span>
            </div>
        </div>
    );
}