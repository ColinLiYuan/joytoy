// app/return-refund-policy/page.tsx
export default function ReturnRefundPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return & Refund Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <p className="text-sm text-gray-500">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">1. Policy Overview</h2>
                            <p>MythToy is committed to your satisfaction. Due to the nature of our products, we have specific return and refund policies designed to ensure customer safety while providing fair solutions for legitimate issues.</p>
                            <div className="bg-blue-50 p-4 rounded-lg mt-4">
                                <p className="font-semibold">⚠️ For hygiene and safety reasons, we cannot accept returns of used intimate products unless they are defective or damaged.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">2. Eligibility Timeline</h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-green-600 font-bold">30</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">Defective Products</h3>
                                    <p className="text-sm mt-2">30 days from delivery date for defective or damaged items</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-blue-600 font-bold">14</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">Wrong Items</h3>
                                    <p className="text-sm mt-2">14 days for incorrect or unopened items</p>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-purple-600 font-bold">7</span>
                                    </div>
                                    <h3 className="text-lg font-semibold">Unopened Returns</h3>
                                    <p className="text-sm mt-2">7 days for unopened, original packaging</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">3. Valid Return Reasons</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Condition Required</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Refund Type</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Timeframe</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Defective Product</td>
                                        <td className="border border-gray-300 px-4 py-2">Not working upon arrival, manufacturing defects</td>
                                        <td className="border border-gray-300 px-4 py-2">Full refund or replacement</td>
                                        <td className="border border-gray-300 px-4 py-2">30 days</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Damaged in Shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">Visible damage to product or packaging</td>
                                        <td className="border border-gray-300 px-4 py-2">Full refund or replacement</td>
                                        <td className="border border-gray-300 px-4 py-2">14 days</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Wrong Item Shipped</td>
                                        <td className="border border-gray-300 px-4 py-2">Unopened, original condition</td>
                                        <td className="border border-gray-300 px-4 py-2">Full refund or correct item</td>
                                        <td className="border border-gray-300 px-4 py-2">14 days</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Unopened Return</td>
                                        <td className="border border-gray-300 px-4 py-2">Original sealed packaging, unused</td>
                                        <td className="border border-gray-300 px-4 py-2">Refund minus shipping</td>
                                        <td className="border border-gray-300 px-4 py-2">7 days</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">4. Non-Returnable Items</h2>
                            <div className="bg-red-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 text-red-700">Cannot Be Returned</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Opened or used intimate products</li>
                                        <li>Sex toys without manufacturing defects</li>
                                        <li>Lingerie and apparel (for hygiene reasons)</li>
                                        <li>Lubricants and lotions (once opened)</li>
                                    </ul>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Edible products</li>
                                        <li>Sale or clearance items</li>
                                        <li>Gift cards or digital products</li>
                                        <li>Personalized or custom items</li>
                                    </ul>
                                </div>
                                <p className="text-sm text-red-600 mt-3">Due to health and hygiene regulations, we cannot accept returns of used intimate products.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">5. Return Process</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">1</div>
                                        <div>
                                            <h4 className="font-semibold">Contact Support</h4>
                                            <p className="text-sm mt-1">Email support@mythtoy.com with your order number and reason for return</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">2</div>
                                        <div>
                                            <h4 className="font-semibold">Receive Authorization</h4>
                                            <p className="text-sm mt-1">We'll provide a return authorization number and instructions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">3</div>
                                        <div>
                                            <h4 className="font-semibold">Package Item</h4>
                                            <p className="text-sm mt-1">Include all original packaging, accessories, and documentation</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">4</div>
                                        <div>
                                            <h4 className="font-semibold">Ship to Designated Warehouse</h4>
                                            <p className="text-sm mt-1">Use provided shipping label or ship to appropriate warehouse</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">5</div>
                                        <div>
                                            <h4 className="font-semibold">Inspection & Processing</h4>
                                            <p className="text-sm mt-1">2-5 business days for inspection and refund processing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">6. Refund Methods & Timing</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Refund Methods</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Original Payment Method:</strong> 5-10 business days to process</li>
                                        <li><strong>Store Credit:</strong> Instant processing + 10% bonus credit</li>
                                        <li><strong>Replacement:</strong> Shipped within 1-2 business days</li>
                                        <li><strong>Digital Gift Card:</strong> Email delivery within 24 hours</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Processing Timeline</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>Return Receipt:</strong> 1-2 business days to acknowledge</li>
                                        <li><strong>Inspection:</strong> 2-3 business days upon receipt</li>
                                        <li><strong>Refund Initiation:</strong> 1-2 business days after approval</li>
                                        <li><strong>Bank Processing:</strong> 3-7 business days (varies by bank)</li>
                                        <li><strong>Total Time:</strong> 7-14 business days typically</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">7. Shipping Costs for Returns</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Scenario</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Return Shipping</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Original Shipping</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Restocking Fee</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Defective/Damaged</td>
                                        <td className="border border-gray-300 px-4 py-2">Free (we provide label)</td>
                                        <td className="border border-gray-300 px-4 py-2">Refunded</td>
                                        <td className="border border-gray-300 px-4 py-2">None</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Wrong Item Shipped</td>
                                        <td className="border border-gray-300 px-4 py-2">Free (we provide label)</td>
                                        <td className="border border-gray-300 px-4 py-2">Refunded</td>
                                        <td className="border border-gray-300 px-4 py-2">None</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Change of Mind</td>
                                        <td className="border border-gray-300 px-4 py-2">Customer pays</td>
                                        <td className="border border-gray-300 px-4 py-2">Not refunded</td>
                                        <td className="border border-gray-300 px-4 py-2">15% if opened</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Unopened Return</td>
                                        <td className="border border-gray-300 px-4 py-2">Customer pays</td>
                                        <td className="border border-gray-300 px-4 py-2">Not refunded</td>
                                        <td className="border border-gray-300 px-4 py-2">None</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">8. Defective Product Protocol</h2>
                            <div className="bg-yellow-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">For Defective Items</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Do Not Dispose:</strong> Keep original product and packaging</li>
                                    <li><strong>Documentation:</strong> Take photos/videos showing the defect</li>
                                    <li><strong>Stop Use:</strong> Discontinue use of defective product immediately</li>
                                    <li><strong>Contact Support:</strong> Email within 30 days of delivery</li>
                                    <li><strong>Testing:</strong> May require return for quality control inspection</li>
                                    <li><strong>Warranty:</strong> 90-day manufacturer warranty on electronic components</li>
                                </ul>
                                <p className="mt-3 font-semibold">We stand behind our products and will resolve legitimate defect issues promptly.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">9. International Returns</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Return Locations</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li><strong>US Customers:</strong> Return to Nevada warehouse</li>
                                        <li><strong>EU Customers:</strong> Return to Netherlands warehouse</li>
                                        <li><strong>Other International:</strong> Contact for nearest return location</li>
                                        <li><strong>Customs:</strong> Mark as "Returned Goods" to avoid duties</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>International return shipping not covered for change of mind</li>
                                        <li>Refunds processed in original currency</li>
                                        <li>Bank conversion fees may apply</li>
                                        <li>Allow extra time for international shipping</li>
                                        <li>Contact support before international returns</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">10. Contact Return Support</h2>
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">We're Here to Help</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2">Email Support</h4>
                                        <p className="text-blue-600 text-lg">returns@mythtoy.com</p>
                                        <p className="text-sm text-gray-600 mt-1">Include order number in subject</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Live Chat</h4>
                                        <p className="text-green-600 text-lg">Available on website</p>
                                        <p className="text-sm text-gray-600 mt-1">Mon-Fri: 9AM-6PM EST</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm">💡 <strong>Pro Tip:</strong> For fastest service, have your order number, photos of the issue, and original packaging ready when contacting support.</p>
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                                We aim to make the return process as smooth as possible while maintaining the highest standards of customer safety and product hygiene. If you have any questions about our return policy, please contact our support team before initiating a return. Thank you for choosing MythToy!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}