// app/pages/wholesale/route.ts
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
    Users,
    ExternalLink,
    ArrowRight
} from 'lucide-react';
// ✅ 引入我们之前做好的客户端表单组件
import WholesaleForm from '@/components/wholesale/wholesale-form';

// 1. SEO Metadata: 针对 B2B 关键词进行饱和式覆盖
export const metadata: Metadata = {
    title: 'Premium Adult Toys Wholesale & Distribution Services',
    description: 'Professional sourcing and distribution services for premium adult toys. We connect businesses with trusted manufacturers offering wholesale, dropshipping, and private label solutions.',
    keywords: [
        'wholesale sex toys',
        'wholesale adult toys',
        'adult toys wholesale',
        'sex toy manufacturer',
        'adult toy distributor',
        'adult products distributor',
        'bulk vibrators manufacturer',
        'sex toy dropshipping supplier',
        'private label adult toys',
        'OEM sex toys china',
        'body safe silicone toys wholesale'
    ],
    openGraph: {
        title: 'Professional Adult Toy Sourcing & Distribution',
        description: 'Connect with trusted manufacturers for wholesale adult toys. Low MOQ, quality assurance, and reliable logistics.',
        type: 'website',
        url: 'https://www.mythtoy.com/pages/wholesale',
    }
};

