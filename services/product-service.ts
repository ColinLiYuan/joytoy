// services/product-service.ts

import { ProductListResponse } from '@/types/product';
import { ADMIN_CONFIG, SERVER_CONFIG } from '@/lib/api-config';
import {AdminProductResponse, ReleaseProductRequest} from "@/types/admin/adminProduct";
import {ProductResponse} from "@/types/product";
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
            // 构建查询参数
            const queryParams = new URLSearchParams();

            // 添加所有参数，包括 category
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

            // 构建完整 URL - 走 Next.js API Route
            const url = `${SERVER_CONFIG.baseURL}/api/admin/product/list?${queryParams.toString()}`;

            // console.log('Fetching products from URL:', url); // 添加调试日志

            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const apiResponse = await response.json();

            // console.log('API Response:', apiResponse);

            if (!apiResponse.success) {
                throw new Error(apiResponse.error || 'Failed to fetch products');
            }

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

    async adminRelease(request: ReleaseProductRequest): Promise<ProductListResponse> {
        try {
            // console.log('product release: ', request)

            const url = `${SERVER_CONFIG.baseURL}/api/admin/product/release`;
            
            const token = await getToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to release product: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;

        } catch (error) {
            console.error('product release:', error);
            throw error;
        }
    }

    async adminGetById(id: string): Promise<AdminProductResponse> {
        try {
            const url = `${SERVER_CONFIG.baseURL}/api/admin/product/fetch?id=${id}`;

            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            const apiResponse = await response.json();

            const productResponse: AdminProductResponse = apiResponse.data;

            return productResponse;
        } catch (error) {
            console.error('Get product by slug failed:', error);
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

            // ✅ 走 Next.js 上传路由
            const url = `${SERVER_CONFIG.baseURL}/api/admin/product/upload`;
            
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

            // 使用 SERVER_CONFIG (前台API) 而不是 ADMIN_CONFIG
            const url = `${SERVER_CONFIG.apiRoutes.product}/list?${queryParams.toString()}`;

            // console.log('Search products url:', url);

            const response = await fetch(url, {
                cache: 'no-store', // 搜索结果通常不缓存，或者使用短缓存
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                return this.getEmptyList(page, size);
            }

            const apiResponse = await response.json();

            // 兼容 apiResult 结构
            const data = apiResponse.data || apiResponse;

            if (!data || (!data.content && !Array.isArray(data))) {
                return this.getEmptyList(page, size);
            }

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
        const url = `${SERVER_CONFIG.apiRoutes.product}/list?maxPrice=25&size=${limit}`;
        // console.log('product service getAddOnProducts url: ', url)
        try {
            const response = await fetch(url, {
                next: { revalidate: 36000 } // 缓存10小时
            });

            if (!response.ok) return [];

            const json = await response.json();
            return json.data?.content || [];
        } catch (error) {
            console.error("Failed to fetch add-ons", error);
            return [];
        }
    }
}

export const productService = new ProductService();