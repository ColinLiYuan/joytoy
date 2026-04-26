import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Terms of Service | MythToy - User Agreement & Legal Info',
    description: 'Read the Terms of Service for MythToy. Understand the rules, regulations, age restrictions (18+), and agreements for using our website and purchasing adult products.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms of Service | MythToy',
        description: 'User agreement and legal terms for using MythToy.',
        url: 'https://mythtoy.com/pages/terms-and-conditions',
        type: 'website',
    },
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Terms of Service</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Operator Information</h2>
                            <p>This website is operated by MythToy. Throughout the website, the terms "we", "us" and "our" refer to MythToy.</p>
                            <p>By accessing, browsing, ordering products, or registering for, or otherwise using the Website, you acknowledge that you have read and understood these Terms and that you accept and agree to be bound by them in full.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Age Restriction (18+)</h2>
                            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                <p className="text-red-800 font-medium">
                                    You must be at least 18 years old (or the age of majority in your jurisdiction) to access and use this website.
                                </p>
                            </div>
                            <p className="mt-4">By accessing this site, you warrant that you are of legal age to purchase adult products in your location. The Website is not available for use by persons under the age of 18.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Products & Use</h2>
                            <p>All products sold are for personal use only. We reserve the right to refuse service to anyone at our discretion. Product descriptions and images are for illustrative purposes and may vary from actual products.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Shipping & Returns</h2>
                            <p>All packages are shipped discreetly. Due to the nature of our products (intimate items), we generally do not accept returns on opened items unless defective. Please refer to our <a href="/pages/return-refund" className="text-blue-600 hover:underline">Return Policy</a> for details.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimer</h2>
                            <p>Products are sold "as is" without any warranties. Users are responsible for reading product instructions and using items safely. Consult a healthcare professional if you have any medical conditions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Contact Information</h2>
                            <p>Questions about the Terms of Service should be sent to us at:</p>
                            <ul className="list-none pl-0 mt-4 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <li><strong>Email:</strong> support@mythtoy.com</li>
                                <li><strong>Address:</strong> 123 MythToy Avenue, Commerce Park, NV 89101, United States</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}export const dynamic = 'force-dynamic'; 
