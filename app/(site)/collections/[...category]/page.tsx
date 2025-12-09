// app/collections/[category]/page.tsx
import { productServiceServer } from '@/services/servers/product-service-server';
import { categoryService } from '@/services/category-service';
import { filterServiceServer } from '@/services/servers/product-filter-service-server';
import ProductList from '@/components/product/product-list';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import ErrorSection from '@/components/product/error-section';
import { Metadata } from 'next';
import { RootResponse, CategoryResponse } from '@/types/category';

const ITEMS_PER_PAGE = 12;

interface PageProps {
    params: Promise<{ category: string | string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    // 构造完整路径用于 canonical
    const path = Array.isArray(resolvedParams.category)
        ? resolvedParams.category.join('/')
        : resolvedParams.category;

    const canonicalUrl = `https://mythtoy.com/collections/${path}`;

    return {
        title: 'Collection - Myth Toy',
        alternates: { canonical: canonicalUrl },
    };
}

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

    // ✅ 核心修复 1：把 URL 拆解为数组 segments
    // 例如 /collections/female-sex-toys/vibrators -> ['female-sex-toys', 'vibrators']
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

        // ✅ 核心修复 2：根据 URL 数组层级来查找分类
        let currentCategory: CategoryResponse | RootResponse | null = null;
        let parentCategory: RootResponse | null = null;

        if (categoriesData.length > 0) {
            // 第一段通常是 Root Slug (如 female-sex-toys)
            const rootSlug = urlSegments[0];
            const rootMatch = categoriesData.find(root => root.slug === rootSlug);

            if (urlSegments.length === 1) {
                // 只有一级：/collections/female-sex-toys
                currentCategory = rootMatch || null;
            } else if (urlSegments.length >= 2 && rootMatch) {
                // 有二级：/collections/female-sex-toys/vibrators
                parentCategory = rootMatch;
                const subSlug = urlSegments[1];

                // 尝试在子分类里找
                if (rootMatch.categories) {
                    currentCategory = rootMatch.categories.find(sub =>
                        // 兼容两种后端 Slug 格式：'vibrators' 或 'female-sex-toys/vibrators'
                        sub.slug === subSlug || sub.slug.endsWith(`/${subSlug}`) || sub.slug === fullSlug
                    ) || null;
                }
            }
        }

        // 兜底：如果数据库没匹配到，手动构造（保证页面不崩）
        if (!currentCategory) {
            const lastSegment = urlSegments[urlSegments.length - 1];
            currentCategory = {
                name: lastSegment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                slug: fullSlug,
                id: 0
            } as any;
        }

        // ✅ 核心修复 3：构造正确的层级面包屑
        const breadcrumbs: BreadcrumbItem[] = [
            { name: 'Home', path: '/' }
        ];

        // 1. 如果有父级，添加父级链接
        if (parentCategory) {
            breadcrumbs.push({
                name: parentCategory.name,
                path: `/collections/${parentCategory.slug}`
            });
        }

        // 2. 添加当前级（无链接）
        breadcrumbs.push({
            name: currentCategory.name,
            path: null
        });

        return (
            <section className="min-h-screen bg-gray-50 py-8 w-full max-w-full overflow-x-hidden">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

                    <div className="mb-6">
                        <Breadcrumb items={breadcrumbs} showLastItem={true} />
                    </div>

                    <div className="mb-10 text-left border-b border-gray-200 pb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-['Playfair_Display'] leading-tight">
                            {currentCategory.name}
                        </h1>
                        {(currentCategory as any).description && (
                            <p className="text-gray-500 text-base md:text-lg max-w-3xl leading-relaxed">
                                {(currentCategory as any).description}
                            </p>
                        )}
                    </div>

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