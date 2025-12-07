import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Return & Refund Policy | MythToy - Shop with Confidence',
    description: 'Our Return and Refund Policy ensures customer satisfaction. Learn about returns for defective items, hygiene standards for intimate products, and our warranty.',
    alternates: {
        canonical: 'https://mythtoy.com/pages/return-refund',
    },
};

export default function ReturnRefundPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Return & Refund Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: April 2025</p>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Important Safety Notice</h2>
                            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                <p className="text-yellow-800 font-medium">
                                    ⚠️ Due to the intimate nature of our products and strict health regulations, we cannot accept returns of used or opened items unless they are defective.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Return Eligibility</h2>
                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2 text-green-700">✓ Eligible for Return</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-2">
                                        <li>Items that arrived defective or damaged</li>
                                        <li>Incorrect items sent by us</li>
                                        <li>Unopened items in original sealed packaging (within 14 days)</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="font-bold text-lg mb-2 text-red-700">✕ Not Eligible</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-2">
                                        <li>Any item that has been opened or seal broken</li>
                                        <li>Used products</li>
                                        <li>Apparel/Lingerie (hygiene reasons)</li>
                                        <li>Clearance or Sale items</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Defective Items (Warranty)</h2>
                            <p>If your item arrives defective or breaks within <strong>30 days</strong> of normal use, we will replace it free of charge.</p>
                            <p>Please email us with a video or photo showing the defect. You typically do NOT need to mail back the defective used toy for hygiene reasons.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. How to Request a Refund</h2>
                            <ol className="list-decimal pl-6 mt-2 space-y-2">
                                <li>Contact our support team at <strong>returns@mythtoy.com</strong>.</li>
                                <li>Include your Order # and a photo of the issue.</li>
                                <li>Wait for authorization. Do not ship items back without approval.</li>
                            </ol>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}