import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Cookie Policy | MythToy',
    description: 'Understand how MythToy uses cookies to improve your shopping experience, analyze traffic, and ensure site functionality. Manage your preferences here.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/cookie-policy',
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
                                <li><strong>Analytics Cookies:</strong> Help us understand visitor traffic (Google Analytics).</li>
                                <li><strong>Preference Cookies:</strong> Remember your language or currency settings.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Managing Your Cookies</h2>
                            <p>You can choose to disable cookies through your browser settings. However, please note that disabling "Essential Cookies" may prevent you from checking out or using the shopping cart.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Contact</h2>
                            <p>If you have questions about our Cookie usage, please contact:</p>
                            <p className="font-semibold">privacy@mythtoy.com</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}