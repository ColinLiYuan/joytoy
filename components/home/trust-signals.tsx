// components/home/trust-signals.tsx
import {
    Package,
    ShieldCheck,
    Lock,
    Stethoscope
} from 'lucide-react';

export default function TrustSignals() {
    const features = [
        {
            id: 'privacy',
            icon: Package,
            title: "100% Discreet Shipping",
            desc: "Plain packaging. No logos, no product names. Only you know what's inside."
        },
        {
            id: 'material',
            icon: ShieldCheck,
            title: "Body-Safe Materials",
            desc: "Certified medical-grade silicone & non-toxic ABS. Safe for your most intimate areas."
        },
        {
            id: 'security',
            icon: Lock,
            title: "Secure Checkout",
            desc: "256-bit SSL encryption. We never store your credit card information."
        },
        {
            id: 'expert',
            icon: Stethoscope,
            title: "Expert Approved",
            desc: "Curated collection recommended by wellness experts and verified testers."
        }
    ];

    return (
        <section id="trust" className="relative py-16 md:py-24 bg-gradient-to-b from-white via-pink-50/30 to-white w-full">

            {/* ✅ 修复核心：将装饰元素单独放在一个绝对定位且 overflow-hidden 的容器中 */}
            {/* pointer-events-none 确保不会阻挡点击，inset-0 填满父容器 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50"></div>
                {/* 注意：这里增加了 max-w-full 限制 */}
                <div className="absolute -left-20 top-40 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -right-20 top-40 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-pink-600 font-semibold tracking-wider uppercase text-sm mb-2 block">
                        Shop With Confidence
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">
                        Why Choose MythToy?
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We prioritize your privacy and safety above all else. Experience pleasure without worry.
                    </p>
                </div>

                {/* 卡片网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="group bg-white rounded-2xl p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-out hover:-translate-y-2 border border-gray-100/50"
                            >
                                {/* 图标容器 */}
                                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 group-hover:from-pink-100 group-hover:to-purple-100 transition-colors duration-300">
                                    <IconComponent
                                        size={32}
                                        className="text-pink-600 group-hover:text-purple-600 transition-colors duration-300 drop-shadow-sm"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* 文字内容 */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-700 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600">
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* 底部信任徽章 */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Secure Payment Partners</span>
                </div>
            </div>
        </section>
    );
}