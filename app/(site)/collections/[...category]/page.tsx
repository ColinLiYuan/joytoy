// /app/collections/[category]/route.tsx
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

// 从 layout 移过来的元数据生成函数
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const categoryParam = resolvedParams.category;

    let slug: string;
    if (Array.isArray(categoryParam)) {
        slug = categoryParam.join('/');
    } else if (categoryParam) {
        slug = categoryParam;
    } else {
        slug = '';
    }

    try {
        const categoryData = await categoryService.getCategoryBySlug(slug);

        if (categoryData) {
            const title = categoryData.name;
            const description = categoryData.description || `浏览 ${title} 分类的高品质玩具`;
            const url = `https://mythtoy.com/collections/${slug}`;

            return {
                title: `${title} - Myth Toy`,
                description: description,
                robots: 'index, follow',
                other: {
                    'format-detection': 'telephone=no'
                },
                openGraph: {
                    title: title,
                    description: description,
                    url: url,
                    type: 'website',
                    siteName: 'Myth Toy',
                },
                alternates: {
                    canonical: url,
                },
            };
        }

    } catch (error) {
        console.error('❌ Error in generateMetadata:', error);
    }

    return {
        title: 'Myth Toy - toys from china',
        description: 'source factory supplies',
        robots: 'index, follow',
        openGraph: {
            title: 'Myth Toy',
            description: 'source factory supplies',
            type: 'website',
            siteName: 'Myth Toy',
        },
    };
}

// 从 layout 移过来的 viewport 配置
export const viewport = {
    width: 'device-width',
    initialScale: 1,
}

function parsePriceRange(priceRangeParam: string | string[] | undefined): [number, number] | null {
    if (!priceRangeParam) return null;

    try {
        const priceRangeStr = Array.isArray(priceRangeParam) ? priceRangeParam[0] : priceRangeParam;

        if (typeof priceRangeStr === 'string' && priceRangeStr.includes('-')) {
            const [min, max] = priceRangeStr.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                return [min, max];
            }
        }

        const parsed = JSON.parse(priceRangeStr);
        if (Array.isArray(parsed) && parsed.length === 2 &&
            typeof parsed[0] === 'number' && typeof parsed[1] === 'number') {
            return [parsed[0], parsed[1]];
        }

        return null;
    } catch (error) {
        console.warn('Failed to parse priceRange:', priceRangeParam);
        return null;
    }
}

function extractFilterArray(data: any): string[] {
    if (!data) return [];

    if (Array.isArray(data)) {
        if (data.length > 0 && data[0]?.keyWord && Array.isArray(data[0].keyWord)) {
            return data[0].keyWord;
        }
        if (data.length > 0 && typeof data[0] === 'string') {
            return data;
        }
        if (data.length > 0 && data[0]?.keyWord) {
            return data.map((item: any) => item.keyWord);
        }
    }

    if (data?.keyWord && Array.isArray(data.keyWord)) {
        return data.keyWord;
    }

    if (data && typeof data === 'object') {
        const values = Object.values(data);
        if (values.length > 0 && Array.isArray(values[0])) {
            return values[0] as string[];
        }
    }

    console.warn('Unexpected filter data structure:', data);
    return [];
}

export default async function ProductListPage({ params, searchParams }: PageProps) {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const slugParam = resolvedParams.category;
    const categorySlug = Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam;
    const slug = Array.isArray(slugParam) ? slugParam.join('/') : (slugParam || '');
    const pathname = `/collections/${Array.isArray(slugParam) ? slugParam.join('/') : slugParam}`;

    const page = parseInt(resolvedSearchParams.page as string) || 0;
    const priceRange = parsePriceRange(resolvedSearchParams.priceRange);
    const colors = resolvedSearchParams.colors ? (resolvedSearchParams.colors as string).split(',') : [];
    const features = resolvedSearchParams.features ? (resolvedSearchParams.features as string).split(',') : [];
    const materials = resolvedSearchParams.materials ? (resolvedSearchParams.materials as string).split(',') : [];

    try {
        // console.log('ProductListPage init slug: ', slug)
        const results = await Promise.allSettled([
            categoryService.getCategories(),
            productServiceServer.getProductsByCategory(
                slug,
                page,
                ITEMS_PER_PAGE,
                {
                    priceRange,
                    colors,
                    features,
                    materials
                }
            ),
            filterServiceServer.getFilters('colors'),
            filterServiceServer.getFilters('features'),
            filterServiceServer.getFilters('materials'),
        ]);

        const categoriesData = results[0].status === 'fulfilled' ? results[0].value : null;
        const productsResponse = results[1].status === 'fulfilled' ? results[1].value : {
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: ITEMS_PER_PAGE,
            hasNext: false,
            hasPrevious: false
        };
        const colorsData = results[2].status === 'fulfilled' ? results[2].value : [];
        const featuresData = results[3].status === 'fulfilled' ? results[3].value : [];
        const materialsData = results[4].status === 'fulfilled' ? results[4].value : [];

        const categories = categoriesData || [];
        const products = productsResponse.content || [];
        const totalProducts = productsResponse.totalElements || 0;
        const totalPages = productsResponse.totalPages || 0;

        const availableFilters = {
            colors: extractFilterArray(colorsData),
            features: extractFilterArray(featuresData),
            materials: extractFilterArray(materialsData)
        };

        const currentCategory = categories.find(cat => cat.slug === slug) || {
            name: '',
            slug: slug,
            root: '',
            title: "",
            description: ""
        };

        return (
            <section className="min-h-screen bg-gray-50 py-6">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="w-full">
                        <div className="mb-6 sm:mx-2 md:mx-4">
                            <CollectionBread
                                currentCategory={currentCategory}
                                pathname={pathname}
                            />
                        </div>

                        <div className="flex flex-col">
                            <main className="flex-1 min-w-0">
                                <div className="border-t border-gray-300 sm:mx-2 md:mx-4 lg:mx-8">
                                    <ProductList
                                        products={products}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        totalPages={totalPages}
                                        currentPage={page}
                                        totalProducts={totalProducts}
                                        showSortSelect={true}
                                        showProductCount={true}
                                        showPagination={true}
                                        availableFilters={availableFilters}
                                        initialFilters={{
                                            priceRange,
                                            colors,
                                            features,
                                            materials
                                        }}
                                    />
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Error loading page:', error);
        return <ErrorSection />;
    }
}