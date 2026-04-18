// pages/payment-policy.tsx

import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Payment Policy | MythToy - Secure Transactions',
    description: 'MythToy accepts secure payments via Credit Cards, PayPal, and Bank Transfer. Learn about our SSL encryption, billing discretion, and fraud protection.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/payment-policy',
    },
};

export default function PaymentPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Payment Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Accepted Payment Methods</h2>
                            <p>MythToy offers secure payment options for your convenience. We accept:</p>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2">Cards & Digital Wallets</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Visa, Mastercard, American Express</li>
                                        <li>PayPal</li>
                                        <li>Apple Pay / Google Pay</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2">Wholesale / B2B</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        <li>Bank Wire Transfer (TT)</li>
                                        <li>Large volume PayPal transactions</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Billing Discretion</h2>
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <p className="text-blue-800 font-medium">
                                    Your privacy matters. Your bank statement will NOT show "MythToy" or any adult-related terms.
                                </p>
                                <p className="text-sm text-blue-700 mt-2">The charge will appear as <strong>"MT TECH"</strong> on your statement.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Security & SSL</h2>
                            <p>We use industry-standard 256-bit SSL encryption to protect your data. We are PCI DSS compliant and do not store your full credit card numbers on our servers.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Sales Tax</h2>
                            <p>Taxes are calculated at checkout based on the shipping destination and applicable local laws.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Payment Support</h2>
                            <p>If you encounter payment issues or declines, please contact your bank first, then reach out to us at:</p>
                            <ul className="list-none pl-0 mt-4 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <li><strong>Email:</strong> payments@mythtoy.com</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}