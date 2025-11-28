// components/footer.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Instagram, Mail, Loader2, ArrowRight, CreditCard, CheckCircle2, Copy } from 'lucide-react'; // ✅ 增加图标
import { useToast } from '@/contexts/toastContext';
import { subscribeToNewsletter } from '@/app/actions/subscribe';

// 自定义 WhatsApp 图标
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

export default function Footer() {
    const [isLoading, setIsLoading] = useState(false);
    const [successCode, setSuccessCode] = useState<string | null>(null); // ✅ 新增：存储成功的折扣码
    const { showToast } = useToast();

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await subscribeToNewsletter(formData);

        if (result.success) {
            // ✅ 成功后显示折扣码，而不是清空表单
            setSuccessCode(result.code || 'MYTH20');
            showToast('success', 'Welcome!', 'Discount code unlocked!');
        } else {
            showToast('error', 'Error', 'Failed to subscribe. Please try again.');
        }
        setIsLoading(false);
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 relative w-full overflow-hidden">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

                    {/* Shop Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Shop</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li>
                                <Link href="/collections" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200 font-medium">
                                    All Collections
                                </Link>
                            </li>
                            <li><Link href="/collections/all" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Shop All</Link></li>
                            <li><Link href="/collections/new-arrivals" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">New In</Link></li>
                            <li><Link href="/collections/best-sellers" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Best Sellers</Link></li>
                            <li><Link href="/collections/female-sex-toys" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">For Her</Link></li>
                            <li><Link href="/collections/male-sex-toys" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">For Him</Link></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Support</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/contact" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Contact Us</Link></li>
                            <li><Link href="/pages/shipping-policy" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Shipping Policy</Link></li>
                            <li><Link href="/pages/return-refund" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Returns & Refund</Link></li>
                            <li><Link href="/pages/order-tracking" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">About</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/about" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Our Story</Link></li>
                            <li><Link href="/blog" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Blog</Link></li>
                            <li><Link href="/pages/wholesale" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Policies Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Policies</h3>
                        <ul className="space-y-3 font-['Inter']">
                            <li><Link href="/pages/privacy-policy" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link href="/pages/terms-and-conditions" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Terms of Service</Link></li>
                            <li><Link href="/pages/age-verification" className="text-sm text-gray-500 hover:text-pink-600 transition-colors duration-200">Age Verification</Link></li>
                        </ul>
                    </div>

                    {/* Subscribe Section (Gatekeeper Strategy) */}
                    <div id="footer-subscribe" className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Get 20% Off</h3>

                        {/* ✅ 状态切换：成功后显示折扣码 */}
                        {successCode ? (
                            <div className="bg-green-50 border border-green-100 p-5 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-sm">
                                    <CheckCircle2 size={18} /> You're subscribed!
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Here is your exclusive code:</p>

                                <div
                                    className="flex items-center justify-between bg-white border border-green-200 border-dashed rounded-lg p-3 cursor-pointer group hover:border-green-400 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(successCode);
                                        showToast('success', 'Copied!', 'Code copied to clipboard');
                                    }}
                                >
                                    <span className="text-xl font-bold text-gray-900 tracking-widest">{successCode}</span>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-green-600 font-medium">
                                        <Copy size={14} /> Copy
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3">Code also sent to your email.</p>
                            </div>
                        ) : (
                            // 默认状态：显示表单
                            <>
                                <p className="text-gray-500 mb-4 leading-relaxed text-sm font-['Inter']">
                                    Join our newsletter for exclusive offers and discreet updates.
                                </p>
                                <form className="space-y-3" onSubmit={handleSubscribe}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300 text-sm"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Subscribe'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Social Icons */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/profile.php?id=61581471022682" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all hover:bg-blue-600 hover:text-white hover:-translate-y-1">
                                    <Facebook size={18} />
                                </a>
                                <a href="https://www.instagram.com/colinliyuan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all hover:bg-pink-600 hover:text-white hover:-translate-y-1">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://wa.me/17620189025" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all hover:bg-green-500 hover:text-white hover:-translate-y-1">
                                    <WhatsAppIcon className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="mt-4 text-xs text-gray-400 font-['Inter']">
                                <p>support@mythtoy.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-footer */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:items-start items-center gap-3">
                        <p className="text-gray-400 text-xs font-['Inter']">
                            &copy; {new Date().getFullYear()} MythToy. All rights reserved. 18+ Only.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-400 font-['Inter']">
                            <Link href="/pages/cookie-policy" className="hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-400">
                                Cookie Policy
                            </Link>
                            <Link href="/pages/payment-policy" className="hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-400">
                                Payment Policy
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-4 grayscale opacity-40">
                        <CreditCard size={24} />
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-gray-200 px-2 py-1 rounded">VISA</span>
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-gray-200 px-2 py-1 rounded">MASTERCARD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}