// 2. FAQ 数据 (SEO 核心 - 不会显示在页面上，但在代码里给爬虫看)
const faqs = [
    {
        question: "What are the order requirements?",
        answer: "Order requirements vary by manufacturer. For wholesale bulk orders of wholesale adult toys, minimum orders typically start at $500 mixed SKU to help you test the market. For Private Label (custom logo) on wholesale adult toys, minimum orders typically start at 50-100 units depending on the product."
    },
    {
        question: "How do you handle shipping?",
        answer: "Many manufacturers offer complete shipping solutions. Orders are shipped in plain boxes with professional packaging. Your customers will receive products without any identifying branding."
    },
    {
        question: "How do you handle customs and duties?",
        answer: "For most small wholesale orders via air express (DHL/FedEx), many suppliers can offer DDP (Delivered Duty Paid) shipping to the USA and EU, meaning they handle customs clearance and taxes. For larger sea freight orders, all necessary documentation (CE, RoHS, MSDS) is provided for smooth clearance."
    },
    {
        question: "Are your products body-safe?",
        answer: "Reputable manufacturers prioritize safety. Products are manufactured using medical-grade liquid silicone, body-safe ABS, and TPE. They are phthalate-free, latex-free, and certified with CE, RoHS, and FCC standards suitable for adult toys wholesale in Western markets."
    },
    {
        question: "Can I get a sample before placing a bulk order?",
        answer: "Absolutely. Manufacturers encourage quality testing. Samples are available at a discounted rate. Contact the sales team directly to arrange sample shipping for your wholesale adult toys evaluation."
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
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-600/30 text-pink-200 text-xs font-bold tracking-widest uppercase mb-8 border border-pink-400/30">
                        <ExternalLink size={14} />
                        Visit Our Dedicated Wholesale Platform →
                        <a href="https://www.adult-toy-wholesale.com" target="_blank" rel="noopener" className="underline font-extrabold ml-1 hover:text-white transition-colors">adult-toy-wholesale.com</a>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 font-['Playfair_Display'] leading-tight">
                        Connect with Premium <br/> Adult Toy Manufacturers
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                        Connect with trusted <strong className="text-white font-semibold">sex toy manufacturers</strong> and <strong className="text-white font-semibold">adult toy distributors</strong> for
                        <strong className="text-white font-semibold"> competitive pricing</strong>,
                        <strong className="text-white font-semibold"> quality assurance</strong>, and
                        <strong className="text-white font-semibold"> reliable logistics</strong>.
                        We are your gateway to <strong className="text-white font-semibold">wholesale adult toys</strong> from verified suppliers.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a href="https://www.adult-toy-wholesale.com" target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Visit Wholesale Platform <ArrowRight size={18} />
                        </a>
                        <a href="#contact-form" className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Request Price List
                        </a>
                        <a href="#business-models" className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-6xl">

                {/* === 🚀 引流 Banner：引导批发客户到专用平台 === */}
                <section className="py-10">
                    <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border-2 border-pink-200 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200/50 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200/50 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold tracking-widest uppercase mb-4">
                                    <Globe size={12} />
                                    Dedicated B2B Platform
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
                                    Looking for Wholesale Pricing?
                                </h3>
                                <p className="text-gray-600 text-base leading-relaxed max-w-2xl">
                                    <strong className="text-gray-900">MythToy</strong> is our retail store. For <strong className="text-pink-600">wholesale adult toys</strong>, bulk orders, dropshipping, and private label OEM, please visit our dedicated wholesale platform at{' '}
                                    <strong className="text-gray-900">adult-toy-wholesale.com</strong> — purpose-built for B2B buyers with factory-direct pricing, instant quotes, and dedicated account management.
                                </p>
                            </div>
                            <a
                                href="https://www.adult-toy-wholesale.com"
                                target="_blank"
                                rel="noopener"
                                className="shrink-0 inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                Visit Wholesale Platform <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </section>

                <div className="py-20">

                {/* === 核心优势 (SEO 文本增强) === */}
                <section className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">Why Choose Our Sourcing Service</h2>
                        <div className="w-20 h-1 bg-pink-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <TrendingUp size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Unbeatable Margins</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We connect you directly with verified manufacturers in Dongguan, the heart of global manufacturing. By eliminating trading companies and agents, we help you access 30-50% savings, giving you a competitive edge in the <strong>adult toys wholesale</strong> market. Our <strong>wholesale adult toys</strong> sourcing ensures you get factory-direct pricing without middleman markups.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Strict Quality Control</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We partner only with reputable <strong>sex toy manufacturers</strong> who maintain strict quality standards. Every single unit undergoes a 3-step QC process (Appearance, Function, Waterproofing). We ensure that what your customer receives is pristine, reducing your return rate to under 1% for <strong>adult toys wholesale</strong> orders.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-200">
                                <Truck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Global Logistics Network</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Whether you need 500 units of <strong>wholesale adult toys</strong> sent to Amazon FBA or other destinations, our logistics partners cover 100+ countries. As an experienced <strong>adult toy distributor</strong>, we handle customs clearance paperwork so you can focus on marketing.
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
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Competitive pricing for <strong>wholesale adult toys</strong></li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Minimum order: $500</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Fast air/sea freight</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            <div className="flex items-center gap-3 mb-4">
                                <Globe className="text-pink-600" />
                                <h3 className="font-bold text-lg">Custom Orders</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> No inventory risk with <strong>wholesale adult toys</strong></li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Professional packaging</li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> API / CSV integration</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="text-blue-600" />
                                <h3 className="font-bold text-lg">Private Label (OEM)</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Your logo on <strong>wholesale adult toys</strong></li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Custom packaging design for <strong>adult toys wholesale</strong></li>
                                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-green-500 mt-0.5" /> Low minimums for branding through trusted <strong>sex toy manufacturers</strong></li>
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
                                Our network features a comprehensive range of products covering every major category in the adult wellness industry. As a professional sourcing service connecting you with verified <strong>sex toy manufacturers</strong> and <strong>adult toy distributors</strong>, we specialize in <strong>wholesale adult toys</strong> and update our inventory monthly with the latest trending items. Whether you're looking for <strong>adult toys wholesale</strong> opportunities or private label solutions, we offer everything from intimate accessories to premium pleasure products.
                            </p>
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
                                <h3 className="text-2xl font-bold font-['Playfair_Display'] mb-4">Get Connected Today</h3>
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    Fill out the form to receive our <span className="text-white font-bold">Wholesale Price List</span> and <span className="text-white font-bold">Product Catalog</span> within 24 hours. We'll connect you with trusted manufacturers for your <strong>wholesale adult toys</strong> needs.
                                </p>

                                <div className="space-y-6 mt-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Sourcing Specialist</p>
                                            <p className="font-medium">Colin</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-white/10"></div>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>🌐 <a href="https://www.adult-toy-wholesale.com" target="_blank" rel="noopener" className="text-pink-400 hover:text-pink-300 underline font-bold">adult-toy-wholesale.com</a></p>
                                        <p>📧 colinliyuan@gmail.com</p>
                                        <p>📞 Phone: +86 138 2442 3871</p>
                                        <p>💬 WhatsApp: <a href="https://wa.me/8613824423871" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline">Chat on WhatsApp</a></p>
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
        </div>
    );
}export const dynamic = 'force-dynamic';
