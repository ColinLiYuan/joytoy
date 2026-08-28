// components/collection/collection-page-client.tsx
// 集合落地页客户端：服务端出初始数据，翻页时 ?page=N 驱动重取（与分类页 CategoryPageClient 同模式）。
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collectionService } from '@/services/collectionService';
import { CollectionDetailResponse } from '@/types/collection';
import { ProductListResponse } from '@/types/product';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import CollectionHero from '@/components/collection/collection-hero';
import SimpleProductGrid from '@/components/product/simple-product-grid';
import Pagination from '@/components/common/pagination';

const ITEMS_PER_PAGE = 12;

interface CollectionPageClientProps {
    initialCollection: CollectionDetailResponse;
}

export default function CollectionPageClient({ initialCollection }: CollectionPageClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isInitialMount = useRef(true);

    const [productsData, setProductsData] = useState<ProductListResponse>(initialCollection.products);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams(window.location.search);
            const page = parseInt(params.get('page') || '0') || 0;
            const collection = await collectionService.getBySlug(initialCollection.slug, page, ITEMS_PER_PAGE);
            if (collection) {
                setProductsData(collection.products);
            } else {
                setError('Failed to load collection products');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load collection products');
        } finally {
            setLoading(false);
        }
    }, [initialCollection.slug]);

    // 翻页：?page=N 写回 URL 后由 searchParams 变化触发重取
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        fetchData();
    }, [fetchData, searchParams]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        if (page === 0) {
            params.delete('page');
        } else {
            params.set('page', String(page));
        }
        const qs = params.toString();
        router.push(`/collections/${initialCollection.slug}${qs ? `?${qs}` : ''}`, { scroll: true });
    };

    if (error) {
        return (
            <section className="min-h-[400px] bg-white flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: initialCollection.name, path: null },
    ];

    return (
        <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={true} />
            </div>

            <CollectionHero
                title={initialCollection.name}
                description={initialCollection.description || undefined}
                imagePath={initialCollection.image || undefined}
            />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                {loading && productsData.content.length === 0 ? (
                    <div className="min-h-[400px] flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : productsData.content.length > 0 ? (
                    <>
                        <SimpleProductGrid products={productsData.content} />
                        <Pagination
                            currentPage={productsData.currentPage}
                            totalPages={productsData.totalPages}
                            totalElements={productsData.totalElements}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        No products in this collection yet.
                    </div>
                )}
            </div>
        </section>
    );
}
