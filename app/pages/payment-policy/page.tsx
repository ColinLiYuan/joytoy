// app/payment-policy/page.tsx
export default function PaymentPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Payment Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <p className="text-sm text-gray-500">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">1. Accepted Payment Methods</h2>
                            <p>MythToy offers secure and convenient payment options for both retail customers and wholesale partners. We accept the following payment methods:</p>

                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                {/* Credit/Debit Cards */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Credit & Debit Cards</h3>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Visa</li>
                                        <li>Mastercard</li>
                                        <li>American Express</li>
                                        <li>Discover</li>
                                    </ul>
                                    <p className="text-sm text-gray-600 mt-2">All card payments are processed through PCI DSS compliant payment gateways.</p>
                                </div>

                                {/* PayPal */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7.5 14.25c-1.5 0-2.25-.75-2.25-2.25s.75-2.25 2.25-2.25 2.25.75 2.25 2.25-.75 2.25-2.25 2.25zm9-6c-1.5 0-2.25-.75-2.25-2.25s.75-2.25 2.25-2.25 2.25.75 2.25 2.25-.75 2.25-2.25 2.25zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 16.5h-3l1.125-7.5h5.25l.75-3h-6l.375-2.25h6.75l-.75 3.75h-5.25l-.375 2.25h3.75l-.75 4.5z"/>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">PayPal</h3>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>PayPal Balance</li>
                                        <li>Linked Bank Accounts</li>
                                        <li>Linked Credit/Debit Cards</li>
                                        <li>PayPal Credit</li>
                                    </ul>
                                    <p className="text-sm text-gray-600 mt-2">Fast and secure payments through PayPal's trusted platform.</p>
                                </div>

                                {/* Bank Transfer */}
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Bank Wire Transfer</h3>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                        <li>Available for wholesale orders</li>
                                        <li>Minimum order: $1,000</li>
                                        <li>International transfers accepted</li>
                                        <li>Processing time: 2-5 business days</li>
                                    </ul>
                                    <p className="text-sm text-gray-600 mt-2">Ideal for large B2B orders and wholesale partnerships.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">2. Payment Security</h2>
                            <p>We prioritize the security of your payment information through multiple layers of protection:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>SSL Encryption:</strong> All data transmitted to our website is encrypted with 256-bit SSL technology</li>
                                <li><strong>PCI Compliance:</strong> We are PCI DSS Level 1 compliant - the highest level of payment security</li>
                                <li><strong>Tokenization:</strong> Payment details are tokenized and never stored on our servers</li>
                                <li><strong>3D Secure:</strong> Additional authentication through Verified by Visa, Mastercard SecureCode, and American Express SafeKey</li>
                                <li><strong>Fraud Monitoring:</strong> Real-time fraud detection and prevention systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">3. Payment Processing</h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Retail Customers (B2C)</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Payments are processed immediately upon order placement</li>
                                <li>Credit card authorizations are completed in real-time</li>
                                <li>PayPal payments are instant and confirmed automatically</li>
                                <li>Orders are processed only after successful payment confirmation</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Wholesale Partners (B2B)</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Bank wire transfers: Orders processed after funds are cleared</li>
                                <li>Net 30 terms available for qualified wholesale accounts</li>
                                <li>Volume-based pricing and payment plans for large orders</li>
                                <li>Dedicated account manager for payment coordination</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">4. Currency and Pricing</h2>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>All prices are displayed in US Dollars (USD) unless otherwise specified</li>
                                <li>International customers may see converted prices based on current exchange rates</li>
                                <li>Final transaction amount may vary due to bank exchange rates and fees</li>
                                <li>Taxes are calculated based on shipping destination and applicable laws</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">5. Payment Issues and Declines</h2>
                            <p>If your payment is declined or encounters issues:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Card Declines:</strong> Verify card details, available funds, and billing address</li>
                                <li><strong>PayPal Issues:</strong> Check PayPal account status and verification</li>
                                <li><strong>Bank Transfer Delays:</strong> Contact your bank for transfer status</li>
                                <li><strong>Fraud Prevention:</strong> Large or unusual orders may require additional verification</li>
                            </ul>
                            <p className="mt-3">For payment assistance, contact our support team at payments@mythtoy.com</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">6. Refunds and Chargebacks</h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Refund Processing</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Refunds are processed to the original payment method</li>
                                <li>Credit card refunds: 5-10 business days to appear on your statement</li>
                                <li>PayPal refunds: 3-5 business days</li>
                                <li>Bank transfer refunds: 7-14 business days</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Chargeback Policy</h3>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>We dispute invalid chargebacks with evidence of service delivery</li>
                                <li>Fraudulent chargebacks may result in account termination</li>
                                <li>Contact customer service before initiating chargebacks</li>
                                <li>We cooperate with payment processors to resolve disputes fairly</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">7. Wholesale Payment Terms</h2>
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">For Business Customers</h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Bank Transfer:</strong> Preferred for orders over $1,000</li>
                                    <li><strong>Net 30 Terms:</strong> Available for established wholesale partners with credit approval</li>
                                    <li><strong>Volume Discounts:</strong> Tiered pricing based on order quantity</li>
                                    <li><strong>Recurring Orders:</strong> Automated billing available for subscription orders</li>
                                    <li><strong>International Payments:</strong> SWIFT transfers accepted, sender pays bank fees</li>
                                </ul>
                                <p className="mt-3 text-sm">Apply for wholesale terms at wholesale@mythtoy.com</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">8. Privacy and Data Protection</h2>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Payment information is encrypted and processed through secure gateways</li>
                                <li>We do not store complete credit card numbers on our servers</li>
                                <li>Payment data is handled in compliance with GDPR and CCPA regulations</li>
                                <li>Third-party payment processors are carefully vetted for security compliance</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">9. Contact Information</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">Payment Support</h3>
                                    <p className="text-sm">For payment issues and questions:</p>
                                    <p className="text-blue-600">payments@mythtoy.com</p>
                                    <p className="text-sm mt-2">Response time: 24-48 hours</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">Wholesale Inquiries</h3>
                                    <p className="text-sm">For B2B payment terms:</p>
                                    <p className="text-blue-600">wholesale@mythtoy.com</p>
                                    <p className="text-sm mt-2">Response time: 1 business day</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">10. Policy Updates</h2>
                            <p>We reserve the right to update this payment policy at any time. Changes will be effective immediately upon posting to our website. Major changes will be communicated to active customers via email.</p>
                        </section>

                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                                By completing a purchase with MythToy, you acknowledge that you have read, understood, and agree to this Payment Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}