// services/product-service.ts

import axiosClient from '@/lib/axios-client';
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
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (category) {
                queryParams.append('category', category);
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

            const url = `/api/admin/V1/product/list?${queryParams.toString()}`;
            console.log('[ProductService] Fetching admin products from:', url);
            
            const response = await axiosClient.get(url);
            console.log('[ProductService] Admin products response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch products');
        } catch (error) {
            console.error('❌ [ProductService] Error fetching products:', error);
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
        try {
            const url = `/api/admin/V1/product/${id}`;
            console.log('[ProductService] Fetching product by ID:', url);
            
            const response = await axiosClient.get(url);
            console.log('[ProductService] Product detail response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch product');
        } catch (error) {
            console.error('❌ [ProductService] Get product failed:', error);
            throw error;
        }
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
        if (!slug) return [];

        try {
            const url = `/api/product/related?slug=${encodeURIComponent(slug)}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error('Failed to fetch related products:', response.status);
                return [];
            }

            const result = await response.json();
            return result || [];
        } catch (error) {
            console.error('Error fetching related products:', error);
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

            const url = `/api/V1/product/list?${queryParams.toString()}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                const data = response.data.data;
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

            throw new Error(response.data?.message || 'Failed to fetch products');
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
            const url = `/api/V1/product/list?maxPrice=25&size=${limit}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data.content || [];
            }

            return [];
        } catch (error) {
            console.error("Failed to fetch add-ons", error);
            return [];
        }
    }
}

export const productService = new ProductService();