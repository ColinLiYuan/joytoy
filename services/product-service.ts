// services/product-service.ts

import { ProductListResponse } from '@/types/product';
import { ADMIN_CONFIG, SERVER_CONFIG } from '@/lib/api-config';
import {AdminProductResponse, ReleaseProductRequest} from "@/types/admin/adminProduct";
import {ProductResponse} from "@/types/product";

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

            // 构建完整 URL
            const url = `${ADMIN_CONFIG.apiRoutes.product}/list?${queryParams.toString()}`;

            // console.log('Fetching products from URL:', url); // 添加调试日志

            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
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

            const url = `${ADMIN_CONFIG.apiRoutes.product}/release`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const url = `${ADMIN_CONFIG.apiRoutes.product}/fetch?id=${id}`;

            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
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
            // console.log('service uploadImage')

            // 提取slug的最后部分
            const finalSlug = this.extractFinalSlug(slug);
            if (!finalSlug) {
                throw new Error('slug格式不正确');
            }

            // 生成文件名
            const fileExtension = this.getFileExtension(file.name);
            let fileName: string;

            if (type === 'main') {
                fileName = `${finalSlug}${fileExtension}`;
            } else if (type === 'gallery') {
                if (index === undefined) {
                    throw new Error('相册图片需要指定index参数');
                }
                fileName = `${finalSlug}-${index}${fileExtension}`;
            } else {
                throw new Error('type参数必须是main或gallery');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('slug', finalSlug);
            formData.append('fileName', fileName); // 传递生成好的文件名
            if (index !== undefined) {
                formData.append('index', index.toString());
            }

            // console.log('上传参数:', {
            //     type,
            //     finalSlug,
            //     fileName,
            //     index,
            //     originalName: file.name
            // });

            const url = `${ADMIN_CONFIG.apiRoutes.product}/upload`;
            const response = await fetch(url, {
                method: 'POST',
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
        console.log('uploadMainImage:', slug)
        return this.uploadImage(file, 'main', slug);
    }

    async uploadGalleryImage(file: File, slug: string, index: number): Promise<UploadResult> {
        return this.uploadImage(file, 'gallery', slug, index);
    }

    // 提取slug的最后部分
    private extractFinalSlug(slug: string): string {
        if (!slug) return '';

        // 移除开头和结尾的斜杠
        const cleanedSlug = slug.trim().replace(/^\/+|\/+$/g, '');

        // 按斜杠分割并取最后一部分
        const parts = cleanedSlug.split('/');
        return parts[parts.length - 1] || cleanedSlug;
    }

    // 获取文件扩展名
    private getFileExtension(filename: string): string {
        if (!filename || filename.lastIndexOf('.') === -1) {
            return '.jpg';
        }
        return filename.slice(filename.lastIndexOf('.'));
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

    /**
     * 获取凑单商品 (Add-ons)
     * 通常是价格低于 $25 的小商品
     */
    async getAddOnProducts(limit: number = 8): Promise<ProductResponse[]> {
        const url = `${SERVER_CONFIG.apiRoutes.product}/list?maxPrice=25&size=${limit}`;
        // console.log('product service getAddOnProducts url: ', url)
        try {
            const response = await fetch(url, {
                next: { revalidate: 3600 } // 缓存1小时
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