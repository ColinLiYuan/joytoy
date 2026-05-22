// app/pages/return-refund/route.ts

import { Metadata } from 'next';
import { Suspense } from 'react';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Return & Warranty Policy - 1-Year Guarantee',
    description: 'We stand by our quality. Learn about our 1-Year Warranty, replacement process for defective items, and hygiene standards.',
    alternates: {
        canonical: 'https://www.mythtoy.com/pages/return-refund',
    },
};

export const dynamic = 'force-dynamic';

export default function ReturnRefundPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl w-full">
                <PolicyNav />

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Return & Warranty Policy</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-8 font-['Inter']">
                        <p className="text-sm text-gray-500 text-center border-b border-gray-100 pb-6">Last updated: January 2026</p>

                        {/* 1. 核心原则：卫生第一 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="mr-2">🛡️</span> 1. The Golden Rule: Hygiene First
                            </h2>
                            <div className="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500 text-sm">
                                <p className="text-yellow-800 font-medium">
                                    Due to the intimate nature of our products and strict health regulations, <strong>we cannot accept returns or exchanges on opened/used items</strong> unless they are defective.
                                </p>
                                <p className="text-yellow-700 mt-2">
                                    We do not resell returned items. Your safety is our priority.
                                </p>
                            </div>
                        </section>

                        {/* 2. 退货资格 - 明确拒绝“我不喜欢” */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Return Eligibility</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-green-100 bg-green-50/50 rounded-lg p-5">
                                    <h3 className="font-bold text-lg mb-3 text-green-800">✅ Covered (Free Replacement)</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                                        <li>Item arrived damaged or broken.</li>
                                        <li>Item does not turn on/charge (Defective).</li>
                                        <li>Wrong item sent by us.</li>
                                        <li><strong>Mechanical failure within 1 Year.</strong></li>
                                    </ul>
                                </div>
                                <div className="border border-red-100 bg-red-50/50 rounded-lg p-5">
                                    <h3 className="font-bold text-lg mb-3 text-red-800">❌ Not Covered</h3>
                                    <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                                        <li>"I changed my mind" after opening.</li>
                                        <li>"I don't like the vibration strength."</li>
                                        <li>Normal wear and tear.</li>
                                        <li>Water damage due to improper use (e.g., submerged non-waterproof items).</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. 保修条款 - 升级为1年，且强调无需寄回 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">3. The MythToy 1-Year Warranty</h2>
                            <p>We believe in our quality. All electric devices (Muse, Pen, Swan, etc.) come with a <strong>12-Month Manufacturer Warranty</strong>.</p>

                            <div className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-2">🚀 Hassle-Free Claims (No Return Needed)</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    If your toy breaks, <strong>you do NOT need to ship the dirty item back to us.</strong> Simply provide proof, and we will send a brand new replacement.
                                </p>
                                <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
                                    <li>Record a short video showing the defect (e.g., connected to charger but not lighting up).</li>
                                    <li>Email the video + Order ID to <strong>support@mythtoy.com</strong>.</li>
                                    <li>Once approved, we ship your replacement within 48 hours.</li>
                                </ol>
                            </div>
                        </section>

                        {/* 4. 退款流程 */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Refunds for Unopened Items</h2>
                            <p>If you have ordered by mistake and the package is <strong>still factory sealed</strong>, you may return it within 14 days for a refund. You are responsible for return shipping costs.</p>
                            <p className="text-sm text-gray-500 mt-2">Please contact support for the return address. Do not send back to the shipping label address.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
} 
