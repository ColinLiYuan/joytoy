import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Shipping Policy | MythToy - 100% Discreet & Fast Delivery',
    description: 'Learn about MythToy\'s discreet shipping, delivery times to USA/EU, and international shipping options. We prioritize your privacy with plain packaging.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/shipping-policy',
    },
};

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Shipping Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Discreet Shipping Guarantee</h2>
                            <p>MythToy offers fast, reliable, and <strong>100% discreet shipping</strong> to customers worldwide.</p>
                            <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
                                <p className="font-semibold text-blue-800">📦 Plain Packaging Promise:</p>
                                <p className="text-blue-700 text-sm mt-1">All packages are shipped in plain brown boxes or padded envelopes. There are <strong>no logos, no product names, and no "Adult" markings</strong> on the outside. The sender name will appear as a generic fulfillment corporation.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Shipping Times & Costs</h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2">United States (Domestic)</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Standard Shipping (3-7 days):</strong> $5.99 (Free on orders over $49)</li>
                                <li><strong>Priority Shipping (2-3 days):</strong> $14.99</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Europe & UK</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Standard EU Shipping (3-8 days):</strong> €4.99 (Free on orders over €59)</li>
                                <li><strong>Express Shipping (2-4 days):</strong> €12.99</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Order Processing</h2>
                            <p>Orders placed before 2 PM (local warehouse time) are typically processed the same business day. Orders placed on weekends or holidays will be processed the next business day.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Customs & Duties</h2>
                            <p>For international orders, customers are responsible for any customs duties, taxes, or import fees that may apply. Please check your local regulations regarding the importation of adult products.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Shipping Support</h2>
                            <p>If you have questions about your order status, please contact us with your Order ID:</p>
                            <ul className="list-none pl-0 mt-4 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <li><strong>Email:</strong> support@mythtoy.com</li>
                                <li><strong>Response Time:</strong> Within 24 hours</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}