// app/pages/wholesale/page.tsx
import { Metadata } from 'next';
import {
    Factory,
    Globe,
    ShieldCheck,
    Package,
    TrendingUp,
    Zap,
    CheckCircle2,
    HelpCircle,
    Truck,
    Award,
    Users
} from 'lucide-react';
// ✅ 引入我们之前做好的客户端表单组件
import WholesaleForm from '@/components/wholesale/wholesale-form';

// 1. SEO Metadata: 针对 B2B 关键词进行饱和式覆盖
export const metadata: Metadata = {
    title: 'Wholesale Sex Toys Manufacturer & Distributor | MythToy',
    description: 'Direct from source factory. We maintain a massive inventory of premium adult toys for wholesale, dropshipping, and private label (OEM/ODM). CE & RoHS certified.',
    keywords: [
        'wholesale sex toys',
        'adult products distributor',
        'bulk vibrators manufacturer',
        'sex toy dropshipping supplier',
        'private label adult toys',
        'OEM sex toys china',
        'body safe silicone toys wholesale'
    ],
    openGraph: {
        title: 'Partner with MythToy - Source Factory Direct',
        description: 'Maximize your margins with factory-direct pricing. Low MOQ, fast global shipping, and premium quality assurance.',
        type: 'website',
        url: 'https://mythtoy.com/pages/wholesale',
    }
};

// 2. FAQ 数据 (SEO 核心 - 不会显示在页面上，但在代码里给爬虫看)
const faqs = [
    {
        question: "What is the Minimum Order Quantity (MOQ)?",
        answer: "We support businesses of all stages. For dropshippers, there is NO MOQ. For wholesale bulk orders, our MOQ is as low as $500 mixed SKU to help you test the market. For Private Label (custom logo), MOQ typically starts at 50-100 units depending on the product."
    },
    {
        question: "Do you offer Blind Dropshipping?",
        answer: "Yes. We offer a complete blind dropshipping service. Packages are sent in plain boxes with no invoices, marketing materials, or MythToy branding. Your customers will never know it came from us."
    },
    {
        question: "How do you handle customs and duties?",
        answer: "For most small wholesale orders via air express (DHL/FedEx), we can offer DDP (Delivered Duty Paid) shipping to the USA and EU, meaning we handle the customs clearance and taxes. For larger sea freight orders, we provide all necessary documentation (CE, RoHS, MSDS) for smooth clearance."
    },
    {
        question: "Are your products body-safe?",
        answer: "Safety is our priority. All our products are manufactured using medical-grade liquid silicone, body-safe ABS, and TPE. They are phthalate-free, latex-free, and certified with CE, RoHS, and FCC standards suitable for sale in Western markets."
    },
    {
        question: "Can I get a sample before placing a bulk order?",
        answer: "Absolutely. We encourage you to test our quality. You can order samples at a discounted rate. Please contact our sales team to arrange sample shipping."
    }
];

// 3. 生成 FAQ Schema
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
};

