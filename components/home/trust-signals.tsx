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
            title: "Discreet Shipping",
            desc: "Plain packaging with no external branding. Your privacy is our absolute priority."
        },
        {
            id: 'material',
            icon: ShieldCheck,
            title: "Body-Safe Materials",
            desc: "100% premium medical-grade silicone. Hypoallergenic and strictly tested."
        },
        {
            id: 'security',
            icon: Lock,
            title: "Secure Checkout",
            desc: "Encrypted 256-bit SSL payments. We never store your personal financial data."
        },
        {
            id: 'expert',
            icon: Stethoscope,
            title: "Expert Curated",
            desc: "Selected by wellness professionals for ergonomics, safety, and pleasure."
        }
    ];

    return (
        <section className="w-full bg-white py-24 border-t border-gray-100">
            <div className="container max-w-7xl mx-auto px-6">

                {/* 可选：极其极简的 Section Title，或者完全省略让图标说话 */}
                {/* 既然是 Luxury Minimalist，我们不需要巨大的标题，只需要一个微妙的引言 */}
                <div className="mb-16 text-center">
                    <span className="text-[#1A1A1A] font-serif italic text-2xl md:text-3xl">
                        "Intimacy without compromise."
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="flex flex-col items-center text-center space-y-5"
                            >
                                {/* 1. Icon: No background, thin stroke, Midnight Black */}
                                <div className="p-2">
                                    <IconComponent
                                        size={40} // 稍微大一点，显得大气
                                        strokeWidth={1} // 极细线条，营造精致感
                                        className="text-[#1A1A1A]"
                                    />
                                </div>

                                {/* 2. Text Content */}
                                <div className="space-y-3">
                                    {/* Serif Title */}
                                    <h3 className="text-lg font-serif font-medium text-[#1A1A1A] tracking-wide">
                                        {feature.title}
                                    </h3>

                                    {/* Sans-serif Description */}
                                    <p className="text-sm text-gray-500 font-sans font-light leading-relaxed max-w-[250px] mx-auto">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}