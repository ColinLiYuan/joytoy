// components/wholesale/wholesale-form.tsx
'use client';

import { useState } from 'react';
import { Zap, Loader2, Send } from 'lucide-react';
import { useToast } from '@/contexts/toastContext';
import { submitWholesaleForm } from '@/app/actions/email';

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
                showToast('success', 'Inquiry Sent', 'We have received your request and will contact you within the next few days.');
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
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone Number</label>
                    <div className="grid grid-cols-[7rem_1fr] gap-2">
                        <select name="countryCode" defaultValue="+1" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none appearance-none cursor-pointer">
                            {/* Common Countries */}
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                            <option value="+61">🇦🇺 +61</option>
                            <option value="+49">🇩🇪 +49</option>
                            <option value="+33">🇫🇷 +33</option>
                            <option value="+39">🇮🇹 +39</option>
                            <option value="+34">🇪🇸 +34</option>
                            <option value="+31">🇳🇱 +31</option>
                            <option value="+46">🇸🇪 +46</option>
                            <option value="+47">🇳🇴 +47</option>
                            <option value="+86">🇨🇳 +86</option>
                            <option value="+81">🇯🇵 +81</option>
                            <option value="+82">🇰🇷 +82</option>
                            <option value="+65">🇸🇬 +65</option>
                            
                            {/* Divider */}
                            <option disabled>──────────</option>
                            
                            {/* Other Countries */}
                            <option value="+45">🇩🇰 +45</option>
                            <option value="+358">🇫🇮 +358</option>
                            <option value="+41">🇨🇭 +41</option>
                            <option value="+43">🇦🇹 +43</option>
                            <option value="+32">🇧🇪 +32</option>
                            <option value="+351">🇵🇹 +351</option>
                            <option value="+353">🇮🇪 +353</option>
                            <option value="+64">🇳🇿 +64</option>
                            <option value="+852">🇭🇰 +852</option>
                            <option value="+886">🇹🇼 +886</option>
                            <option value="+91">🇮🇳 +91</option>
                            <option value="+7">🇷🇺 +7</option>
                            <option value="+55">🇧🇷 +55</option>
                            <option value="+52">🇲🇽 +52</option>
                            <option value="+27">🇿🇦 +27</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+90">🇹🇷 +90</option>
                            <option value="+66">🇹🇭 +66</option>
                            <option value="+84">🇻🇳 +84</option>
                            <option value="+62">🇮🇩 +62</option>
                            <option value="+60">🇲🇾 +60</option>
                            <option value="+63">🇵🇭 +63</option>
                        </select>
                        <input name="phone" type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="234 567 8900" />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">WhatsApp (Optional)</label>
                <input name="whatsapp" type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black transition-all outline-none" placeholder="WhatsApp number if different from phone" />
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