import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'Understand how MythToy uses cookies to improve your shopping experience, analyze traffic, and ensure site functionality. Manage your preferences here.',
    alternates: {
        canonical: 'https://www.mythtoy.com/pages/cookie-policy',
    },
};

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Cookie Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
                            <p>Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences (like your cart items) and understanding how you use our site.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Types of Cookies We Use</h2>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., logging in, adding items to cart, Age Verification).</li>
                                <li><strong>Authentication Cookies:</strong> Store your login session tokens securely.</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand visitor traffic (Google Analytics).</li>
                                <li><strong>Preference Cookies:</strong> Remember your language or currency settings.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Cookies & Tokens We Use</h2>
                            <p>We use a combination of cookies and local storage tokens to ensure site functionality, security, and personalized experiences.</p>
                            
                            <div className="bg-gray-50 rounded-lg p-6 mt-4 border border-gray-200 overflow-x-auto">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Cookie & Token Inventory</h3>
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead>
                                        <tr className="border-b-2 border-gray-300 bg-white">
                                            <th className="text-left py-3 px-4 font-bold text-gray-800">Name</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-800">Purpose</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-800">Duration</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-800">Storage</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        <tr className="border-b border-gray-200 bg-white">
                                            <td className="py-3 px-4 font-semibold text-gray-900">Access Token</td>
                                            <td className="py-3 px-4">API authentication & session management</td>
                                            <td className="py-3 px-4">30 minutes</td>
                                            <td className="py-3 px-4">Cookie / localStorage</td>
                                        </tr>
                                        <tr className="border-b border-gray-200 bg-white">
                                            <td className="py-3 px-4 font-semibold text-gray-900">Refresh Token</td>
                                            <td className="py-3 px-4">Silently renew sessions without re-login</td>
                                            <td className="py-3 px-4">7 days</td>
                                            <td className="py-3 px-4">Cookie / localStorage</td>
                                        </tr>
                                        <tr className="border-b border-gray-200 bg-white">
                                            <td className="py-3 px-4 font-semibold text-gray-900">Session ID</td>
                                            <td className="py-3 px-4">Guest shopping cart persistence</td>
                                            <td className="py-3 px-4">30 days</td>
                                            <td className="py-3 px-4">localStorage (Header)</td>
                                        </tr>
                                        <tr className="border-b border-gray-200 bg-white">
                                            <td className="py-3 px-4 font-semibold text-gray-900">Affiliate Code</td>
                                            <td className="py-3 px-4">Track referral sources for commission attribution</td>
                                            <td className="py-3 px-4">30 days</td>
                                            <td className="py-3 px-4">Cookie / localStorage</td>
                                        </tr>
                                        <tr className="bg-white">
                                            <td className="py-3 px-4 font-semibold text-gray-900">Password Reset Token</td>
                                            <td className="py-3 px-4">Secure password recovery (single-use)</td>
                                            <td className="py-3 px-4">2 hours</td>
                                            <td className="py-3 px-4">Database + URL</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 space-y-6">
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                        <span className="text-lg"></span> Affiliate & Referral Tracking
                                    </h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        When you visit via an affiliate link (e.g., <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">?aff=CODE</code>), 
                                        we store the referral code in your browser for <strong>30 days</strong>. This ensures the referring partner 
                                        receives proper credit if you make a purchase during this period. 
                                        <span className="block mt-2 font-medium">📌 This only tracks the referral source — not your personal identity or browsing history.</span>
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="text-lg">🔐</span> Security Measures
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-700">
                                        <li>All tokens are transmitted exclusively over <strong>HTTPS</strong> connections.</li>
                                        <li>Access tokens automatically refresh <strong>30 seconds</strong> before expiration to prevent interruptions.</li>
                                        <li>Authentication tokens are <strong>immediately cleared</strong> upon logout.</li>
                                        <li>Password reset tokens are <strong>single-use</strong> and expire after first access.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Managing Your Cookies</h2>
                            <p>You can choose to disable cookies through your browser settings. However, please note that disabling "Essential Cookies" may prevent you from checking out or using the shopping cart.</p>
                            <p className="mt-2">To manage authentication cookies specifically:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><strong>Log Out:</strong> Click the "Sign Out" button in your account menu to clear all authentication tokens.</li>
                                <li><strong>Browser Settings:</strong> Clear cookies through your browser's privacy settings (note: this will log you out).</li>
                                <li><strong>Incognito Mode:</strong> Use private browsing to prevent persistent cookie storage.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact</h2>
                            <p>If you have questions about our Cookie usage or token management, please contact:</p>
                            <p className="font-semibold">support@mythtoy.com</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}export const dynamic = 'force-dynamic'; 
