// app/collections/[category]/page.tsx
import { productServiceServer } from '@/services/servers/product-service-server';
import { categoryService } from '@/services/category-service';
import { filterServiceServer } from '@/services/servers/product-filter-service-server';
import ProductList from '@/components/product/product-list';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import ErrorSection from '@/components/product/error-section';
import { Metadata } from 'next';
import { RootResponse, CategoryResponse } from '@/types/category';
import CollectionHero from '@/components/collection/collection-hero';
import FAQSection from '@/components/common/faq-section';



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
        const [rootsResult, productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
            categoryService.getRoots(),  // ✅ 使用 getRoots() 获取嵌套结构
            productServiceServer.getProductsByCategory(fullSlug, page, ITEMS_PER_PAGE, filters),
            filterServiceServer.getFilters('colors'),
            filterServiceServer.getFilters('features'),
            filterServiceServer.getFilters('materials'),
        ]);

        const rootsData = rootsResult.status === 'fulfilled' ? rootsResult.value : [];
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : { content: [], totalPages: 0, totalElements: 0, currentPage: 0 };
        const availableFilters = {
            colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
            features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
            materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
        };

        // ✅ 使用 rootsData 查找分类逻辑
        let currentCategory: CategoryResponse | RootResponse | null = null;
        let parentCategory: RootResponse | null = null;

        if (rootsData.length > 0) {
            const rootSlug = urlSegments[0];
            const rootMatch = rootsData.find(root => root.slug === rootSlug);

            // 如果是根分类 (例如: /collections/female-sex-toys)
            if (urlSegments.length === 1) {
                currentCategory = rootMatch || null;
            }
            // 如果是二级分类 (例如: /collections/female-sex-toys/clit-vibrators)
            else if (urlSegments.length >= 2 && rootMatch) {
                parentCategory = rootMatch;

                // 构建子分类的完整slug
                const subSlug = urlSegments.slice(1).join('/');

                if (rootMatch.categories && rootMatch.categories.length > 0) {
                    // 在子分类中查找
                    currentCategory = rootMatch.categories.find(sub => {
                        // 完全匹配完整slug
                        if (sub.slug === fullSlug) return true;

                        // 匹配子分类slug (例如: clit-vibrators 匹配 female-sex-toys/clit-vibrators)
                        if (sub.slug.endsWith(`/${subSlug}`)) return true;

                        // 匹配最后一段
                        const lastSegment = urlSegments[urlSegments.length - 1];
                        if (sub.slug.endsWith(`/${lastSegment}`)) return true;

                        return false;
                    }) || null;
                }
            }
        }

        // 如果还是没找到，尝试在所有分类中查找
        if (!currentCategory) {
            const allCategories = await categoryService.getCategories();
            currentCategory = allCategories.find(cat => cat.slug === fullSlug) || null;

            // 如果找到了，尝试找到父分类
            if (currentCategory && (currentCategory as any).root) {
                const rootSlug = (currentCategory as any).root;
                parentCategory = rootsData.find(root => root.slug === rootSlug) || null;
            }
        }

        // 如果还是没找到，使用回退逻辑
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

        // 如果是二级分类，添加父分类
        if (parentCategory) {
            breadcrumbs.push({
                name: parentCategory.name,
                path: `/collections/${parentCategory.slug}`
            });
        }

        // 如果是根分类且不是当前分类（避免重复）
        if (!parentCategory && urlSegments.length === 1 && currentCategory) {
            // 已经在breadcrumbs中添加了当前分类，这里不需要重复添加
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

                <div className="container mx-auto px-4 sm:px-6">
                    <div className="border-t border-gray-100 pt-16 pb-24 max-w-3xl mx-auto">
                        {/*
                           tag 传递当前分类的完整 slug (例如 "female-sex-toys")，
                           FAQSection 内部应根据 tag 获取相关 QA
                        */}
                        <FAQSection tag={currentCategory?.slug} />
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error loading page:', error);
        return <ErrorSection />;
    }
}