export default function Wholesale() {
    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* === Hero Section (黑色高端) === */}
            <section className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                </div>
                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-pink-300 text-xs font-bold tracking-widest uppercase mb-8 border border-white/20">
                        <Factory size={14} />
                        Source Factory Direct
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 font-['Playfair_Display'] leading-tight">
                        Scale Your Business with <br/> Premium Adult Products
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                        Stop paying middleman markups. Partner with MythToy for
                        <strong className="text-white font-semibold"> factory-direct pricing</strong>,
                        <strong className="text-white font-semibold"> medical-grade quality</strong>, and
                        <strong className="text-white font-semibold"> reliable global logistics</strong>.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a href="#contact-form" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Request Price List
                        </a>
                        <a href="#business-models" className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-6xl py-20">

                {/* === 核心优势 (SEO 文本增强) === */}
                <section className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">Why Global Brands Choose Us</h2>
                        <div className="w-20 h-1 bg-pink-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Unbeatable Margins</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Located in Dongguan, the heart of global manufacturing, we own the supply chain. By eliminating trading companies and agents, we pass 30-50% savings directly to you, giving you a competitive edge in the market.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Strict Quality Control</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We don't just ship boxes; we inspect them. Every single unit undergoes a 3-step QC process (Appearance, Function, Waterproofing). We ensure that what your customer receives is pristine, reducing your return rate to under 1%.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <Truck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Global Logistics Network</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Whether you need 500 units sent to Amazon FBA or single units dropshipped to end users, our logistics partners cover 100+ countries. We handle customs clearance paperwork so you can focus on marketing.
                            </p>
                        </div>
                    </div>
                </section>

                {/* === 业务模式 (Business Models) === */}
                <section id="business-models" className="mb-24 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-12">
                        <span className="text-pink-600 font-bold tracking-widest uppercase text-xs mb-2 block">Flexible Solutions</span>
                        <h2 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">How We Can Work Together</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Package className="text-purple-600" />
                                <h3 className="font-bold text-lg">Wholesale / Bulk</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Lowest tier pricing</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> MOQ: $500 mixed</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Fast air/sea freight</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="text-pink-600" />
                                <h3 className="font-bold text-lg">Dropshipping</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> No inventory risk</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Blind shipping (No logo)</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> API / CSV integration</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-blue-600" />
                                <h3 className="font-bold text-lg">Private Label (OEM)</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Your logo on products</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Custom packaging design</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Low MOQ for branding</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* === 详细产品目录 (关键词堆砌区) === */}
                <section className="mb-24">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">Extensive Product Catalog</h2>
                            <p className="text-gray-600 mb-6">
                                Our catalog features over 500+ SKUs covering every major category in the adult wellness industry. We update our inventory monthly with the latest trending items.
                            </p>
                            <div className="p-6 bg-black text-white rounded-2xl">
                                <div className="text-3xl font-bold text-pink-500 mb-1">500+</div>
                                <div className="text-sm opacity-80">Premium SKUs</div>
                                <div className="w-full h-px bg-white/20 my-4"></div>
                                <div className="text-3xl font-bold text-blue-400 mb-1">NEW</div>
                                <div className="text-sm opacity-80">Items Added Monthly</div>
                            </div>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "For Her", items: "Clit Suction Toys, G-Spot Vibrators, Rabbit Vibrators, Bullet Vibes, Kegel Balls" },
                                { title: "For Him", items: "Male Masturbators, Prostate Massagers, Penis Rings, Automated Strokers, Sleeves" },
                                { title: "For Couples", items: "App-Controlled Toys, Double Vibrators, Strap-ons, Remote Control Eggs" },
                                { title: "Anal Play", items: "Silicone Butt Plugs, Anal Beads, Prostate Toys, Glass & Metal Toys" },
                                { title: "Bondage & Fetish", items: "Handcuffs, Blindfolds, Whips, BDSM Kits, Leather Accessories" },
                                { title: "Lingerie & Essentials", items: "Sexy Lingerie, Costumes, Lubricants, Toy Cleaners" }
                            ].map((cat, i) => (
                                <div key={i} className="border border-gray-200 p-6 rounded-xl hover:border-black transition-colors group">
                                    <h3 className="font-bold text-lg mb-2 group-hover:text-pink-600 transition-colors">{cat.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{cat.items}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* === FAQ Section (SEO Rich Snippets) === */}
                <section className="mb-24 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 font-['Playfair_Display']">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
                                <h3 className="flex items-start gap-3 font-bold text-gray-900 text-lg mb-3">
                                    <HelpCircle className="text-pink-600 flex-shrink-0 mt-1" size={20} />
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 pl-8 text-base leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === Contact Form (功能区) === */}
                <section id="contact-form" className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="grid md:grid-cols-5">
                        <div className="md:col-span-2 bg-black text-white p-10 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold font-['Playfair_Display'] mb-4">Get Access Now</h3>
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Fill out the form to receive our <span className="text-white font-bold">Wholesale Price List</span> and <span className="text-white font-bold">Product Catalog</span> within 24 hours.
                                </p>

                                <div className="space-y-6 mt-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Sales Manager</p>
                                            <p className="font-medium">Colin Li</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>📧 wholesale@mythtoy.com</p>
                                        <p>📱 +86 176 2018 9025 (WhatsApp)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 p-8 md:p-12 bg-white">
                            {/* ✅ 核心：嵌入我们刚才写好的交互式表单组件 */}
                            <WholesaleForm />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}