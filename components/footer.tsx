// components/footer.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWhatsapp,
    faFacebookF,
    faInstagram
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    return (
        // ✅ 修复：加上 w-full 和 overflow-hidden，防止子元素撑开
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 relative w-full overflow-hidden">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                {/* ... 内容保持不变 ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Shop Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Shop</h3>
                        <ul className="space-y-3 font-['Inter']">
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

                    {/* Subscribe Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 font-['Playfair_Display']">Get 20% Off</h3>
                        <p className="text-gray-500 mb-4 leading-relaxed text-sm font-['Inter']">
                            Join our newsletter for exclusive offers and discreet updates.
                        </p>
                        <form className="subscribe-form space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-300 text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-black text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-pink-600 hover:-translate-y-0.5 hover:shadow-lg text-sm"
                            >
                                Subscribe
                            </button>
                        </form>

                        {/* Social Icons */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/profile.php?id=61581471022682" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:text-white hover:-translate-y-1" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                                </a>
                                <a href="https://www.instagram.com/colinliyuan" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-pink-600 hover:text-white hover:-translate-y-1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                                </a>
                                <a href="https://wa.me/17620189025" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-green-500 hover:text-white hover:-translate-y-1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                                </a>
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
                            <Link href="/pages/cookie-policy" className="hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-400">Cookie Policy</Link>
                            <Link href="/pages/payment-policy" className="hover:text-gray-600 transition-colors border-b border-transparent hover:border-gray-400">Payment Policy</Link>
                        </div>
                    </div>
                    <div className="flex gap-4 grayscale opacity-40">
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-gray-200 px-2 py-1 rounded">VISA</span>
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-gray-200 px-2 py-1 rounded">MASTERCARD</span>
                        <span className="text-xs font-bold text-gray-400 tracking-widest border border-gray-200 px-2 py-1 rounded">PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}