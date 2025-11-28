// app/pages/contact/page.tsx
'use client'; // ✅ 改为客户端组件以便处理表单

import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, Facebook, Instagram, Loader2 } from 'lucide-react'; // 补上 Loader2
import { sendContactEmail } from '@/app/actions/send-email'; // ✅ 引入 Action
import { useToast } from '@/contexts/toastContext'; // ✅ 引入 Toast

// WhatsApp Icon 保持不变...
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

export default function Contact() {
    const [isSending, setIsSending] = useState(false);
    const { showToast } = useToast(); // ✅ 引入 Toast

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);

        const formData = new FormData(e.currentTarget);

        const result = await sendContactEmail(formData);

        if (result.success) {
            showToast('success', 'Message Sent', "We'll get back to you shortly!");
            (e.target as HTMLFormElement).reset(); // 清空表单
        } else {
            showToast('error', 'Error', 'Failed to send message. Please try again.');
        }
        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">Get in Touch</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Have a question about a product? Interested in wholesale?
                        Our team is ready to help you find the answers you need.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Side: Contact Info Cards (保持不变) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4"><Mail size={24} /></div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
                            <p className="text-sm text-gray-500 mb-3">For general inquiries & support</p>
                            <a href="mailto:support@mythtoy.com" className="text-blue-600 font-medium hover:underline text-lg">support@mythtoy.com</a>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4"><WhatsAppIcon className="w-6 h-6" /></div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">WhatsApp</h3>
                            <p className="text-sm text-gray-500 mb-3">Fast response for wholesale</p>
                            <a href="https://wa.me/17620189025" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline text-lg">+86 176 2018 9025</a>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="mt-1 text-gray-400"><MapPin size={20} /></div>
                                <div><h4 className="font-bold text-gray-900">Headquarters</h4><p className="text-gray-600 text-sm">Dongguan, Guangdong<br/>Global Manufacturing Hub</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-gray-400"><Clock size={20} /></div>
                                <div><h4 className="font-bold text-gray-900">Business Hours</h4><p className="text-gray-600 text-sm">Mon-Fri: 9AM - 6PM (GMT+8)</p></div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 pt-4">
                            <a href="#" className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="https://www.instagram.com/colinliyuan" className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                            {/* ✅ 绑定 onSubmit */}
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                        <input type="text" name="name" id="name" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" name="email" id="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all" placeholder="john@example.com" required />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <select name="subject" id="subject" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Wholesale / B2B</option>
                                        <option>Returns & Refunds</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea name="message" id="message" rows={6} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none" placeholder="How can we help you today?" required></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending} // ✅ 防止重复提交
                                    className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSending ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Send Message</>}
                                </button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    By submitting this form, you agree to our privacy policy. We'll never share your data.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}