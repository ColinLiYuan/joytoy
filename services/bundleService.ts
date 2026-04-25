// services/bundleService.ts
import axiosClient from '@/lib/axios-client';
import { ProductBundle, BundleListResponse } from '@/types/bundle';
import { BACKEND_CONFIG } from '@/lib/api-config';

class BundleService {
    /**
     * 获取套装列表（管理端）
     */
    async adminList(page: number = 0, size: number = 20): Promise<BundleListResponse> {
        try {
            const url = `/api/admin/V1/bundles?page=${page}&size=${size}`;
            console.log('[BundleService] Fetching admin bundles:', url);
            
            const response = await axiosClient.get(url);
            console.log('[BundleService] Admin bundles response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch bundles');
        } catch (error) {
            console.error('❌ [BundleService] Error fetching bundles:', error);
            throw error;
        }
    }

    /**
     * 获取套装详情（管理端）
     */
    async adminGetById(id: number): Promise<ProductBundle> {
        try {
            const url = `/api/admin/V1/bundles/${id}`;
            console.log('[BundleService] Fetching bundle by ID:', url);
            
            const response = await axiosClient.get(url);
            console.log('[BundleService] Bundle detail response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch bundle');
        } catch (error) {
            console.error('❌ [BundleService] Get bundle failed:', error);
            throw error;
        }
    }

    /**
     * 创建套装
     */
    async create(bundle: Omit<ProductBundle, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductBundle> {
        try {
            const url = `/api/admin/V1/bundles`;
            console.log('[BundleService] Creating bundle:', url);
            
            const response = await axiosClient.post(url, bundle);
            console.log('[BundleService] Create bundle response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to create bundle');
        } catch (error) {
            console.error('❌ [BundleService] Create bundle failed:', error);
            throw error;
        }
    }

    /**
     * 更新套装
     */
    async update(id: number, bundle: Partial<ProductBundle>): Promise<ProductBundle> {
        try {
            const url = `/api/admin/V1/bundles/${id}`;
            console.log('[BundleService] Updating bundle:', url);
            
            const response = await axiosClient.put(url, bundle);
            console.log('[BundleService] Update bundle response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to update bundle');
        } catch (error) {
            console.error('❌ [BundleService] Update bundle failed:', error);
            throw error;
        }
    }

    /**
     * 删除套装
     */
    async delete(id: number): Promise<void> {
        try {
            const url = `/api/admin/V1/bundles/${id}`;
            console.log('[BundleService] Deleting bundle:', url);
            
            const response = await axiosClient.delete(url);
            console.log('[BundleService] Delete bundle response:', response.data);

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to delete bundle');
            }
        } catch (error) {
            console.error('❌ [BundleService] Delete bundle failed:', error);
            throw error;
        }
    }

    /**
     * 获取套装列表（用户端）
     */
    async getBundles(page: number = 0, size: number = 12): Promise<BundleListResponse> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}/api/site/bundles?page=${page}&size=${size}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch bundles');
        } catch (error) {
            console.error('❌ [BundleService] Error fetching bundles:', error);
            throw error;
        }
    }

    /**
     * 获取套装详情（用户端）
     */
    async getBySlug(slug: string): Promise<ProductBundle> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}/api/site/bundles/${slug}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch bundle');
        } catch (error) {
            console.error('❌ [BundleService] Get bundle failed:', error);
            throw error;
        }
    }

    /**
     * 获取推荐套装
     */
    async getFeaturedBundles(): Promise<ProductBundle[]> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}/api/site/bundles/featured`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch featured bundles');
        } catch (error) {
            console.error('❌ [BundleService] Get featured bundles failed:', error);
            throw error;
        }
    }

    /**
     * 将套装添加到购物车
     * 后端逻辑：套装作为整体加入，返回单个 CartItem（带 bundleId 标记）
     */
    async addToCart(bundleId: number, quantity: number = 1, cartId: number): Promise<any> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}/api/site/bundles/${bundleId}/add-to-cart`;
            const response = await axiosClient.post(url, null, {
                params: { quantity, cartId }
            });

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to add bundle to cart');
        } catch (error) {
            console.error('❌ [BundleService] Add bundle to cart failed:', error);
            throw error;
        }
    }

    /**
     * 根据商品ID推荐套装
     * 调用后端 /api/site/bundles/suggest?productIds=1,2,3
     */
    async getSuggestBundles(productIds: number[]): Promise<ProductBundle[]> {
        try {
            const ids = productIds.join(',');
            const url = `${BACKEND_CONFIG.baseURL}/api/site/bundles/suggest?productIds=${ids}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data || [];
            }

            throw new Error(response.data?.message || 'Failed to fetch bundle suggestions');
        } catch (error) {
            console.error('❌ [BundleService] Get bundle suggestions failed:', error);
            return [];
        }
    }
}

export const bundleService = new BundleService();
