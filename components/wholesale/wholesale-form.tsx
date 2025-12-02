// components/wholesale/wholesale-form.tsx
'use client';

import { useState } from 'react';
import { Zap, Loader2, Send } from 'lucide-react';
import { useToast } from '@/contexts/toastContext';
import { submitWholesaleForm } from '@/app/actions/submit-wholesale';

export default function WholesaleForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitWholesaleForm(formData);

            if (result.success) {
                showToast('success', 'Inquiry Sent', 'We have received your request and will reply within 24 hours.');
                (e.target as HTMLFormElement).reset(); // 重置表单
            } else {
                showToast('error', 'Error', 'Failed to send inquiry. Please try again.');
            }
        } catch (error) {
            showToast('error', 'Error', 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Contact Name *</label>
                    <input name="contactName" type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="Your Name" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Business Name</label>
                    <input name="businessName" type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="Company Name" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email Address *</label>
                    <input name="email" type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="name@company.com" required />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone / WhatsApp</label>
                    <input name="phone" type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="+1 234 567 8900" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Primary Business Model</label>
                <select name="businessType" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none appearance-none cursor-pointer">
                    <option value="Retail Store">Retail Store (Physical)</option>
                    <option value="Online Store">Online Store / E-commerce</option>
                    <option value="Distributor">Distributor / Wholesaler</option>
                    <option value="Dropshipper">Dropshipper</option>
                    <option value="Startup">Just Starting Out</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Estimated Monthly Volume</label>
                <select name="volume" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none appearance-none cursor-pointer">
                    <option value="<1k">$500 - $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k+">$10,000+</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Products of Interest / Message</label>
                <textarea name="message" rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none resize-none" placeholder="Tell us about your needs..."></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Sending...</>
                ) : (
                    <><Zap size={20} /> Request Wholesale Pricing</>
                )}
            </button>

            <p className="text-center text-xs text-gray-400">
                We respect your privacy. Your information is safe with us.
            </p>
        </form>
    );
}