'use client';

import { useState } from 'react';
import { Mail, Clock, MapPin, Phone, Send, Instagram, Loader2, ArrowRight } from 'lucide-react';
import { sendContactEmail } from '@/app/actions/email';
import { useToast } from '@/contexts/toastContext';
import FAQSection from '@/components/common/faq-section';

// --- Icons Definitions ---

// WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);

// X (Twitter) Icon
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);

// Pinterest Icon
const PinterestIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.487-.695-2.419-2.873-2.419-4.629 0-3.772 2.747-7.229 7.93-7.229 4.17 0 6.923 2.97 6.923 6.939 0 4.14-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
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

                <div className="grid lg:grid-cols-12 gap-12 mb-24">

                    {/* Left Side: Contact Info */}
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

                        {/* 2. WhatsApp Card */}
                        <div className="bg-white p-8 rounded-none border border-gray-100 flex flex-col items-start hover:border-black transition-colors duration-300">
                            <WhatsAppIcon className="w-6 h-6 text-[#1A1A1A] mb-6" />
                            <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">WhatsApp</h3>
                            <p className="text-sm text-gray-500 mb-6 font-light">Direct line for wholesale & urgent requests.</p>

                            <a href="https://wa.me/8617620189025" target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                                Chat on WhatsApp <ArrowRight size={14} />
                            </a>
                        </div>

                        {/* 3. Location & Hours & Socials */}
                        <div className="bg-[#F9F9F9] p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin size={20} strokeWidth={1.5} className="mt-1 text-[#1A1A1A]" />
                                <div>
                                    <h4 className="font-serif text-[#1A1A1A] mb-1">Headquarters</h4>
                                    <p className="text-gray-500 text-sm font-light">Room 306, Building B, No.61 Dongpu 2nd Road<br/>Tianhe District, Guangzhou<br/>Guangdong, China</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Clock size={20} strokeWidth={1.5} className="mt-1 text-[#1A1A1A]" />
                                <div>
                                    <h4 className="font-serif text-[#1A1A1A] mb-1">Hours</h4>
                                    <p className="text-gray-500 text-sm font-light">Mon-Fri: 9AM - 6PM (GMT+8)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone size={20} strokeWidth={1.5} className="mt-1 text-[#1A1A1A]" />
                                <div>
                                    <h4 className="font-serif text-[#1A1A1A] mb-1">Phone</h4>
                                    <p className="text-gray-500 text-sm font-light">+86 17620189025</p>
                                </div>
                            </div>

                            {/* ✅ Updated Socials (Referring to Footer) */}
                            <div className="pt-4 flex gap-4 border-t border-gray-200/50 mt-4">
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/mythtoy.official"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Instagram"
                                    className="text-gray-400 hover:text-[#E1306C] transition-colors"
                                >
                                    <Instagram size={20} strokeWidth={1.5} />
                                </a>

                                {/* Pinterest */}
                                <a
                                    href="https://www.pinterest.com/nanausstudio"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on Pinterest"
                                    className="text-gray-400 hover:text-[#E60023] transition-colors"
                                >
                                    <PinterestIcon className="w-5 h-5" />
                                </a>

                                {/* X (Twitter) */}
                                <a
                                    href="https://x.com/mythtoyofficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Follow us on X"
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <XIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
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

                {/* FAQ Section */}
                <div className="border-t border-gray-100 pt-16 md:pt-24 max-w-3xl mx-auto">
                    <FAQSection context="contact" />
                </div>
            </div>
        </div>
    );
}export const dynamic = 'force-dynamic'; 
