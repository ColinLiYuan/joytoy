// services/servers/product-service-server.ts
import { ProductResponse } from '@/types/product';
import { callBackendGet } from '@/lib/backend-utils';
import { ProductListResponse } from '@/types/product';

class ProductServiceServer {
    /**
     * 根据分类获取产品（支持分页和筛选）
     */
    async getProductsByCategory(
        slug: string,
        page: number = 0,
        size: number = 12,
        filters?: {
            priceRange?: [number, number] | null;
            colors?: string[];
            features?: string[];
            materials?: string[];
            sortBy?: string;
            sortDirection?: string;
        }
    ): Promise<ProductListResponse> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            category: slug || '',
            sortBy: filters?.sortBy || 'createdAt',
            sortDirection: filters?.sortDirection || 'DESC'
        });

        // 添加筛选参数
        if (filters) {
            if (filters.priceRange && filters.priceRange.length === 2) {
                queryParams.append('minPrice', filters.priceRange[0].toString());
                queryParams.append('maxPrice', filters.priceRange[1].toString());
            }
            if (filters.colors && filters.colors.length > 0) {
                queryParams.append('colors', filters.colors.join(','));
            }
            if (filters.features && filters.features.length > 0) {
                queryParams.append('features', filters.features.join(','));
            }
            if (filters.materials && filters.materials.length > 0) {
                queryParams.append('materials', filters.materials.join(','));
            }
        }

        const url = `/api/V1/product/queryByCategory?${queryParams}`;

        const result = await callBackendGet<any>(url, {
            requiresAuth: true
        });

        // console.log('getProductsByCategory result:', result.data)

        const data = result.data?.data || result.data || {};

        return {
            content: Array.isArray(data.content) ? data.content : [],
            currentPage: data.currentPage || data.page || page,
            pageSize: data.pageSize || data.size || size,
            totalElements: data.totalElements || data.total || 0,
            totalPages: data.totalPages || Math.ceil((data.totalElements || 0) / size),
            hasNext: data.hasNext || (page + 1) * size < (data.totalElements || 0),
            hasPrevious: data.hasPrevious || page > 0,
        };
    }

    /**
     * 根据slug获取单个产品详情
     */
    async getProductBySlug(slug: string): Promise<ProductResponse> {
        const url = `/api/V1/product?slug=${encodeURIComponent(slug)}`;

        // 拿到 FrontApiResponse，不管 success
        const result = await callBackendGet<ProductResponse>(url, {
            requiresAuth: true
        });
        // console.log('getProductBySlug result:', result.data)

        // 直接返回 data
        return result.data.data!;
    }

    /**
     * 获取英雄产品列表（首页推荐）
     */
    async getHeroProducts(): Promise<ProductResponse[]> {
        const url = `/api/V1/product/hero`;

        // 拿到 FrontApiResponse，不管 success
        const result = await callBackendGet<any>(url, {
            requiresAuth: false
        });

        const data = result.data || result.data?.data || result.data?.content || result.data?.data?.content;

        if (Array.isArray(data)) {
            return data;
        } else if (Array.isArray(result.data)) {
            return result.data;
        }

        return [];
    }
}

export const productServiceServer = new ProductServiceServer();