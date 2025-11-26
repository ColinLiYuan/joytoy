// app/collections/[category]/page.tsx
import { productServiceServer } from '@/services/servers/product-service-server';
import { categoryService } from '@/services/category-service';
import { filterServiceServer } from '@/services/servers/product-filter-service-server';
import ProductList from '@/components/product/product-list';
import CollectionBread from '@/components/product/collection-bread';
import ErrorSection from '@/components/product/error-section';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 12;

interface PageProps {
    params: Promise<{ category: string | string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const categoryParam = resolvedParams.category;
    let slug = Array.isArray(categoryParam) ? categoryParam.join('/') : categoryParam;

    try {
        const categoryData = await categoryService.getCategoryBySlug(slug);
        if (categoryData) {
            return {
                title: `${categoryData.name} - Myth Toy`,
                description: categoryData.description || `Shop ${categoryData.name} at MythToy.`,
                openGraph: {
                    title: categoryData.name,
                    description: categoryData.description,
                    type: 'website',
                },
            };
        }
    } catch (error) {
        console.error(error);
    }
    return { title: 'Collection - Myth Toy' };
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

    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
        return data;
    }

    if (Array.isArray(data) && data.length > 0 && data[0]?.keyWord) {
        return data.map(item => item.keyWord);
    }

    return [];
}

export default async function ProductListPage({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const slugParam = resolvedParams.category;
    const slug = Array.isArray(slugParam) ? slugParam.join('/') : (slugParam || '');
    const pathname = `/collections/${slug}`;

    const page = parseInt(resolvedSearchParams.page as string) || 0;
    const sortParam = resolvedSearchParams.sort as string || 'newest';
    const priceRange = parsePriceRange(resolvedSearchParams.priceRange);

    // 构建筛选参数
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
            productServiceServer.getProductsByCategory(slug, page, ITEMS_PER_PAGE, filters),
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

        const currentCategory = categoriesData?.find(cat => cat.slug === slug) || {
            name: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            slug, root: '', title: "", description: ""
        };

        return (
            // ✅ 修复核心：强制锁死宽度，防止水平溢出
            <section className="min-h-screen bg-gray-50 py-6 w-full max-w-full overflow-x-hidden">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* 面包屑区域 */}
                    <div className="mb-6 w-full overflow-hidden">
                        <CollectionBread
                            currentCategory={currentCategory}
                            pathname={pathname}
                        />
                    </div>

                    {/* 主内容区域 */}
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