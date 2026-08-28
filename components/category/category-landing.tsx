// components/category/category-landing.tsx
// 分类落地页服务端组件（从 app/(site)/collections/[...category]/page.tsx 抽出，
// 供分类页与集合页回退共用：/collections/[slug] 查无集合时回退到分类渲染）。
import { Suspense } from 'react';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { filterService } from '@/services/filterService';
import { blogService } from '@/services/blogService';
import { CategoryResponse, RootResponse } from '@/types/category';
import { BlogResponse } from '@/types/site/blog';
import { getRelatedBlogSlugs } from '@/lib/constants/related-guides';
import CategoryPageClient from '@/app/(site)/collections/[...category]/CategoryPageClient';

const ITEMS_PER_PAGE = 12;

function extractFilterArray(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') return data;
    if (Array.isArray(data) && data.length > 0 && data[0]?.keyWord) return data.map((item: any) => item.keyWord);
    return [];
}

export default async function CategoryLanding({ urlSegments }: { urlSegments: string[] }) {
    const fullSlug = urlSegments.join('/');

    // Fetch default state server-side (page 0, no filters) for SEO
    const defaultFilters = {
        priceRange: undefined,
        colors: [] as string[],
        features: [] as string[],
        materials: [] as string[],
        sortBy: 'createdAt' as const,
        sortDirection: 'DESC' as const,
    };

    const [rootsResult, productsResult, colorsResult, featuresResult, materialsResult] =
        await Promise.allSettled([
            categoryService.getRoots(),
            productService.getProductsByCategory(fullSlug, 0, ITEMS_PER_PAGE, defaultFilters),
            filterService.getFilters('colors'),
            filterService.getFilters('features'),
            filterService.getFilters('materials')
        ]);

    const rootsData: RootResponse[] = rootsResult.status === 'fulfilled' ? rootsResult.value : [];
    const productsData = productsResult.status === 'fulfilled' ? productsResult.value : {
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: ITEMS_PER_PAGE,
        hasNext: false,
        hasPrevious: false
    };
    const availableFilters = {
        colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
        features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
        materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
    };

    // Find current category and parent
    let currentCategory: CategoryResponse | RootResponse | null = null;
    let parentCategory: RootResponse | null = null;

    if (rootsData.length > 0) {
        const rootSlug = urlSegments[0];
        const rootMatch = rootsData.find(root => root.slug === rootSlug);

        if (urlSegments.length === 1) {
            currentCategory = rootMatch || null;
        } else if (urlSegments.length >= 2 && rootMatch) {
            parentCategory = rootMatch;
            const subSlug = urlSegments.slice(1).join('/');
            if (rootMatch.categories && rootMatch.categories.length > 0) {
                currentCategory = rootMatch.categories.find(sub => {
                    if (sub.slug === fullSlug) return true;
                    if (sub.slug.endsWith(`/${subSlug}`)) return true;
                    const lastSegment = urlSegments[urlSegments.length - 1];
                    if (sub.slug.endsWith(`/${lastSegment}`)) return true;
                    return false;
                }) || null;
            }
        }
    }

    if (!currentCategory) {
        try {
            const allCategories = await categoryService.getCategories();
            currentCategory = allCategories.find(cat => cat.slug === fullSlug) || null;
            if (currentCategory && (currentCategory as any).root) {
                const rootSlug = (currentCategory as any).root;
                parentCategory = rootsData.find(root => root.slug === rootSlug) || null;
            }
        } catch {}
    }

    if (!currentCategory) {
        const lastSegment = urlSegments[urlSegments.length - 1];
        currentCategory = {
            name: lastSegment.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            slug: fullSlug,
            id: 0,
        } as any;
    }

    const isAllSlug = fullSlug === 'all';
    const categoryName = isAllSlug ? 'All Products' : (currentCategory?.name || 'Collection');
    const categoryDescription = (currentCategory as any)?.description || '';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    const canonicalUrl = `${baseUrl}/collections/${fullSlug}`;

    // Fetch related blog guides for this category
    const parentSlug = parentCategory?.slug || urlSegments[0];
    const relatedBlogSlugs = getRelatedBlogSlugs(fullSlug, parentSlug);
    let relatedGuides: BlogResponse[] = [];
    if (relatedBlogSlugs.length > 0 && fullSlug !== 'all') {
        const blogResults = await Promise.allSettled(
            relatedBlogSlugs.slice(0, 3).map(slug => blogService.getBySlug(slug))
        );
        relatedGuides = blogResults
            .filter((r): r is PromiseFulfilledResult<BlogResponse> => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(g => g?.slug);
    }

    // Build schema
    const breadcrumbItems = [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
    ];
    if (parentCategory) {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 2,
            "name": parentCategory.name,
            "item": `${baseUrl}/collections/${parentCategory.slug}`
        });
    }
    breadcrumbItems.push({
        "@type": "ListItem",
        "position": parentCategory ? 3 : 2,
        "name": categoryName,
        "item": canonicalUrl
    });

    const productSchemas = productsData.content.slice(0, 20).map((product: any, index: number) => ({
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
                "availability": product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
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
                "name": `${categoryName} — MythToy`,
                "description": categoryDescription || `Shop premium ${categoryName.toLowerCase()} at MythToy. Body-safe materials, discreet shipping, 1-year warranty.`,
                "isPartOf": { "@id": `${baseUrl}/#website` },
                ...(productsData.content.length > 0 ? {
                    "mainEntity": { "@id": `${canonicalUrl}#products` }
                } : {})
            },
            ...(productsData.content.length > 0 ? [{
                "@type": "ItemList",
                "@id": `${canonicalUrl}#products`,
                "itemListOrder": "https://schema.org/ItemListOrderAscending",
                "numberOfItems": productsData.content.length,
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
                <CategoryPageClient
                    initialData={{
                        rootsData,
                        productsData,
                        availableFilters,
                        currentCategory,
                        parentCategory,
                        urlSegments,
                        fullSlug,
                    }}
                />
            </Suspense>

            {/* Related Guides — bottom of category page for SEO internal linking */}
            {relatedGuides.length > 0 && (
                <section className="w-full bg-[#F9FAFB] py-16 border-t border-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                            Related Guides
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedGuides.map(guide => (
                                <a
                                    key={guide.id}
                                    href={`/blog/${guide.slug}`}
                                    className="group block p-6 rounded-xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
                                >
                                    <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-black transition-colors line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    {guide.summary && (
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {guide.summary}
                                        </p>
                                    )}
                                    <span className="inline-block mt-3 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                                        Read more →
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
