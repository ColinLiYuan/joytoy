// app/cookie-policy/page.tsx
export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Cookie Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <p className="text-sm text-gray-500">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">1. What Are Cookies?</h2>
                            <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and showing you relevant content.</p>
                            <p>Cookies may be set by us (first-party cookies) or by third parties we partner with (third-party cookies).</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">2. How We Use Cookies</h2>
                            <p>MythToy uses cookies for several purposes:</p>

                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Essential Cookies</h3>
                                    </div>
                                    <p className="text-sm">Required for basic website functionality:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                        <li>User authentication and login sessions</li>
                                        <li>Shopping cart and checkout process</li>
                                        <li>Age verification</li>
                                        <li>Security and fraud prevention</li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                                    </div>
                                    <p className="text-sm">Help us understand how visitors interact:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                        <li>Page visits and navigation paths</li>
                                        <li>Time spent on site</li>
                                        <li>Error tracking and performance</li>
                                        <li>Website improvement insights</li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Preference Cookies</h3>
                                    </div>
                                    <p className="text-sm">Remember your settings and choices:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                        <li>Language and currency preferences</li>
                                        <li>Recently viewed products</li>
                                        <li>Wishlist items</li>
                                        <li>Customized content display</li>
                                    </ul>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold">Marketing Cookies</h3>
                                    </div>
                                    <p className="text-sm">Deliver relevant advertising:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                                        <li>Personalized product recommendations</li>
                                        <li>Retargeting campaigns</li>
                                        <li>Social media integration</li>
                                        <li>Advertising performance tracking</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">3. Types of Cookies We Use</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Cookie Type</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Session Cookies</td>
                                        <td className="border border-gray-300 px-4 py-2">Maintain your login session and shopping cart</td>
                                        <td className="border border-gray-300 px-4 py-2">Until browser closes</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Authentication Cookies</td>
                                        <td className="border border-gray-300 px-4 py-2">Remember your login status</td>
                                        <td className="border border-gray-300 px-4 py-2">30 days</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Preference Cookies</td>
                                        <td className="border border-gray-300 px-4 py-2">Store your language and currency settings</td>
                                        <td className="border border-gray-300 px-4 py-2">1 year</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Analytics Cookies</td>
                                        <td className="border border-gray-300 px-4 py-2">Track website usage and performance</td>
                                        <td className="border border-gray-300 px-4 py-2">2 years</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Marketing Cookies</td>
                                        <td className="border border-gray-300 px-4 py-2">Personalize advertising content</td>
                                        <td className="border border-gray-300 px-4 py-2">90 days</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">4. Third-Party Cookies</h2>
                            <p>We work with trusted third parties that may set cookies on our website:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior</li>
                                <li><strong>Payment Processors:</strong> Secure payment processing (PayPal, Stripe)</li>
                                <li><strong>Social Media Platforms:</strong> Social sharing and advertising (Facebook, Instagram)</li>
                                <li><strong>Advertising Networks:</strong> Personalized ad delivery and measurement</li>
                                <li><strong>Customer Support:</strong> Live chat and helpdesk services</li>
                            </ul>
                            <p className="mt-3">These third parties have their own privacy policies and cookie practices.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">5. Managing Your Cookie Preferences</h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Cookie Consent Banner</h3>
                            <p>When you first visit our website, you'll see a cookie consent banner where you can:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Accept all cookies</li>
                                <li>Reject non-essential cookies</li>
                                <li>Customize your cookie preferences</li>
                                <li>Learn more about our cookie usage</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Browser Controls</h3>
                            <p>You can manage cookies through your browser settings:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Opt-Out Tools</h3>
                            <p>For advertising and analytics cookies:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Google Analytics Opt-Out Browser Add-on</li>
                                <li>Digital Advertising Alliance (DAA) opt-out page</li>
                                <li>Network Advertising Initiative (NAI) opt-out page</li>
                                <li>Your Online Choices (for EU users)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">6. What Happens If You Disable Cookies?</h2>
                            <p>If you choose to disable cookies, some features of our website may not function properly:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>You may need to re-enter your login information frequently</li>
                                <li>Shopping cart items may not be saved between sessions</li>
                                <li>Personalized content and recommendations may not work</li>
                                <li>Some website features may be unavailable</li>
                                <li>Age verification may be required on each visit</li>
                            </ul>
                            <p className="mt-3">Essential cookies required for security and basic functionality cannot be disabled.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">7. Legal Compliance</h2>
                            <p>Our use of cookies complies with:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>GDPR (General Data Protection Regulation):</strong> For users in the European Union</li>
                                <li><strong>ePrivacy Directive:</strong> Requires consent for non-essential cookies</li>
                                <li><strong>CCPA (California Consumer Privacy Act):</strong> For California residents</li>
                                <li><strong>Other applicable national laws:</strong> Based on user location</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">8. Updates to This Policy</h2>
                            <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our services. The "Last updated" date at the top of this page indicates when the policy was last revised.</p>
                            <p className="mt-3">We encourage you to review this policy periodically to stay informed about our use of cookies.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">9. Contact Information</h2>
                            <p>If you have any questions about our use of cookies, please contact us:</p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Email: privacy@mythtoy.com</li>
                                <li>Data Protection Officer: dpo@mythtoy.com</li>
                                <li>Address: [Your Business Address]</li>
                            </ul>
                        </section>

                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                                By continuing to use our website after being informed about our use of cookies, you consent to our cookie practices as described in this policy, unless you have disabled cookies through your browser settings or our cookie consent tool.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}