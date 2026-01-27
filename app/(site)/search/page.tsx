import { productServiceServer } from '@/services/servers/product-service-server'; // ✅ 引用服务端 Service
import { filterServiceServer } from '@/services/servers/product-filter-service-server';
import ProductList from '@/components/product/product-list';
import Breadcrumb from '@/components/common/breadcrumb';
import { Metadata } from 'next';

const ITEMS_PER_PAGE = 12;

// --- 辅助函数 (可以直接写在这里) ---
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

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const query = (resolvedParams.q as string) || '';
    return {
        title: query ? `Search Results for "${query}" - Myth Toy` : 'Search - Myth Toy',
        robots: { index: false } // 搜索结果页通常不建议被收录
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;

    // 1. 解析参数
    const query = (resolvedSearchParams.q as string) || '';
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
        // 2. 并行调用服务端接口 (Search + Filters)
        const [productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
            // ✅ 这里直接调用服务端 Service，不走 Next API 路由
            productServiceServer.searchProducts(query, page, ITEMS_PER_PAGE, filters),
            filterServiceServer.getFilters('colors'),
            filterServiceServer.getFilters('features'),
            filterServiceServer.getFilters('materials'),
        ]);

        // 3. 处理数据
        const productsData = productsResult.status === 'fulfilled' ? productsResult.value : { content: [], totalPages: 0, totalElements: 0, currentPage: 0 };

        const availableFilters = {
            colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
            features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
            materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
        };

        const breadcrumbs = [
            { name: 'Home', path: '/' },
            { name: 'Search', path: null },
        ];

        return (
            <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
                {/* 面包屑 */}
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                    <Breadcrumb items={breadcrumbs} showLastItem={true} />
                </div>

                {/* 标题 */}
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {query ? `Search Results for "${query}"` : 'Search Products'}
                    </h1>
                    <p className="text-gray-500">
                        {productsData.totalElements} products found
                    </p>
                </div>

                {/* 列表区域 */}
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                    <ProductList
                        products={productsData.content}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalPages={productsData.totalPages}
                        currentPage={page}
                        totalProducts={productsData.totalElements}
                        availableFilters={availableFilters}
                        initialFilters={filters}
                    />
                </div>
            </section>
        );

    } catch (error) {
        console.error('Error loading search page:', error);
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                <p>Please try refreshing the page.</p>
            </div>
        );
    }
}