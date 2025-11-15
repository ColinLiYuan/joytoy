// app/order-tracking/page.tsx
export default function OrderTracking() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Track Your Order</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Order Details</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Order Number *
                                        </label>
                                        <input
                                            type="text"
                                            id="orderNumber"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., MYTH-123456"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
                                    >
                                        Track Order
                                    </button>
                                </form>
                            </div>
                        </section>

                        {/* Order Status Section - Example with sample data */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Order Status</h2>
                            <div className="border border-gray-200 rounded-lg p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold">Order #MYTH-123456</h3>
                                        <p className="text-gray-600">Placed on April 15, 2025</p>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Delivered
                                    </span>
                                </div>

                                {/* Tracking Timeline */}
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                    <div className="relative flex items-center mb-6">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold">Order Delivered</p>
                                            <p className="text-gray-600 text-sm">April 18, 2025 - 14:30</p>
                                            <p className="text-gray-500 text-sm">Package left at front door</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center mb-6">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold">Out for Delivery</p>
                                            <p className="text-gray-600 text-sm">April 18, 2025 - 08:15</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center mb-6">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold">Package in Transit</p>
                                            <p className="text-gray-600 text-sm">April 17, 2025 - 11:20</p>
                                            <p className="text-gray-500 text-sm">Arrived at local facility</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center mb-6">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold">Order Shipped</p>
                                            <p className="text-gray-600 text-sm">April 16, 2025 - 15:45</p>
                                            <p className="text-gray-500 text-sm">Tracking number: TRK7890123456</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold">Order Confirmed</p>
                                            <p className="text-gray-600 text-sm">April 15, 2025 - 10:30</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Order Details */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Order Details</h2>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                                                <div>
                                                    <p className="font-medium">Mythical Dragon Figure</p>
                                                    <p className="text-gray-500 text-sm">#DRG-789</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">1</td>
                                        <td className="px-4 py-3">$49.99</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                                                <div>
                                                    <p className="font-medium">Phoenix Collectible</p>
                                                    <p className="text-gray-500 text-sm">#PHX-456</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">2</td>
                                        <td className="px-4 py-3">$64.98</td>
                                    </tr>
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-right font-semibold">Subtotal:</td>
                                        <td className="px-4 py-3">$114.97</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-right font-semibold">Shipping:</td>
                                        <td className="px-4 py-3">$5.99</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-right font-semibold">Total:</td>
                                        <td className="px-4 py-3 font-semibold">$120.96</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </section>

                        {/* Shipping Information */}
                        <section>
                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                                    <div className="text-gray-700">
                                        <p className="font-medium">John Smith</p>
                                        <p>123 Main Street</p>
                                        <p>Apartment 4B</p>
                                        <p>New York, NY 10001</p>
                                        <p>United States</p>
                                        <p className="mt-2">📞 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-4">Shipping Method</h3>
                                    <div className="text-gray-700">
                                        <p className="font-medium">Standard Shipping</p>
                                        <p>Estimated delivery: 3-5 business days</p>
                                        <p className="mt-2 text-sm text-gray-600">Carrier: MythToy Express</p>
                                        <p className="text-sm text-gray-600">Tracking: TRK7890123456</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Support Section */}
                        <section>
                            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help With Your Order?</h3>
                                <p className="text-blue-800 mb-4">Our customer support team is here to assist you.</p>
                                <div className="space-y-2 text-blue-800">
                                    <p>📧 Email: support@mythtoy.com</p>
                                    <p>📞 Phone: 1-800-MYTHTOY</p>
                                    <p>🕒 Hours: Mon-Fri 9AM-6PM EST</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}