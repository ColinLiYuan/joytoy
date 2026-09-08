// 集合落地页（/collections/{slug}）。
// 路由优先级：静态段 > [slug] > [...category]，本页接管单段 URL。
// 先查后端集合（/api/V1/collections/{slug}）：
//   - 命中 → 渲染集合落地页（元数据 + 商品按后台 product_ids 顺序分页）
//   - 未命中 → 回退分类渲染（CategoryLanding，与旧 [...category] 页行为一致），
//     保证既有分类 URL（/collections/female-sex-toys 等）不受影响。
// 集合 slug 与分类 slug 重名时集合优先，由后台运营避免重名。
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { collectionService } from '@/services/collectionService';
import CategoryLanding from '@/components/category/category-landing';
import CollectionPageClient from '@/components/collection/collection-page-client';
import { isHiddenCategory } from '@/lib/constants/hidden-categories';

const ITEMS_PER_PAGE = 12;

export const revalidate = 86400;

function titleFromSlug(slug: string): string {
    return slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const collection = await collectionService.getBySlug(slug, 0, 1);
    // 隐藏分类（realistic / torso）的集合页或分类回退页都不让 Google 收录
    const hiddenRobots = isHiddenCategory([slug]) ? { robots: { index: false } } : {};
    if (collection) {
        return {
            title: collection.metaTitle || collection.name,
            description: collection.metaDescription || collection.description || undefined,
            alternates: { canonical: `/collections/${slug}` },
            ...hiddenRobots,
        };
    }
    // 回退分类：沿用旧 [...category] 行为，canonical 指向分类页本身（避免继承全局 canonical 指向首页）
    return {
        title: titleFromSlug(slug),
        alternates: { canonical: `/collections/${slug}` },
        ...hiddenRobots,
    };
}

export default async function CollectionLandingPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const collection = await collectionService.getBySlug(slug, 0, ITEMS_PER_PAGE);

    if (collection) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
        const canonicalUrl = `${baseUrl}/collections/${slug}`;

        const productSchemas = collection.products.content.slice(0, 20).map((product: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `${baseUrl}/toys${product.slug}`,
            "item": {
                "@type": "Product",
                "name": product.name,
                "image": product.primaryImage || product.image || '',
                "brand": { "@type": "Brand", "name": "MythToy" },
                "offers": {
                    "@type": "Offer",
                    "price": product.currentPrice || product.price || '',
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock",
                    "url": `${baseUrl}/toys${product.slug}`
                }
            }
        }));

        const collectionPageSchema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "@id": `${canonicalUrl}#collection`,
                    "url": canonicalUrl,
                    "name": `${collection.name} — MythToy`,
                    "description": collection.description || `Shop the ${collection.name} collection at MythToy.`,
                    "isPartOf": { "@id": `${baseUrl}/#website` },
                    ...(collection.products.content.length > 0 ? {
                        "mainEntity": { "@id": `${canonicalUrl}#products` }
                    } : {})
                },
                ...(collection.products.content.length > 0 ? [{
                    "@type": "ItemList",
                    "@id": `${canonicalUrl}#products`,
                    "itemListOrder": "https://schema.org/ItemListOrderAscending",
                    "numberOfItems": collection.products.content.length,
                    "itemListElement": productSchemas
                }] : [])
            ]
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
                />
                <Suspense fallback={
                    <div className="min-h-[400px] flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                }>
                    <CollectionPageClient initialCollection={collection} />
                </Suspense>
            </>
        );
    }

    // 查无集合 → 回退分类落地页（既有分类 URL 行为不变）
    return <CategoryLanding urlSegments={[slug]} />;
}
