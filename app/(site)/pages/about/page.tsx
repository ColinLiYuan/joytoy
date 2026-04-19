// app/pages/about/route.ts
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, Gem, MoveRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us | MythToy - Pleasure, Demystified.',
    description: 'We believe intimacy shouldn\'t be complicated. MythToy bridges the gap between premium manufacturing and your bedroom.',
};

export default function About() {
    return (
        <div className="bg-white w-full overflow-x-hidden">

            {/* 1. Hero Section: 极简纯白背景 */}
            <section className="relative py-24 md:py-32 bg-white">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="text-[#C5A059] font-bold tracking-[0.2em] uppercase text-xs mb-6 block animate-fade-in-up">
                        Our Philosophy
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 leading-[1.1] animate-fade-in-up delay-100">
                        Pleasure, <i className="font-light text-gray-400">Demystified.</i>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-light font-sans leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
                        We believe intimacy shouldn't be complicated or overpriced.
                        <strong className="text-[#1A1A1A] font-medium"> MythToy</strong> exists to bridge the gap between premium manufacturing and your bedroom—delivering honest quality without the luxury markup.
                    </p>
                </div>
            </section>

            {/* 2. Story Section: Born at the Source */}
            <section className="py-16 md:py-24 border-t border-gray-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Image Side: 设计感图片 (黑白手稿/工作室) */}
                        <div className="order-2 md:order-1 relative h-[500px] bg-[#F5F5F7] overflow-hidden group">
                            {/* 使用 Unsplash 的一张极简设计/工作室风格图 */}
                            <Image
                                src="https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?auto=format&fit=crop&q=80&w=1000"
                                alt="MythToy Design Studio"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
                            />
                            {/* 装饰性遮罩 */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>

                        {/* Text Side */}
                        <div className="order-1 md:order-2 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight">
                                Born at the <br/>
                                <span className="italic text-gray-400">Source.</span>
                            </h2>
                            <div className="space-y-6 text-gray-500 font-light text-lg leading-relaxed">
                                <p>
                                    We started with a simple question: <span className="text-[#1A1A1A] italic">"Why do premium toys cost so much?"</span>
                                </p>
                                <p>
                                    The answer wasn't quality—it was marketing. Located at the global hub of wellness innovation, we have direct access to the same craftsmen who build for the world's top luxury brands.
                                </p>
                                <p>
                                    We bypass the middlemen, the branding hype, and the retail markups to bring you factory-direct curation. Same materials, same engines, <strong>honest prices.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Three Pillars (Values) */}
            <section className="py-24 bg-[#F9F9F9]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3 block">
                            Why MythToy
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                            The MythToy Difference
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Card 1: Purity */}
                        <div className="flex flex-col items-start space-y-4 group">
                            <ShieldCheck size={40} strokeWidth={1} className="text-[#1A1A1A] mb-2 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-serif font-medium text-[#1A1A1A]">Medical-Grade Purity</h3>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">
                                We strictly use body-safe silicone and non-toxic ABS. If we wouldn't use it ourselves, we won't sell it to you.
                            </p>
                        </div>

                        {/* Card 2: Privacy */}
                        <div className="flex flex-col items-start space-y-4 group">
                            <Lock size={40} strokeWidth={1} className="text-[#1A1A1A] mb-2 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-serif font-medium text-[#1A1A1A]">Ironclad Privacy</h3>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">
                                Your business is yours alone. From unbranded packaging to generic billing descriptors, we protect your privacy as fiercely as our own.
                            </p>
                        </div>

                        {/* Card 3: Curation */}
                        <div className="flex flex-col items-start space-y-4 group">
                            <Gem size={40} strokeWidth={1} className="text-[#1A1A1A] mb-2 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-serif font-medium text-[#1A1A1A]">Curated, Not Cluttered</h3>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">
                                We don't sell everything. We test hundreds of products to select the top 1%. No fillers, no gimmicks, just the best in class.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Minimalist CTA */}
            <section className="py-24 bg-[#1A1A1A] text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8">
                        Experience the <span className="italic text-[#C5A059]">Truth</span>.
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-12 font-light text-lg">
                        Ready to see beyond the myth? Explore our collection of thoughtfully designed products.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/collections/all"
                            className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors duration-300 min-w-[200px]"
                        >
                            Shop Collection
                        </Link>
                        <Link
                            href="/pages/contact"
                            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#C5A059] transition-colors"
                        >
                            Contact Us <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}export const dynamic = 'force-dynamic'; 
