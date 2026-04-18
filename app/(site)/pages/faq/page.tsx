import FAQSection from '@/components/common/faq-section';
import { FAQ_DATA } from '@/lib/constants/faq-data';

// ✅ SEO: Metadata
export async function generateMetadata() {
    return {
        title: 'Frequently Asked Questions - MythToy',
        description: 'Find answers to common questions about MythToy products, shipping, returns, and customer support.',
        alternates: {
            canonical: 'https://mythtoy.com/pages/faq',
        },
        openGraph: {
            title: 'FAQ - MythToy Support',
            description: 'Get answers to your questions about our premium adult lifestyle products.',
            type: 'website',
        },
    };
}

// ✅ Structured Data for FAQPage
const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap(category => 
        category.items.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer.replace(/\*\*/g, '').replace(/\n/g, '<br />')
            }
        }))
    )
};

export default function FAQPage() {
    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
            />
            
            <div className="container mx-auto py-12 px-4 max-w-3xl">
                <FAQSection context="all" />
            </div>
        </>
    );
}