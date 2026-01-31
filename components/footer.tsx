// components/footer.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Mail, Loader2, CreditCard, CheckCircle2, Copy } from 'lucide-react';
import { useToast } from '@/contexts/toastContext';
import { subscribeToNewsletter } from '@/app/actions/subscribe';

// 自定义 X (Twitter) 图标
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);

// 自定义 Pinterest 图标
const PinterestIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.695-2.419-2.873-2.419-4.629 0-3.772 2.747-7.229 7.93-7.229 4.17 0 6.923 2.97 6.923 6.939 0 4.14-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
);

export default function Footer() {
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null);
    const { showToast } = useToast();

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await subscribeToNewsletter(formData);

        if (result.success) {
            setSuccessCode(result.code || 'MYTH10');
            showToast('success', 'Welcome!', 'Discount code unlocked!');
        } else {
            showToast('error', 'Error', 'Failed to subscribe. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        // 🔴 1. 背景改黑，文字改白，边框改深色
        <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 relative w-full overflow-hidden text-white">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

                    {/* Shop Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-white mb-6 font-['Playfair_Display']">Shop</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li>
                                {/* 链接颜色改为灰色，悬停变金色/白色 */}
                                <Link href="/collections" className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                                    All Collections
                                </Link>
                            </li>
                            <li><Link href="/collections/all" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Shop All</Link></li>
                            <li><Link href="/collections/new-arrivals" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">New In</Link></li>
                            <li><Link href="/collections/best-sellers" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Best Sellers</Link></li>
                            <li><Link href="/collections/female-sex-toys" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">For Her</Link></li>
                            <li><Link href="/collections/male-sex-toys" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">For Him</Link></li>
                            <li><Link href="/pioneer" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Free Product</Link></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-white mb-6 font-['Playfair_Display']">Support</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/contact" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Contact Us</Link></li>
                            <li><Link href="/pages/shipping-policy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Shipping Policy</Link></li>
                            <li><Link href="/pages/return-refund" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Returns & Refund</Link></li>
                            <li><Link href="/pages/order-tracking" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Track Order</Link></li>
                            <li><Link href="/pages/manuals" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Care & Guides</Link></li>
                            <li><Link href="/pages/faq" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-white mb-6 font-['Playfair_Display']">About</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/about" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Our Story</Link></li>
                            <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Blog</Link></li>
                            <li><Link href="/pages/wholesale" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Policies Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-white mb-6 font-['Playfair_Display']">Policies</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link href="/pages/terms-and-conditions" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</Link></li>
                            <li><Link href="/pages/age-verification" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Age Verification</Link></li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div id="footer-subscribe" className="footer-section">
                        <h3 className="text-lg font-bold text-white mb-6 font-['Playfair_Display']">Get 10% Off</h3>

                        {successCode ? (
                            // 订阅成功状态 (深色背景适配)
                            <div className="bg-white/5 border border-white/10 p-5 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-2 text-[#C5A059] font-bold text-sm">
                                    <CheckCircle2 size={18} /> You're subscribed!
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Here is your exclusive code:</p>

                                <div
                                    className="flex items-center justify-between bg-black border border-[#C5A059]/50 border-dashed rounded-lg p-3 cursor-pointer group hover:border-[#C5A059] transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(successCode);
                                        showToast('success', 'Copied!', 'Code copied to clipboard');
                                    }}
                                >
                                    <span className="text-xl font-bold text-white tracking-widest">{successCode}</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white font-medium">
                                        <Copy size={14} /> Copy
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-3">Code also sent to your email.</p>
                            </div>
                        ) : (
                            // 默认订阅表单 (深色适配)
                            <>
                                <p className="text-gray-400 mb-4 leading-relaxed text-sm font-['Inter']">
                                    Join our newsletter for exclusive offers and discreet updates.
                                </p>
                                <form className="space-y-3" onSubmit={handleSubscribe}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        // 输入框改为深色半透明
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:bg-white/10 transition-all duration-300 text-sm placeholder:text-gray-600"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        // 按钮改为白色背景黑字 (高对比)
                                        className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Social Icons (仅保留 Ins, Pinterest, X) */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex gap-4">
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/myth.w.studio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Instagram"
                                    className="w-10 h-10 bg-white/5 text-gray-400 rounded-full flex items-center justify-center transition-all hover:bg-[#E1306C] hover:text-white hover:-translate-y-1"
                                >
                                    <Instagram size={18} />
                                </a>

                                {/* Pinterest */}
                                <a
                                    href="https://www.pinterest.com/nanausstudio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Pinterest"
                                    className="w-10 h-10 bg-white/5 text-gray-400 rounded-full flex items-center justify-center transition-all hover:bg-[#E60023] hover:text-white hover:-translate-y-1"
                                >
                                    <PinterestIcon className="w-4 h-4" />
                                </a>

                                {/* X (Twitter) */}
                                <a
                                    href="https://twitter.com/myth_objects"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on X"
                                    className="w-10 h-10 bg-white/5 text-gray-400 rounded-full flex items-center justify-center transition-all hover:bg-black hover:text-white hover:border hover:border-white/20 hover:-translate-y-1"
                                >
                                    <XIcon className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="mt-4 text-xs text-gray-500 font-['Inter']">
                                <p>support@mythtoy.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:items-start items-center gap-3">
                        <p className="text-gray-500 text-xs font-['Inter']">
                            &copy; {new Date().getFullYear()} MythToy. All rights reserved. 18+ Only.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500 font-['Inter']">
                            <Link href="/pages/cookie-policy" className="hover:text-white transition-colors border-b border-transparent hover:border-white/40">
                                Cookie Policy
                            </Link>
                            <Link href="/pages/payment-policy" className="hover:text-white transition-colors border-b border-transparent hover:border-white/40">
                                Payment Policy
                            </Link>
                        </div>
                    </div>

                    {/* Payment Icons (Grayscale style for dark mode) */}
                    <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                        <CreditCard size={24} className="text-white" />
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-white/20 px-2 py-1 rounded">VISA</span>
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-white/20 px-2 py-1 rounded">MASTERCARD</span>
                        {/* PayPal text needs to be light in dark mode */}
                        <span className="border border-white/20 px-2 py-1 rounded font-bold italic text-white/80">PayPal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}