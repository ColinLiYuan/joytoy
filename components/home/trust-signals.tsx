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

                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] mb-5">
                        Why MythToy
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">
                        A direct-from-manufacturer brand crafting premium body-safe pleasure objects.
                        Materials are chosen for the best tactile experience — medical-grade silicone
                        for insertable devices, skin-like TPE for strokers. All waterproof,
                        shipped worldwide in unmarked packaging, and backed by a 1-year warranty.
                        Discretion isn&rsquo;t an afterthought — it&rsquo;s the foundation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {features.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="flex flex-col items-center text-center space-y-5"
                            >
                                <div className="p-2">
                                    <IconComponent
                                        size={40}
                                        strokeWidth={1}
                                        className="text-[#1A1A1A]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <div className="text-lg font-serif font-medium text-[#1A1A1A] tracking-wide">
                                        {feature.title}
                                    </div>

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