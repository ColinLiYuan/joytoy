// services/servers/product-service-server.ts
import { ProductResponse } from '@/types/product';
import { FrontApiResponse } from '@/types/api';
import { SERVER_CONFIG } from '@/lib/api-config';
import { getServerUserId } from '@/lib/cookie-utils';

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
    ): Promise<ProductListResponse> {
        try {
            const userId = await getServerUserId();
            // console.log('product service getProductsByCategory userId: ', userId)
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                userId: userId? userId.toString() : '',
                category: slug ? slug : '',
                sortBy: filters?.sortBy || 'createdAt',
                sortDirection: filters?.sortDirection || 'DESC'
            });

            // 添加筛选参数
            if (filters) {
                if (filters.priceRange && filters.priceRange.length > 0) {
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

            // console.log('🔄 productService getProductsByCategory - 请求参数:', {
            //     slug,
            //     page,
            //     size,
            //     filters,
            //     queryParams: queryParams.toString()
            // });
            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.product}/list?${queryParams}`;
            // console.log('getProductsByCategory url:', url)
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            // console.log('productService response ' + response.ok)
            const apiResponse = await response.json();

            // console.log('✅ productService - API响应:', {
            //     success: apiResponse.success,
            //     data结构: apiResponse.data ? {
            //         content长度: apiResponse.data.content?.length,
            //         currentPage: apiResponse.data.currentPage,
            //         totalPages: apiResponse.data.totalPages,
            //         totalElements: apiResponse.data.totalElements
            //     } : '无数据'
            // });

            if (!apiResponse.success) {
                throw new Error(apiResponse.error || 'Failed to fetch products');
            }

            // console.log('productService apiResponse ' + apiResponse.success)
            // 返回完整的分页响应
            return apiResponse.data || {
                content: [],
                currentPage: page,
                pageSize: size,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    /**
     * 根据slug获取单个产品详情
     */
    async getProductBySlug(slug: string): Promise<ProductResponse> {
        try {
            const userId = await getServerUserId();
            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.product}/detail?slug=${encodeURIComponent(slug)}`;

            // console.log('getProductBySlug url:', url);

            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch product by slug');
            }
            const apiResponse: FrontApiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Get product by slug failed');
            }

            const productResponse: ProductResponse = apiResponse.data;

            return productResponse;
        } catch (error) {
            console.error('Get product by slug failed:', error);
            throw error;
        }
    }

    /**
     * 获取英雄产品列表（首页推荐）
     */
    async getHeroProducts(): Promise<ProductResponse[]> {
        try {
            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.product}/hero`;
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to fetch hero products`);
            }

            // console.log("getHeroProducts response " + response.ok);

            const apiResponse: FrontApiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to get products');
            }

            // console.log("getHeroProducts apiResponse " + apiResponse.success);
            return Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data];
        } catch (error) {
            console.error('Get hero products failed:', error);
            throw error;
        }
    }
}

export const productServiceServer = new ProductServiceServer();