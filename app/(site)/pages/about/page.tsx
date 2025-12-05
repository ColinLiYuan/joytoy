// pages/about/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import { Diamond, HeartHandshake, ShieldCheck, Factory } from 'lucide-react'; // ✅ 替换为 Lucide

export const metadata: Metadata = {
    title: 'About Us | MythToy - Beyond the Myth',
    description: 'Discover the story behind MythToy. Direct from the source, we provide high-quality, safe, and innovative adult products with complete discretion.',
};

export default function About() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gray-50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 opacity-50"></div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                    <span className="text-pink-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
                        Beyond the Myth
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-['Inter']">
                        Every myth contains a kernel of truth. At <strong className="text-gray-900">MythToy</strong>, our truth is simple:
                        everyone deserves access to safe, innovative, and high-quality intimate products without the mystery.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 max-w-6xl">

                    {/* The Source Advantage */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div className="order-2 md:order-1">
                            <div className="bg-gray-100 rounded-3xl h-[400px] w-full relative overflow-hidden flex items-center justify-center">
                                <div className="text-gray-300">
                                    {/* ✅ 使用 Lucide 图标 */}
                                    <Factory size={120} strokeWidth={1} className="opacity-20" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">The Insider Advantage</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                Founded in the heart of the world's largest adult products manufacturing hub, we have a unique advantage.
                                <strong>We're not just distributors; we're insiders.</strong>
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                This direct access allows us to cut through the noise, offering you products that are the result of
                                genuine expertise and cutting-edge manufacturing. No middlemen, no marketing hype—just exceptional quality at honest prices.
                            </p>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">The MythToy Difference</h2>
                            <div className="w-20 h-1 bg-pink-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-gray-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-pink-600">
                                    <Diamond size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Uncompromising Quality</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We believe quality is non-negotiable. Our products are designed with safety, sensation, and durability as the top priorities.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gray-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-purple-600">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Discretion Assured</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Your privacy is paramount. From plain packaging to discreet billing, every order is handled with the utmost respect.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-gray-50 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
                                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-blue-600">
                                    <HeartHandshake size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Source Intelligence</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Better prices, authentic materials, and direct quality control. We bring the factory floor's precision directly to your door.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-black text-white rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-900 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-['Playfair_Display']">Experience the Truth</h2>
                            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
                                Ready to see beyond the myth? Explore our collection of thoughtfully designed products or speak directly with our team.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/collections/all"
                                    className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300"
                                >
                                    Explore Products
                                </Link>
                                <Link
                                    href="/pages/contact"
                                    className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors duration-300"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}