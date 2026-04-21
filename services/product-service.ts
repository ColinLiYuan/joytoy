// services/product-service.ts

import { ProductListResponse } from '@/types/product';
import { ADMIN_CONFIG, SERVER_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';
import {AdminProductResponse, ReleaseProductRequest} from "@/types/admin/adminProduct";
import {ProductResponse} from "@/types/product";
import { apiGet, apiPost } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export interface UploadResult {
    url: string;
    fileName: string;
    originalName: string;
    size: number;
    finalSlug: string;
}

class ProductService {

    async adminList(
        category: string,
        page: number = 0,
        size: number = 12,
        keyword: string = '',
        status: string = '',
        vendor: string = ''
    ): Promise<ProductListResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (category) {
                queryParams.append('category', category);
            }
            if (page !== undefined) {
                queryParams.append('page', page.toString());
            }
            if (size !== undefined) {
                queryParams.append('size', size.toString());
            }
            if (keyword) {
                queryParams.append('keyword', keyword);
            }
            if (status) {
                queryParams.append('status', status);
            }
            if (vendor) {
                queryParams.append('vendor', vendor);
            }

            const result = await apiGet<ProductListResponse>(`${BACKEND_CONFIG.baseURL}/api/admin/product/list?${queryParams.toString()}`);

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch products');
            }

            return result.data || {
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

    async adminRelease(request: ReleaseProductRequest): Promise<ProductListResponse> {
        const result = await apiPost<ProductListResponse>(`${BACKEND_CONFIG.baseURL}/api/admin/product/release`, request);

        if (!result.success) {
            throw new Error(result.message || `Failed to release product`);
        }

        return result.data;
    }

    async adminGetById(id: string): Promise<AdminProductResponse> {
        const result = await apiGet<AdminProductResponse>(`${BACKEND_CONFIG.baseURL}/api/admin/product/fetch?id=${id}`);

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch product');
        }

        return result.data;
    }

    async uploadImage(
        file: File,
        type: 'main' | 'gallery',
        slug: string,
        index?: number
    ): Promise<UploadResult> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('slug', slug);
            formData.append('fileName', file.name);
            if (index !== undefined) {
                formData.append('index', index.toString());
            }

            // 文件上传需要特殊处理，继续使用原生 fetch
            const url = `${BACKEND_CONFIG.baseURL}/api/admin/product/upload`;
            const token = await getToken();
            
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `上传失败: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;

        } catch (error) {
            console.error('Upload image failed:', error);
            throw error;
        }
    }

    async uploadMainImage(file: File, slug: string): Promise<UploadResult> {
        return this.uploadImage(file, 'main', slug);
    }

    async uploadGalleryImage(file: File, slug: string, index: number): Promise<UploadResult> {
        return this.uploadImage(file, 'gallery', slug, index);
    }

    async getRelatedProducts(slug: string): Promise<ProductResponse[]> {
        // console.log('getRelatedProducts slug : ', slug)
        if (!slug) return [];

        try {
            const url = `${SERVER_CONFIG.apiRoutes.product}/related?slug=${encodeURIComponent(slug)}`;
            // console.log('getRelatedProducts url : ', url)
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 关联产品比较特殊，接口直接返回产品列表，而不是apiResult
            const result = await response.json();

            // console.log('getRelatedProducts result: ', result)

            return result || [];
        } catch (error) {
            console.error('Error in product service client:', error);
            return [];
        }
    }

    async searchProducts(
        keyword: string,
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
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                keyword: keyword || '',
                sortBy: filters?.sortBy || 'createdAt',
                sortDirection: filters?.sortDirection || 'DESC'
            });

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

            const result = await apiGet<ProductListResponse>(`${SERVER_CONFIG.apiRoutes.product}/list?${queryParams.toString()}`);

            if (!result.success || !result.data) {
                return this.getEmptyList(page, size);
            }

            const data = result.data;

            return {
                content: Array.isArray(data.content) ? data.content : [],
                currentPage: data.currentPage || data.page || page,
                pageSize: data.pageSize || data.size || size,
                totalElements: data.totalElements || data.total || 0,
                totalPages: data.totalPages || Math.ceil((data.totalElements || 0) / size),
                hasNext: data.hasNext || (page + 1) * size < (data.totalElements || 0),
                hasPrevious: data.hasPrevious || page > 0,
            };

        } catch (error) {
            console.error('Search products error:', error);
            return this.getEmptyList(page, size);
        }
    }

    /**
     * 辅助方法：返回空列表结构，防止页面报错
     */
    private getEmptyList(page: number, size: number): ProductListResponse {
        return {
            content: [],
            currentPage: page,
            pageSize: size,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
        };
    }

    /**
     * 获取凑单商品 (Add-ons)
     * 通常是价格低于 $25 的小商品
     */
    async getAddOnProducts(limit: number = 8): Promise<ProductResponse[]> {
        try {
            const result = await apiGet<ProductListResponse>(`${SERVER_CONFIG.apiRoutes.product}/list?maxPrice=25&size=${limit}`, {
                retry: 1
            });

            if (!result.success || !result.data) {
                return [];
            }

            return result.data.content || [];
        } catch (error) {
            console.error("Failed to fetch add-ons", error);
            return [];
        }
    }
}

export const productService = new ProductService();