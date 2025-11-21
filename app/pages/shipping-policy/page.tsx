// app/shipping-policy/page.tsx
export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <p className="text-sm text-gray-500">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">1. Shipping Overview</h2>
                            <p>MythToy offers fast, reliable, and discreet shipping to customers worldwide. We operate from multiple warehouses to ensure the best shipping times and costs for your location.</p>
                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                <p className="font-semibold">📦 All packages are shipped discreetly with plain packaging - no external branding indicating the contents.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">2. Warehouse Locations</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">US Warehouse</h3>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Location: Nevada, USA</li>
                                        <li>Serves: North & South America</li>
                                        <li>Processing Time: 1-2 business days</li>
                                        <li>Free shipping on orders over $69</li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">EU Warehouse</h3>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Location: Netherlands</li>
                                        <li>Serves: European Union & UK</li>
                                        <li>Processing Time: 1-2 business days</li>
                                        <li>Free shipping on orders over €59</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">3. Shipping to Americas</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Delivery Time</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Best For</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Standard Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>USA: 3-7 business days</div>
                                            <div>Canada: 5-10 business days</div>
                                            <div>Mexico: 7-12 business days</div>
                                            <div>Other Americas: 7-14 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>USA: $5.99</div>
                                            <div>Canada: $9.99</div>
                                            <div>Mexico: $12.99</div>
                                            <div className="text-green-600 font-semibold">Free on orders over $69</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">Regular orders, budget-friendly option</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Express Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>USA: 2-3 business days</div>
                                            <div>Canada: 3-5 business days</div>
                                            <div>Mexico: 4-7 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>USA: $14.99</div>
                                            <div>Canada: $19.99</div>
                                            <div>Mexico: $24.99</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">Faster delivery for time-sensitive orders</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Priority Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>USA: 1-2 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">$24.99</td>
                                        <td className="border border-gray-300 px-4 py-2">Urgent orders, next-day delivery available</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">4. Shipping to Europe</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Delivery Time</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Best For</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Standard EU Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>EU Countries: 3-7 business days</div>
                                            <div>UK: 4-8 business days</div>
                                            <div>Switzerland/Norway: 5-10 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>EU: €4.99</div>
                                            <div>UK: €6.99</div>
                                            <div>Switzerland/Norway: €8.99</div>
                                            <div className="text-green-600 font-semibold">Free on orders over €59</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">Most European orders, cost-effective</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Express EU Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>EU Countries: 2-3 business days</div>
                                            <div>UK: 3-4 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>EU: €12.99</div>
                                            <div>UK: €15.99</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">Faster European delivery</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">DHL Express</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div>EU: 1-2 business days</div>
                                            <div>UK: 2-3 business days</div>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">€24.99</td>
                                        <td className="border border-gray-300 px-4 py-2">Fastest available service</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">5. Order Processing</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Processing Time:</strong> 1-2 business days for all orders</li>
                                    <li><strong>Cut-off Time:</strong> Orders placed before 2 PM local warehouse time are processed same day</li>
                                    <li><strong>Weekend Orders:</strong> Placed on Saturday or Sunday are processed on Monday</li>
                                    <li><strong>Holiday Periods:</strong> Processing may take additional 1-2 days during peak seasons</li>
                                    <li><strong>Order Verification:</strong> All orders undergo age verification before processing</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">6. International Customs & Duties</h2>
                            <div className="bg-yellow-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Important Information for International Customers</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Customs Duties:</strong> International customers are responsible for any customs duties, taxes, or import fees</li>
                                    <li><strong>Restricted Items:</strong> Some products may be restricted in certain countries - check local laws before ordering</li>
                                    <li><strong>Shipping Delays:</strong> Customs clearance may cause additional 2-5 business days delay</li>
                                    <li><strong>Documentation:</strong> All international shipments include required customs documentation</li>
                                    <li><strong>Age Verification:</strong> Recipient must be 18+ and may need to provide valid ID for customs clearance</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">7. Order Tracking</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Tracking Information</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Tracking number emailed within 24 hours of shipment</li>
                                        <li>Real-time tracking updates via carrier website</li>
                                        <li>SMS notifications available (opt-in during checkout)</li>
                                        <li>Delivery confirmation and proof of delivery</li>
                                        <li>24/7 package tracking access</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Need Help Tracking?</h3>
                                    <p className="mb-3">If you're having trouble tracking your package:</p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Check your email for tracking link</li>
                                        <li>Allow 24 hours for tracking to activate</li>
                                        <li>Contact us with your order number</li>
                                        <li>We'll provide updated tracking information</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">8. Shipping Restrictions</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-red-700">Restricted Countries</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>United Arab Emirates</li>
                                        <li>Saudi Arabia</li>
                                        <li>Pakistan</li>
                                        <li>Malaysia</li>
                                        <li>Indonesia</li>
                                        <li>Thailand</li>
                                    </ul>
                                    <p className="text-xs text-red-600 mt-2">Due to local laws and regulations regarding adult products</p>
                                </div>
                                <div className="border border-orange-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3 text-orange-700">Regional Restrictions</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Some US states have specific restrictions</li>
                                        <li>Certain EU countries require age verification</li>
                                        <li>International shipping may be delayed during holidays</li>
                                        <li>Remote locations may have extended delivery times</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">9. Lost or Damaged Packages</h2>
                            <div className="bg-red-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">Package Issues Protocol</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Report Within:</strong> 30 days of expected delivery date</li>
                                    <li><strong>Required Information:</strong> Order number and tracking number</li>
                                    <li><strong>Damaged Items:</strong> Photograph damaged items and packaging</li>
                                    <li><strong>Lost Packages:</strong> We file claims with shipping carriers</li>
                                    <li><strong>Resolution:</strong> Reshipment or full refund provided</li>
                                    <li><strong>Response Time:</strong> We respond to all claims within 24 hours</li>
                                </ul>
                                <p className="mt-3 font-semibold">Contact: support@mythtoy.com with subject line "Package Issue - [Your Order Number]"</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">10. Contact Shipping Support</h2>
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">We're Here to Help</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2">Email Support</h4>
                                        <p className="text-blue-600 text-lg">support@mythtoy.com</p>
                                        <p className="text-sm text-gray-600 mt-1">Response time: 24 hours or less</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Live Chat</h4>
                                        <p className="text-green-600 text-lg">Available on website</p>
                                        <p className="text-sm text-gray-600 mt-1">Mon-Fri: 9AM-6PM EST</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm">💡 <strong>Pro Tip:</strong> Have your order number ready when contacting support for faster service.</p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Shipping times are estimates and may vary due to customs processing, weather conditions, carrier delays, or other factors beyond our control. We continuously monitor shipments and will notify you of any significant delays. Thank you for choosing MythToy!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}