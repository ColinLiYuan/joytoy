'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { getProductImageUrl } from '@/lib/image-utils';
import { Instagram, ArrowRight, CheckCircle, Sparkles, Shield, Clock } from 'lucide-react';
// 这是您的页面组件
export default function ThankYouPage() {
    return (
        <Suspense fallback={
            <div
                className="min-h-screen relative overflow-hidden flex items-center justify-center"
                style={{
                    background: 'radial-gradient(ellipse at 50% 30%, #0a0a0a 0%, #050505 70%)',
                }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}

// 主要内容组件
function ThankYouContent() {
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(10);
    const [isVisible, setIsVisible] = useState(false);

    const email = searchParams.get('email') || 'your email';

    useEffect(() => {
        // 入场动画
        setTimeout(() => setIsVisible(true), 100);

        // 倒计时重定向
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 金属质感渐变
    const goldGradientStyle = {
        background: 'linear-gradient(135deg, #C5A059 0%, #E8D9A9 25%, #B38728 50%, #D4AF37 75%, #AA771C 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 20px rgba(197, 160, 89, 0.2)'
    };

    const silverGradientStyle = {
        background: 'linear-gradient(135deg, #E8E8E8 0%, #B0B0B0 50%, #7D7D7D 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    return (
        // 主容器 - 暗黑背景
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background: 'radial-gradient(ellipse at 50% 30%, #0a0a0a 0%, #050505 70%)',
            }}
        >
            {/* 纹理叠加 */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{
                    backgroundImage: `
                        linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.02) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.02) 75%)
                    `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* 装饰性粒子背景 */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            background: `rgba(197, 160, 89, ${Math.random() * 0.3 + 0.1})`,
                            filter: 'blur(1px)',
                            animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
                            animationDelay: Math.random() * 5 + 's'
                        }}
                    />
                ))}
            </div>

            {/* 主要内容 */}
            <div className={`relative z-10 container mx-auto px-8 md:px-16 lg:px-24 py-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-6xl mx-auto">

                    {/* 顶部装饰 */}
                    <div className="flex flex-col items-center mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
                            <span className="text-[10px] tracking-[0.4em] text-[#C5A059]/80 uppercase font-bold">
                                Application Confirmed
                            </span>
                            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
                        </div>

                        {/* 确认图标 */}
                        <div className="relative mb-12">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 flex items-center justify-center">
                                <CheckCircle className="w-20 h-20" style={goldGradientStyle} />
                                <div className="absolute inset-0 rounded-full border border-[#C5A059]/30 animate-ping opacity-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* 主标题 */}
                    <div className="text-center mb-16">
                        <h1
                            className="text-6xl md:text-8xl font-bold font-['Playfair_Display'] leading-[1.1] mb-8 tracking-tight"
                            style={goldGradientStyle}
                        >
                            Welcome, <br/> Pioneer
                        </h1>
                        <p className="text-gray-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
                            Your application has been sealed into our dark ledger. An exclusive invitation is now being forged for you.
                        </p>
                    </div>

                    {/* 产品预览卡 */}
                    <div className="relative max-w-3xl mx-auto mb-20 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/5 via-transparent to-[#C5A059]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

                        <div className="relative bg-gradient-to-b from-gray-900/50 to-black/50 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                            <div className="grid md:grid-cols-2 gap-8 p-8">
                                {/* 产品图 */}
                                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden border border-gray-800/50">
                                    <Image
                                        src={getProductImageUrl('', 'the-onyx-d1.png')}
                                        alt="Onyx Black Gold Edition - Your Pioneer Reward"
                                        fill
                                        className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[3s] ease-out"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-xs tracking-[0.2em] text-[#C5A059]/90 uppercase font-medium">
                                            Your ONYX
                                        </span>
                                    </div>
                                </div>

                                {/* 产品详情 */}
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold mb-4" style={silverGradientStyle}>
                                        ONYX - Black Gold Edition
                                    </h3>
                                    <p className="text-gray-400 font-light mb-6">
                                        Forged in darkness, polished to perfection. Your piece of the myth awaits.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-[#C5A059]" />
                                            <span className="text-sm text-gray-300">Limited to 10 pioneers worldwide</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-[#C5A059]" />
                                            <span className="text-sm text-gray-300">Estimated dispatch: 5-7 working days</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="w-5 h-5 text-[#C5A059]" />
                                            <span className="text-sm text-gray-300">Custom black gold finish</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 下一步指引 */}
                    <div className="max-w-2xl mx-auto mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-6" style={silverGradientStyle}>
                                What Happens Next
                            </h2>
                            <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: '01',
                                    title: 'Curatorial Review',
                                    desc: 'Our council reviews each application for alignment with the myth.',
                                    time: '24-48 hours'
                                },
                                {
                                    step: '02',
                                    title: 'Invitation Dispatch',
                                    desc: 'Selected pioneers receive their exclusive shipping details.',
                                    time: 'Via email'
                                },
                                {
                                    step: '03',
                                    title: 'The Arrival',
                                    desc: 'Your ONYX arrives in custom black packaging. The ritual begins.',
                                    time: '7-20 days'
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative group p-6 border border-gray-800/50 rounded-xl hover:border-[#C5A059]/30 transition-all duration-500"
                                >
                                    <div className="text-[#C5A059]/40 text-6xl font-bold absolute -top-4 -left-2 opacity-20 group-hover:opacity-30 transition-opacity">
                                        {item.step}
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                                        <p className="text-gray-400 text-sm font-light mb-4">{item.desc}</p>
                                        <div className="text-xs text-[#C5A059] tracking-[0.2em] uppercase">
                                            {item.time}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-[#C5A059] to-transparent transition-all duration-700"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 行动按钮 */}
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="text-center mb-8">
                            <p className="text-gray-500 text-sm font-light mb-4">
                                Keep an eye on <span className="text-[#C5A059] font-medium">{email}</span>
                            </p>
                            <p className="text-xs text-gray-600">
                                Redirecting in <span className="text-[#C5A059]">{countdown}</span> seconds
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 h-16 bg-transparent border border-gray-800 text-white font-bold uppercase tracking-[0.3em] text-[10px] hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-500 flex items-center justify-center group"
                            >
                                <span className="flex items-center gap-3">
                                    Return to Darkness <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} />
                                </span>
                            </Link>

                            <Link
                                href="https://instagram.com/myth.w.studio"
                                className="flex-1 h-16 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#C5A059] hover:text-white transition-all duration-500 flex items-center justify-center group"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="flex items-center gap-3">
                                    Follow the Myth <Instagram size={14} />
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* 底部装饰 */}
                    <footer className="mt-24 pt-8 border-t border-gray-800/30">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[9px] tracking-[0.3em] uppercase text-gray-600">
                                This invitation is bound by digital silk. Do not share.
                            </p>

                            <div className="flex items-center gap-6">
                                <span className="text-xs text-gray-500">MythToy © 2024</span>
                                <Link
                                    href="/privacy"
                                    className="text-[10px] tracking-[0.2em] text-gray-600 hover:text-[#C5A059] transition-colors uppercase"
                                >
                                    Privacy Ritual
                                </Link>
                                <Link
                                    href="/terms"
                                    className="text-[10px] tracking-[0.2em] text-gray-600 hover:text-[#C5A059] transition-colors uppercase"
                                >
                                    Terms of Darkness
                                </Link>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            {/* CSS动画 */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                .animate-ping {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}