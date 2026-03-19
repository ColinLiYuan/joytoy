// app/pages/shipping-policy/page.tsx

import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Shipping Policy | MythToy - 100% Discreet & Global Delivery',
    description: 'Learn about MythToy\'s discreet shipping, delivery times, and order processing. We prioritize your privacy with plain, secure packaging.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/shipping-policy',
    },
};

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Shipping Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-8 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: January 2026</p>

                        {/* 1. 隐私发货 - 核心卖点 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="mr-2">🔒</span> 1. 100% Discreet Shipping
                            </h2>
                            <p>Your privacy is our #1 priority. We understand the need for discretion.</p>
                            <div className="bg-gray-50 p-5 rounded-lg mt-4 border border-gray-200">
                                <p className="font-semibold text-gray-900 mb-2">What your package looks like:</p>
                                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                                    <li>Plain, unbranded <strong>Matte Black Bubble Mailers</strong>.</li>
                                    <li>Sender name appears as <strong>"MYTH-TECH"</strong> or "Customer Service".</li>
                                    <li><strong>NO</strong> logos, <strong>NO</strong> product names, and <strong>NO</strong> sensitive words on the label.</li>
                                    <li>It looks exactly like a generic tech accessory or clothing package.</li>
                                </ul>
                            </div>
                        </section>

                        {/* 2. 时效 - 诚实但留有余地 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Shipping Times & Costs</h2>
                            <p className="mb-4">We ship worldwide via reliable tracked carriers (USPS, Royal Mail, YunExpress, etc.).</p>

                            <div className="overflow-hidden border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    <tr>
                                        <td className="px-4 py-3 font-medium">United States</td>
                                        <td className="px-4 py-3">7 - 12 Business Days</td>
                                        <td className="px-4 py-3">$4.99 (Free over $49)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">UK & Europe</td>
                                        <td className="px-4 py-3">6 - 14 Business Days</td>
                                        <td className="px-4 py-3">$4.99 (Free over $49)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 font-medium">Rest of World</td>
                                        <td className="px-4 py-3">10 - 20 Business Days</td>
                                        <td className="px-4 py-3">Calculated at checkout</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">*Timeframes are estimates and do not include the 1-3 day processing time.</p>
                        </section>

                        {/* 3. 处理时间 - 给你留出打包的时间 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Order Processing</h2>
                            <p>Because we hand-pack every order with our signature velvet pouch and honeycomb protection, please allow <strong>1-3 business days</strong> for your order to be processed and dispatched from our warehouse.</p>
                            <p className="mt-2">You will receive a tracking number via email as soon as your package ships.</p>
                        </section>

                        {/* 4. 解决“假单号”焦虑 - 关键！ */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Tracking Updates</h2>
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> It may take <strong>2-4 days</strong> for the tracking status to update from "Label Created" to "In Transit". This is normal as your package travels from our distribution center to the carrier's sorting facility. Please be patient, your pleasure is on the way!
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}