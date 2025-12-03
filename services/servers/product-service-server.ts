// services/servers/product-service-server.ts
import { ProductResponse } from '@/types/product';
import { getServerUserId } from '@/lib/cookie-utils';
import { callBackendGet } from '@/lib/backend-utils';
import { FrontApiResponse } from '@/types/api';

interface ProductListResponse {
    content: ProductResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

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
    ): Promise<FrontApiResponse<ProductListResponse>> {
        try {
            const userId = await getServerUserId();

            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                userId: userId ? userId.toString() : '',
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

            // 使用 callBackendGet，需要认证
            const result = await callBackendGet<any>(url, {
                requiresAuth: true,
                defaultErrorMessage: '获取产品列表失败，请稍后重试'
            });

            // 如果失败，直接返回错误
            if (!result.success) {
                return result;
            }

            const data = result.data.data;
            console.log('data: ', data)

            // 格式化数据
            const formattedData: ProductListResponse = {
                content: Array.isArray(data.content) ? data.content : [],
                currentPage: data.currentPage || data.page || page,
                pageSize: data.pageSize || data.size || size,
                totalElements: data.totalElements || data.total || 0,
                totalPages: data.totalPages || Math.ceil((data.totalElements || 0) / size),
                hasNext: data.hasNext || (page + 1) * size < (data.totalElements || 0),
                hasPrevious: data.hasPrevious || page > 0,
            };

            return formattedData;

        } catch (error) {
            // 这里是 service 层的意外异常
            console.error('Service layer error - getProductsByCategory:', error);
            return {
                success: false,
                error: '获取产品列表时发生意外错误',
                data: undefined
            };
        }
    }

    /**
     * 根据slug获取单个产品详情 - 公共接口
     */
    async getProductBySlug(slug: string): Promise<FrontApiResponse<ProductResponse>> {
        try {
            const url = `/api/V1/product?slug=${encodeURIComponent(slug)}`;

            // 公共接口，不需要认证
            return await callBackendGet<ProductResponse>(url, {
                requiresAuth: false,
                defaultErrorMessage: '获取产品详情失败'
            });

        } catch (error) {
            console.error('Service layer error - getProductBySlug:', error);
            return {
                success: false,
                error: '获取产品详情时发生意外错误',
                data: undefined
            };
        }
    }

    /**
     * 获取英雄产品列表（首页推荐）- 公共接口
     */
    async getHeroProducts(): Promise<FrontApiResponse<ProductResponse[]>> {
        try {
            const url = `/api/V1/product/hero`;

            // 公共接口，不需要认证
            const result = await callBackendGet<any>(url, {
                requiresAuth: false,
                defaultErrorMessage: '获取推荐产品失败'
            });

            // 如果失败，直接返回错误
            if (!result.success) {
                return result;
            }

            const data = result.data;

            // 处理不同的响应格式
            let products: ProductResponse[] = [];

            if (Array.isArray(data)) {
                products = data;
            } else if (data && Array.isArray(data.content)) {
                products = data.content;
            } else if (data && Array.isArray(data.data)) {
                products = data.data;
            }

            return {
                success: true,
                data: products
            };

        } catch (error) {
            console.error('Service layer error - getHeroProducts:', error);
            return {
                success: false,
                error: '获取推荐产品时发生意外错误',
                data: undefined
            };
        }
    }

}

export const productServiceServer = new ProductServiceServer();