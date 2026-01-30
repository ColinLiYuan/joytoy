'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { submitPioneerApplication } from '@/app/actions/pioneer';
import { getProductImageUrl } from '@/lib/image-utils';
import { COUNTRIES_FOR_SELECT } from '@/lib/constants/country-data';
import { useToast } from '@/contexts/toastContext';
import { Loader2, Instagram, ArrowRight, Globe } from 'lucide-react';

export default function PioneerPage() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    // 优化的金属渐变 - 更深的金色调
    const goldGradientStyle = {
        background: 'linear-gradient(135deg, #C5A059 0%, #E8D9A9 25%, #B38728 50%, #D4AF37 75%, #AA771C 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 10px rgba(197, 160, 89, 0.15)'
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const result = await submitPioneerApplication(formData);

        if (result.success) {
            router.push('/pioneer/thank-you');
        } else {
            showToast('error', 'Error', result.error || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        // 主容器 - 添加纹理背景
        <div
            className="flex flex-col lg:flex-row min-h-screen selection:bg-[#C5A059]/30 relative"
            style={{
                background: 'radial-gradient(ellipse at top, #0a0a0a 0%, #050505 70%)',
            }}
        >
            {/* 纹理叠加层 - 增加磨砂质感 */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* 左侧：产品视觉区 (50%) */}
            <div className="relative w-full lg:w-1/2 h-[60vh] lg:h-screen lg:sticky lg:top-0 overflow-hidden border-r border-white/5 bg-black">
                {/* 产品主图 - Onyx 特写 */}
                <Image
                    src={getProductImageUrl('', 'the-onyx-d1.png')}
                    alt="Onyx Black Gold Edition - MythToy Pioneer Collection"
                    fill
                    className="object-cover scale-[1.02] lg:scale-100 hover:scale-105 transition-transform duration-[4s] ease-out"
                    priority
                    sizes="50vw"
                />

                {/* 多层渐变遮罩 - 创造深度感 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-[#050505]/50 via-transparent to-transparent lg:hidden" />

                {/* 产品名称装饰 */}
                <div className="absolute bottom-8 left-8 hidden lg:block">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-[#C5A059] to-transparent"></div>
                        <span className="text-xs tracking-[0.3em] text-[#C5A059]/80 uppercase font-light">
                            ONYX BLACK GOLD
                        </span>
                    </div>
                </div>

                {/* 移动端标题 */}
                <div className="absolute bottom-12 left-8 lg:hidden">
                    <h1 className="text-4xl font-bold font-['Playfair_Display'] tracking-tight text-white">
                        The Pioneer <br/> Program
                    </h1>
                </div>
            </div>

            {/* 右侧：内容与表单区 (50%) */}
            <div className="relative w-full lg:w-1/2 flex flex-col justify-center py-20 px-8 md:px-16 lg:px-24">
                <div className="max-w-xl mx-auto lg:mx-0 w-full">
                    {/* Header */}
                    <header className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-[1px] w-8 bg-gradient-to-r from-[#C5A059] to-transparent"></span>
                            <span className="text-[10px] tracking-[0.4em] text-[#C5A059]/80 uppercase font-bold">
                                Exclusive Invitation
                            </span>
                        </div>
                        <h1
                            className="text-5xl md:text-7xl font-bold font-['Playfair_Display'] leading-[1.05] mb-8 tracking-wide"
                            style={goldGradientStyle}
                        >
                            The Myth <br/> Pioneer
                        </h1>
                        <p className="text-gray-400 font-light leading-relaxed text-lg max-w-md pl-2">
                            We are redefining the intimate experience. For our 'Black Gold' collection, we seek 10 pioneers to review the rituals of darkness.
                        </p>
                    </header>

                    {/* Meta Info - 增加金色装饰线 */}
                    <div className="relative mb-16 pb-8">
                        <div className="flex gap-12 mb-8">
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-2">Benefit</p>
                                <p className="text-sm font-bold tracking-wide text-white">
                                    FREE ONYX <span className="text-[#C5A059]">($69)</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-2">Commitment</p>
                                <p className="text-sm font-medium tracking-wide text-white">Unboxing & Review</p>
                            </div>
                        </div>
                        {/* 装饰线 */}
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-12 pl-2">
                        {/* Name */}
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-[#C5A059] transition-colors duration-300">
                                Name / Alias
                            </label>
                            <input
                                required
                                name="name"
                                type="text"
                                placeholder="How should we address you?"
                                className="w-full bg-transparent border-b border-gray-800 py-4 text-white focus:outline-none focus:border-[#C5A059] hover:border-gray-700 transition-all duration-300 placeholder:text-gray-600 font-light"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-[#C5A059] transition-colors duration-300">
                                Email Address
                            </label>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="Where the myth begins"
                                className="w-full bg-transparent border-b border-gray-800 py-4 text-white focus:outline-none focus:border-[#C5A059] hover:border-gray-700 transition-all duration-300 placeholder:text-gray-600 font-light"
                            />
                        </div>

                        {/* Social */}
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-[#C5A059] transition-colors duration-300">
                                Social Handle
                            </label>
                            <input
                                required
                                name="social"
                                type="text"
                                placeholder="u/Reddit or @Instagram"
                                className="w-full bg-transparent border-b border-gray-800 py-4 text-white focus:outline-none focus:border-[#C5A059] hover:border-gray-700 transition-all duration-300 placeholder:text-gray-600 font-light"
                            />
                        </div>

                        {/* Country */}
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-[#C5A059] transition-colors duration-300 block mb-2">
                                Shipping Country
                            </label>
                            <div className="relative">
                                <select
                                    name="country"
                                    className="w-full bg-transparent border-b border-gray-800 py-4 text-white focus:outline-none focus:border-[#C5A059] hover:border-gray-700 transition-all duration-300 font-light appearance-none cursor-pointer"
                                >
                                    {COUNTRIES_FOR_SELECT.map(country => (
                                        <option key={country} value={country} className="bg-[#111] text-white">
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                <Globe size={14} className="absolute right-2 top-5 text-gray-600 pointer-events-none" />
                            </div>
                        </div>

                        {/* Pitch */}
                        <div className="relative group">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-gray-500 group-focus-within:text-[#C5A059] transition-colors duration-300">
                                Why you?
                            </label>
                            <textarea
                                required
                                name="pitch"
                                rows={1}
                                placeholder="Tell us about your unboxing vibe..."
                                className="w-full bg-transparent border-b border-gray-800 py-4 text-white focus:outline-none focus:border-[#C5A059] hover:border-gray-700 transition-all duration-300 placeholder:text-gray-600 font-light resize-none"
                            />
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-4 pl-2">
                            <input
                                required
                                type="checkbox"
                                id="agree"
                                className="w-4 h-4 rounded-none accent-[#C5A059] bg-transparent border-gray-800 checked:border-[#C5A059] transition-colors duration-300"
                            />
                            <label htmlFor="agree" className="text-[11px] text-gray-500 font-light">
                                I agree to provide a review within 7 days of arrival.
                            </label>
                        </div>

                        {/* CTA Button */}
                        <button
                            disabled={loading}
                            className="relative w-full h-16 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#C5A059] hover:text-white transition-all duration-700 flex items-center justify-center group overflow-hidden mt-8"
                        >
                            {/* Button背景效果 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white to-gray-200 group-hover:from-[#C5A059] group-hover:to-[#B38728] transition-all duration-700"></div>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                            </div>

                            {/* Button文字 */}
                            <span className="relative z-10 flex items-center gap-3">
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Apply for Access
                                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <footer className="mt-24 flex items-center justify-between opacity-40 hover:opacity-70 transition-opacity duration-300 pl-2">
                        <p className="text-[9px] tracking-[0.3em] uppercase text-gray-500">MythToy © 2024</p>
                        <a
                            href="https://instagram.com/mythtoy"
                            className="hover:text-[#C5A059] transition-colors duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram size={16} />
                        </a>
                    </footer>
                </div>
            </div>
        </div>
    );
}