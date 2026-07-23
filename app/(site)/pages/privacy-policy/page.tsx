// app/pages/privacy-policy/route.ts
import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

// ✅ 生成专业的 SEO Metadata
export const metadata: Metadata = {
    title: 'Privacy Policy - Your Data Security is Our Priority',
    description: 'Read the MythToy Privacy Policy. Learn how we protect your personal information, ensure discreet shipping, and secure your payment data.',
    alternates: {
        canonical: 'https://www.mythtoy.com/pages/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy',
        description: 'We are committed to protecting your privacy. Read our full policy here.',
        url: 'https://www.mythtoy.com/pages/privacy-policy',
        type: 'website',
    },
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Privacy Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                            <p>MythToy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>mythtoy.com</strong> and purchase our products.</p>
                            <p>Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Personal Data</h3>
                            <p>We may collect personally identifiable information that you voluntarily provide to us including:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Name and contact information (email address, phone number)</li>
                                <li>Shipping and billing addresses</li>
                                <li>Payment information (credit card details processed securely through payment processors)</li>
                                <li>Date of birth for age verification (18+ requirement)</li>
                                <li>Purchase history and preferences</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2">Derivative Data</h3>
                            <p>Information our servers automatically collect when you access the site:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>IP address and browser type</li>
                                <li>Pages visited and time spent on site</li>
                                <li>Referring website and search terms</li>
                                <li>Device information and operating system</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Process and fulfill your orders discreetly</li>
                                <li>Verify your age and identity</li>
                                <li>Provide customer support and respond to inquiries</li>
                                <li>Send transactional emails (order confirmations, shipping updates)</li>
                                <li>Personalize your shopping experience</li>
                                <li>Improve our website and product offerings</li>
                                <li>Prevent fraud and enhance security</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Legal Basis for Processing (GDPR)</h2>
                            <p>For users in the European Union, we process your personal data under the following legal bases:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Contractual necessity:</strong> Processing necessary for order fulfillment</li>
                                <li><strong>Legal obligation:</strong> Processing required by law (age verification, tax purposes)</li>
                                <li><strong>Legitimate interests:</strong> Fraud prevention, website improvement, marketing</li>
                                <li><strong>Consent:</strong> For marketing communications and cookies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Data Sharing and Disclosure</h2>
                            <p>We may share your information with:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Service Providers:</strong> Payment processors (PayPal), shipping carriers, IT services</li>
                                <li><strong>Business Partners:</strong> Wholesale distributors (for B2B orders)</li>
                                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                            </ul>
                            <p className="mt-3 font-semibold text-gray-900">We never sell your personal data to third parties for marketing purposes.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
                            <p>We implement appropriate technical and organizational security measures including:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>SSL encryption for data transmission</li>
                                <li>Secure payment processing (PCI DSS compliant)</li>
                                <li>Regular security assessments and monitoring</li>
                                <li>Access controls and authentication procedures</li>
                            </ul>
                            <p className="mt-3">While we take reasonable measures, no electronic transmission or storage is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
                            <p>We retain your personal data only as long as necessary for:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Order data:</strong> 7 years for tax and legal compliance</li>
                                <li><strong>Customer accounts:</strong> Until account deletion request</li>
                                <li><strong>Marketing data:</strong> Until consent withdrawal</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Your Rights</h2>
                            <p>Depending on your location, you may have the following rights:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Access:</strong> Request copies of your personal data</li>
                                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                                <li><strong>Restriction:</strong> Limit processing of your data</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                            </ul>
                            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:support@mythtoy.com" className="text-blue-600 hover:underline">support@mythtoy.com</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Age Restrictions</h2>
                            <p>We do not knowingly collect information from individuals under 18 years of age. If we become aware of such collection, we will immediately delete the information. Users must verify they are 18 or older to access our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Contact Information</h2>
                            <p>For privacy-related questions or to exercise your rights, contact us at:</p>
                            <ul className="list-none pl-0 mt-4 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <li><strong>Email:</strong> support@mythtoy.com</li>
                                <li><strong>Phone:</strong> +86 17620189025</li>
                                <li><strong>Address:</strong> Room 306, Building B, No.61 Dongpu 2nd Road, Tianhe District, Guangzhou, Guangdong, China</li>
                            </ul>
                        </section>

                        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
