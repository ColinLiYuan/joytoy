// app/pages/affiliate/page.tsx
import { Metadata } from 'next';
import PolicyNav from '@/components/policy-nav';

export const metadata: Metadata = {
    title: 'Affiliate Program | MythToy',
    description: 'Join the MythToy Affiliate Program. Earn 10% - 25% commission and get free products by sharing premium adult lifestyle products.',
};

export default function AffiliatePage() {
    return (
        <div className="min-h-screen bg-white py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Centered Navigation */}
                <PolicyNav />

                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-[42px] font-bold text-gray-900 mb-4 font-['Playfair_Display']">
                            Affiliate Program
                        </h1>
                        <p className="text-gray-400 text-sm font-['Inter']">Last updated: March 2026</p>
                    </div>

                    {/* Content Section */}
                    <div className="prose prose-neutral max-w-none text-[15px] leading-relaxed text-gray-600 font-['Inter'] space-y-12">

                        <section>
                            <h2 className="text-[20px] font-bold text-gray-900 mb-4">1. Overview</h2>
                            <p>
                                MythToy invites creative partners and influencers to join our community. By recommending our high-end, discreetly packaged products to your audience, you can earn industry-leading rewards. We provide all the tools you need to turn your influence into a sustainable revenue stream.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-bold text-gray-900 mb-4">2. Commissions & Earnings</h2>
                            <p className="mb-4">We offer a highly competitive incentive structure to reward our dedicated partners:</p>
                            <ul className="list-disc pl-5 space-y-3">
                                <li><strong className="text-gray-900">Commission Rates:</strong> Earn <span className="text-black font-bold">10% - 25%</span> per sale based on your performance tier.</li>
                                <li><strong className="text-gray-900">Exclusive Links:</strong> You will receive unique affiliate tracking links to ensure every conversion is accurately recorded.</li>
                                <li><strong className="text-gray-900">30-Day Cookie:</strong> Enjoy a long tracking window—get credited for any purchase made within 30 days of the initial click.</li>
                                <li><strong className="text-gray-900">Reliable Payouts:</strong> Monthly payments processed via PayPal or Wire Transfer (Min. threshold $50).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[20px] font-bold text-gray-900 mb-4">3. Exclusive Partner Perks</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <ul className="space-y-4 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">●</span>
                                        <span><strong className="text-gray-900">Free Product Samples:</strong> Top-performing creators are eligible to receive our latest releases for reviews, unboxings, and content creation at no cost.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">●</span>
                                        <span><strong className="text-gray-900">Creative Assets:</strong> Gain access to a professional library of high-res photography, video clips, and high-converting banners.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-black font-bold">●</span>
                                        <span><strong className="text-gray-900">Real-time Dashboard:</strong> Track your clicks, orders, and pending commissions through your personal affiliate portal.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="pt-10 border-t border-gray-100 text-center sm:text-left">
                            <h2 className="text-[20px] font-bold text-gray-900 mb-4">4. How to Apply?</h2>
                            <p className="mb-8 text-gray-500">
                                Whether you are a blogger, a sex-tech reviewer, or a social media influencer, we value your voice. If you share our aesthetic and passion for pleasure, we want to hear from you.
                            </p>
                            <div className="flex justify-center sm:justify-start">
                                <a
                                    href="mailto:affiliate@mythtoy.com"
                                    className="inline-block border border-black text-black px-12 py-4 text-xs font-bold hover:bg-black hover:text-white transition-all uppercase tracking-[0.2em]"
                                >
                                    Apply Now
                                </a>
                            </div>
                            <p className="mt-4 text-[12px] text-gray-400 italic">
                                * Applications are typically reviewed within 2 business days.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}