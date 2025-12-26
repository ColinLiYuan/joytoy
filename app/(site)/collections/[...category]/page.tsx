// app/collections/[category]/page.tsx
import { productServiceServer } from '@/services/servers/product-service-server';
import { categoryService } from '@/services/category-service';
import { filterServiceServer } from '@/services/servers/product-filter-service-server';
import ProductList from '@/components/product/product-list';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import ErrorSection from '@/components/product/error-section';
import { Metadata } from 'next';
import { RootResponse, CategoryResponse } from '@/types/category';
// 👇 引入新组件
import CollectionHero from '@/components/collection/collection-hero';

const ITEMS_PER_PAGE = 12;

interface PageProps {
    params: Promise<{ category: string | string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const path = Array.isArray(resolvedParams.category)
        ? resolvedParams.category.join('/')
        : resolvedParams.category;
    const canonicalUrl = `https://mythtoy.com/collections/${path}`;
    return { title: 'Collection - Myth Toy', alternates: { canonical: canonicalUrl } };
}

// ... parsePriceRange 和 extractFilterArray 保持不变 ...
function parsePriceRange(priceRangeParam: string | string[] | undefined): [number, number] | null {
    if (!priceRangeParam) return null;
    try {
        const str = Array.isArray(priceRangeParam) ? priceRangeParam[0] : priceRangeParam;
        if (str.includes('-')) {
            const [min, max] = str.split('-').map(Number);
            return [min, max];
        }
    } catch (e) {}
    return null;
}

function extractFilterArray(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') return data;
    if (Array.isArray(data) && data.length > 0 && data[0]?.keyWord) return data.map(item => item.keyWord);
    return [];
}

export default async function ProductListPage({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);

    const urlSegments = Array.isArray(resolvedParams.category)
        ? resolvedParams.category
        : [resolvedParams.category];

    const fullSlug = urlSegments.join('/');
    const page = parseInt(resolvedSearchParams.page as string) || 0;
    const sortParam = resolvedSearchParams.sort as string || 'newest';
    const priceRange = parsePriceRange(resolvedSearchParams.priceRange);

    const filters = {
        priceRange,
        colors: resolvedSearchParams.colors ? (resolvedSearchParams.colors as string).split(',') : [],
        features: resolvedSearchParams.features ? (resolvedSearchParams.features as string).split(',') : [],
        materials: resolvedSearchParams.materials ? (resolvedSearchParams.materials as string).split(',') : [],
        sortBy: sortParam === 'price-low' ? 'currentPrice' : sortParam === 'price-high' ? 'currentPrice' : 'createdAt',
        sortDirection: sortParam === 'price-low' ? 'ASC' : 'DESC'
    };

    try {
        const [categoriesResult, productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
            categoryService.getCategories(),
            productServiceServer.getProductsByCategory(fullSlug, page, ITEMS_PER_PAGE, filters),
            filterServiceServer.getFilters('colors'),
            filterServiceServer.getFilters('features'),
            filterServiceServer.getFilters('materials'),
        ]);

        const categoriesData = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : { content: [], totalPages: 0, totalElements: 0, currentPage: 0 };
        const availableFilters = {
            colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
            features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
            materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
        };

        // 查找分类逻辑
        let currentCategory: CategoryResponse | RootResponse | null = null;
        let parentCategory: RootResponse | null = null;

        if (categoriesData.length > 0) {
            const rootSlug = urlSegments[0];
            const rootMatch = categoriesData.find(root => root.slug === rootSlug);

            if (urlSegments.length === 1) {
                currentCategory = rootMatch || null;
            } else if (urlSegments.length >= 2 && rootMatch) {
                parentCategory = rootMatch;
                const subSlug = urlSegments[1];
                console.log('currentCategory:', rootMatch)
                if (rootMatch.categories) {
                    currentCategory = rootMatch.categories.find(sub =>
                        sub.slug === subSlug || sub.slug.endsWith(`/${subSlug}`) || sub.slug === fullSlug
                    ) || null;
                }
            }
        }

        if (!currentCategory) {
            const lastSegment = urlSegments[urlSegments.length - 1];
            currentCategory = {
                name: lastSegment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                slug: fullSlug,
                id: 0,
                // image: undefined
            } as any;
        }

        // 面包屑逻辑
        const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
        if (parentCategory) {
            breadcrumbs.push({
                name: parentCategory.name,
                path: `/collections/${parentCategory.slug}`
            });
        }
        breadcrumbs.push({
            name: currentCategory?.name || 'Collection',
            path: null
        });

        return (
            <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">

                {/* 1. 面包屑容器 */}
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                    <Breadcrumb items={breadcrumbs} showLastItem={true} />
                </div>

                {/* 2. ✅ 使用新提取的 CollectionHero 组件 */}
                <CollectionHero
                    title={currentCategory?.name || 'Collection'}
                    description={(currentCategory as any)?.description}
                    imagePath={(currentCategory as any)?.image}
                />

                {/* 3. 产品列表容器 */}
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                    <div className="flex flex-col w-full">
                        <main className="flex-1 min-w-0 w-full">
                            <ProductList
                                products={productsData.content}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalPages={productsData.totalPages}
                                currentPage={page}
                                totalProducts={productsData.totalElements}
                                availableFilters={availableFilters}
                                initialFilters={filters}
                            />
                        </main>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error loading page:', error);
        return <ErrorSection />;
    }
}