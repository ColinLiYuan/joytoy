// app/(site)/page.tsx - SSR 服务端组件
// 产品数据在服务端获取，Google 爬虫可直接看到产品内容
import { productService } from '@/services/productService';
import { collectionService } from '@/services/collectionService';
import { ProductResponse } from '@/types/product';
import { CollectionCardResponse } from '@/types/collection';
import { getProductImageUrl } from '@/lib/image-utils';
import type { Metadata } from 'next';
export const revalidate = 3600;

// 首页显式 canonical（根布局不再设全局 canonical，各页面自行声明，避免分类页误继承首页 canonical）
export function generateMetadata(): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    return {
        title: 'MythToy — Premium Adult Lifestyle Products',
        description: 'Discover premium body-safe devices for wellness and intimacy. MythToy blends elegance with technology. Discreet shipping and secure checkout.',
        alternates: { canonical: baseUrl },
    };
}

import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';
import TrustSignals from '@/components/home/trust-signals';
import FAQSection from '@/components/common/faq-section';

export default async function HomePage() {
    let bestSellers: ProductResponse[] = [];
    let homeCollections: CollectionCardResponse[] = [];
    let fetchError: string | null = null;

    try {
        // 首页聚合 /api/V1/home：show_on_home 集合卡片（含预览商品，人工序）。
        // 首页商品区 = 集合预览商品拼接去重；isFeatured 已退役（无 admin 设置入口）。
        const home = await collectionService.getHome();
        if (home?.collections?.length) {
            const seen = new Set<number>();
            for (const product of home.collections.flatMap(c => c.products)) {
                if (!seen.has(product.id)) {
                    seen.add(product.id);
                    bestSellers.push(product);
                }
            }
        }
        homeCollections = home?.collections || [];
    } catch (err) {
        console.error('Error fetching home aggregate:', err);
        fetchError = 'Failed to load products';
    }

    // 无集合（/api/V1/home 为空/失败）时回退到原 /product/hero 数据，保证首页有真实数据展示
    if (bestSellers.length === 0) {
        try {
            const products = await productService.getHeroProducts();
            if (Array.isArray(products)) {
                bestSellers = products;
            }
        } catch (err) {
            console.error('Error fetching hero products:', err);
            fetchError = 'Failed to load products';
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';

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

    // Product/ItemList schema for Editor's Choice products
    const productListSchema = bestSellers.length > 0 ? {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "@id": `${baseUrl}/#editors-choice`,
                "url": baseUrl,
                "name": "Editor's Choice — Best Adult Toys 2026",
                "description": "Curated selection of premium body-safe pleasure products, tested and recommended by MythToy.",
                "numberOfItems": bestSellers.length,
                "itemListOrder": "https://schema.org/ItemListOrderAscending",
                "itemListElement": bestSellers.map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `${baseUrl}/toys${product.slug}`,
                    "item": {
                        "@type": "Product",
                        "name": product.name || product.title,
                        "image": getProductImageUrl(undefined, product.image) || '',
                        "brand": { "@type": "Brand", "name": "MythToy" },
                        "offers": {
                            "@type": "Offer",
                            "price": product.currentPrice || '',
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "url": `${baseUrl}/toys${product.slug}`
                        },
                        ...(product.rating && (product.reviewCount ?? 0) > 0 ? {
                            aggregateRating: {
                                "@type": "AggregateRating",
                                "ratingValue": product.rating,
                                "reviewCount": product.reviewCount,
                                "bestRating": "5",
                                "worstRating": "1"
                            }
                        } : {}),
                        "description": product.description
                            ? product.description.replace(/[#*`]/g, '').substring(0, 160)
                            : `${product.name || product.title} — body-safe premium pleasure product by MythToy.`
                    }
                }))
            }
        ]
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
            />
            {productListSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
                />
            )}

            <ClientAgeVerification />

            <div className="w-full max-w-full overflow-x-hidden">
                <HeroSection />
                <BestSellersSection bestSellers={bestSellers} error={fetchError} loading={false} />
                <CategoriesSection collections={homeCollections} />
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
