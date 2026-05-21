// app/(site)/page.tsx - SSR 服务端组件
// 产品数据在服务端获取，Google 爬虫可直接看到产品内容
import { productService } from '@/services/productService';
import { ProductResponse } from '@/types/product';
import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';
import TrustSignals from '@/components/home/trust-signals';
import FAQSection from '@/components/common/faq-section';

export default async function HomePage() {
    let bestSellers: ProductResponse[] = [];
    let fetchError: string | null = null;

    try {
        const products = await productService.getHeroProducts();
        if (Array.isArray(products)) {
            bestSellers = products;
        }
    } catch (err) {
        console.error('Error fetching hero products:', err);
        fetchError = 'Failed to load products';
    }

    const faqPageSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How long will it take to receive my order?",
                "acceptedAnswer": {"@type": "Answer", "text": "We ship worldwide via dedicated priority lines. USA: 5-12 business days. EU/UK: 5-14 business days. Processing time: 1-3 days."}
            },
            {
                "@type": "Question",
                "name": "What appears on my bank statement?",
                "acceptedAnswer": {"@type": "Answer", "text": "For your privacy, transactions appear as 'MT TECH'. There is no mention of MythToy or adult products on your statement."}
            },
            {
                "@type": "Question",
                "name": "What materials do you use?",
                "acceptedAnswer": {"@type": "Answer", "text": "Vibrators and air-pulse tools use 100% non-porous medical-grade silicone. Strokers use high-grade skin-like TPE. All materials are phthalate-free."}
            },
            {
                "@type": "Question",
                "name": "Is there a warranty?",
                "acceptedAnswer": {"@type": "Answer", "text": "Yes. We offer a 1-year limited warranty on all electronic devices. If it fails, we replace it."}
            },
            {
                "@type": "Question",
                "name": "What is Air-Pulse technology?",
                "acceptedAnswer": {"@type": "Answer", "text": "Air-Pulse technology uses rapid waves of air pressure to stimulate the clitoris without direct contact. It mimics the sensation of oral sex and powers our Onyx series."}
            },
            {
                "@type": "Question",
                "name": "Are your products waterproof?",
                "acceptedAnswer": {"@type": "Answer", "text": "All MythToy devices are shower and bath-friendly. Magnetic-charging models are 100% airtight. Pin-port models are IPX7 with internal water-sealing — pat the charging area dry before charging."}
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
            />

            <ClientAgeVerification />

            <div className="w-full max-w-full overflow-x-hidden">
                <HeroSection />
                <CategoriesSection />
                <BestSellersSection bestSellers={bestSellers} error={fetchError} loading={false} />
                <TrustSignals />
                <section className="w-full bg-white py-24">
                    <div className="container max-w-4xl mx-auto px-6">
                        <FAQSection context="home" />
                    </div>
                </section>
            </div>
        </>
    );
}
