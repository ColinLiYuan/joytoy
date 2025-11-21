import {
    faWhatsapp,
    faFacebookF,
    faInstagram
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 relative">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Shop Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold text-purple-800 mb-6">Shop</h3>
                        <ul className="space-y-3">
                            <li><a href="/collections/new-arrivals" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">New In</a></li>
                            <li><a href="/collections/best-sellers" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Best Sellers</a></li>
                            <li><a href="/collections/female-sex-toys" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Sex Toys For Women</a></li>
                            <li><a href="/collections/male-sex-toys" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Sex Toys For Men</a></li>
                            <li><a href="/collections/female-sex-toys/clit-vibrators" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Clit Vibrators</a></li>
                            <li><a href="/collections/male-sex-toys/male-masturbators" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Masturbators</a></li>


                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold text-purple-800 mb-6">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="/pages/contact" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Contact Us</a></li>
                            <li><a href="/pages/shipping-policy" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Shipping Policy</a></li>
                            <li><a href="/pages/return-refund" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Return & Refund</a></li>
                            <li><a href="/pages/order-tracking" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Order Tracking</a></li>
                            {/*<li><a href="/pages/care-instructions" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Care Instructions</a></li>*/}
                            {/*<li><a href="/pages/faq" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">FAQ</a></li>*/}
                        </ul>
                    </div>

                    {/* About Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold text-purple-800 mb-6">About</h3>
                        <ul className="space-y-3">
                            <li><a href="/pages/about" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Our Story</a></li>
                            <li><a href="/blog" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Blog</a></li>
                            {/*<li><a href="/quality" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Quality & Safety</a></li>*/}
                            <li><a href="/pages/wholesale" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Wholesale</a></li>
                            {/*<li><a href="/careers" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Careers</a></li>*/}
                            {/*<li><a href="/press" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Press</a></li>*/}
                        </ul>
                    </div>

                    {/* Policies Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold text-purple-800 mb-6">Policies</h3>
                        <ul className="space-y-3">
                            <li><a href="/pages/privacy-policy" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Privacy Policy</a></li>
                            <li><a href="/pages/terms-and-conditions" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Terms & Conditions</a></li>
                            <li><a href="/pages/payment-policy" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Payment Policy</a></li>
                            <li><a href="/pages/cookie-policy" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Cookie Policy</a></li>
                            <li><a href="/pages/age-verification" className="text-gray-600 hover:text-purple-700 font-medium transition-all duration-300 hover:translate-x-1 inline-block py-1">Age Verification</a></li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className="footer-section">
                        <h3 className="text-lg font-semibold text-purple-800 mb-6">Get 20% Off</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                            Subscribe to our newsletter and receive 20% discount code for your first purchase.
                        </p>
                        <form className="subscribe-form space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-sm"
                            >
                                Subscribe & Save 20%
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-3">
                            * Discount code will be sent to your email. Valid for first-time customers only.
                        </p>

                        {/* Contact Info */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600">
                                    <span className="font-medium">Email:</span> colinliyuan@gmail.com
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Phone:</span> +86 17620189025
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="social-links flex gap-3 mt-4">
                                <a
                                    href="https://www.facebook.com/profile.php?id=61581471022682"
                                    className="social-link w-10 h-10 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-purple-700 transition-all duration-300 hover:bg-purple-600 hover:text-white hover:-translate-y-1 hover:shadow-lg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit our Facebook page"
                                >
                                    <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
                                </a>
                                <a
                                    href="https://wa.me/17620189025"
                                    className="social-link w-10 h-10 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-purple-700 transition-all duration-300 hover:bg-green-500 hover:text-white hover:-translate-y-1 hover:shadow-lg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Contact us on WhatsApp"
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                                </a>
                                <a
                                    href="https://www.instagram.com/colinliyuan"
                                    className="social-link w-10 h-10 bg-purple-100 border border-purple-200 rounded-full flex items-center justify-center text-purple-700 transition-all duration-300 hover:bg-pink-500 hover:text-white hover:-translate-y-1 hover:shadow-lg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="copyright border-t border-gray-200 pt-8">
                    <p className="text-gray-600 text-center text-sm">
                        You must be 18 or older to enter this site. &copy; 2023 MythToy. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}