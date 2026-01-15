'use client';

import { useState } from 'react';
import { Mail, Clock, MapPin, Send, Facebook, Instagram, Loader2, ArrowRight } from 'lucide-react';
import { sendContactEmail } from '@/app/actions/send-email';
import { useToast } from '@/contexts/toastContext';
import FAQSection from '@/components/common/faq-section'; // ✅ Import

// WhatsApp Icon (SVG Path)
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

export default function Contact() {
    const [isSending, setIsSending] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSending(true);
        const formData = new FormData(e.currentTarget);
        const result = await sendContactEmail(formData);
        if (result.success) {
            showToast('success', 'Message Sent', "We'll get back to you shortly!");
            (e.target as HTMLFormElement).reset();
        } else {
            showToast('error', 'Error', 'Failed to send message.');
        }
        setIsSending(false);
    };

    return (
        <div className="min-h-screen bg-white py-16 md:py-24">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Customer Care</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A]">Get in Touch</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 mb-24"> {/* ✅ Added mb-24 for spacing */}

                    {/* Left Side: Contact Info (占据 4 列 ) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* 1. Email Card */}
                        <div className="bg-white p-8 rounded-none border border-gray-100 flex flex-col items-start hover:border-black transition-colors duration-300">
                            <Mail size={24} strokeWidth={1.5} className="text-[#1A1A1A] mb-6" />
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">Email Us</h3>
                            <p className="text-sm text-gray-500 mb-6 font-light">For general inquiries & order support.</p>
                            <a href="mailto:support@mythtoy.com" className="text-sm font-bold uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                                support@mythtoy.com
                            </a>
                        </div>

                        {/* 2. WhatsApp Card (Updated) */}
                        <div className="bg-white p-8 rounded-none border border-gray-100 flex flex-col items-start hover:border-black transition-colors duration-300">
                            <WhatsAppIcon className="w-6 h-6 text-[#1A1A1A] mb-6" />
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">WhatsApp</h3>
                            <p className="text-sm text-gray-500 mb-6 font-light">Direct line for wholesale & urgent requests.</p>

                            {/* 黑色按钮 */}
                            <a href="https://wa.me/17620189025" target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                                Chat on WhatsApp <ArrowRight size={14} />
                            </a>
                        </div>

                        {/* 3. Location & Hours (Minimal List) */}
                        <div className="bg-[#F9F9F9] p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin size={20} strokeWidth={1.5} className="mt-1 text-[#1A1A1A]" />
                                <div>
                                    <h4 className="font-serif text-[#1A1A1A] mb-1">Headquarters</h4>
                                    <p className="text-gray-500 text-sm font-light">Global Fulfillment Center<br/>Strategic Logistics Hub</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock size={20} strokeWidth={1.5} className="mt-1 text-[#1A1A1A]" />
                                <div>
                                    <h4 className="font-serif text-[#1A1A1A] mb-1">Hours</h4>
                                    <p className="text-gray-500 text-sm font-light">Mon-Fri: 9AM - 6PM (GMT+8)</p>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="pt-4 flex gap-4 border-t border-gray-200/50 mt-4">
                                {/* ✅ Add aria-label */}
                                <a
                                    href="#"
                                    aria-label="Visit our Facebook page"
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <Facebook size={20} strokeWidth={1.5} />
                                </a>

                                {/* ✅ Add aria-label */}
                                <a
                                    href="https://www.instagram.com/myth.w.studio"
                                    aria-label="Visit our Instagram profile"
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <Instagram size={20} strokeWidth={1.5} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form ( 占据 8 列 ) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 md:p-12 border border-gray-100 h-full">
                            <h3 className="text-2xl font-serif text-[#1A1A1A] mb-8">Send a Message</h3>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Name</label>
                                        <input type="text" name="name" id="name" className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder-gray-300 bg-transparent" placeholder="Your Name" required />
                                    </div>
                                    <div className="group">
                                        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Email</label>
                                        <input type="email" name="email" id="email" className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all placeholder-gray-300 bg-transparent" placeholder="Your Email" required />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Topic</label>
                                    <select name="subject" id="subject" className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all bg-transparent text-[#1A1A1A]">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Wholesale / B2B</option>
                                        <option>Press & Media</option>
                                    </select>
                                </div>

                                <div className="group">
                                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">Message</label>
                                    <textarea name="message" id="message" rows={6} className="w-full border-b border-gray-200 py-3 focus:border-black outline-none transition-all resize-none placeholder-gray-300 bg-transparent" placeholder="Type your message here..." required></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full md:w-auto px-12 py-4 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                                >
                                    {isSending ? <Loader2 className="animate-spin mx-auto" /> : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ✅ Insert FAQ Section at bottom */}
                <div className="border-t border-gray-100 pt-16 md:pt-24 max-w-3xl mx-auto">
                    <FAQSection context="contact" />
                </div>
            </div>
        </div>
    );
}