// services/cartService.ts
import axiosClient from '@/lib/axios-client';
import { CartResponse } from '@/types/cart';

export type { CartResponse }; // 重新导出 CartResponse

export interface CartItem {
    id: number;
    productId: number;
    productTitle: string;
    productName: string;
    productSku: string;
    skuId: number;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    color: string;
    size: string;
    material: string;
    weight: string;
}

export interface CartStatistics {
    totalCarts: number;
    activeCarts: number;
    convertedCarts: number;
    abandonedCarts: number;
    totalItems: number;
    avgItemsPerCart: number;
}

class CartService {
    /**
     * 获取用户购物车（查询 - 使用 Axios 直连后端）
     */
    async getCart(): Promise<CartResponse> {
        try {
            const response = await axiosClient.get('/api/V1/cart');

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart');
        } catch (error) {
            console.error('❌ Get cart failed:', error);
            throw error;
        }
    }

    // ✅ 管理员获取购物车列表
    async adminList(params: {
        page?: number;
        size?: number;
        status?: string;
        userId?: number;
        isGuest?: boolean;
        sortBy?: string;
    } = {}): Promise<{ content: CartResponse[]; totalPages: number; totalElements: number }> {
        try {
            const {
                page = 0,
                size = 20,
                status = '',
                userId,
                isGuest,
                sortBy = 'createdAt'
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            queryParams.append('sortBy', sortBy);

            if (status) queryParams.append('status', status);
            if (userId) queryParams.append('userId', userId.toString());
            if (isGuest !== undefined) queryParams.append('isGuest', isGuest.toString());

            const url = `/api/admin/V1/cart/list?page=${page}&size=${size}&sortBy=${sortBy}${status ? `&status=${status}` : ''}${userId ? `&userId=${userId}` : ''}${isGuest !== undefined ? `&isGuest=${isGuest}` : ''}`;
            
            console.log('[CartService] Fetching admin cart list:', url);
            
            // 添加时间戳参数，避免浏览器缓存
            const cacheBusterUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
            const response = await axiosClient.get(cacheBusterUrl);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart list');
        } catch (error: any) {
            console.error('❌ [CartService] Error fetching admin cart list:', error);
            
            // 提供更详细的错误信息
            if (error.response) {
                console.error('[CartService] Error response status:', error.response.status);
                console.error('[CartService] Error response data:', error.response.data);
                
                // 如果是 401，提示用户重新登录
                if (error.response.status === 401) {
                    throw new Error('认证失败，请重新登录');
                }
                
                // 如果是 500，提示服务器错误
                if (error.response.status === 500) {
                    throw new Error('服务器内部错误，请稍后重试');
                }
            } else if (error.request) {
                console.error('[CartService] No response received:', error.request);
                throw new Error('无法连接到服务器，请检查网络连接');
            } else {
                console.error('[CartService] Error setting up request:', error.message);
            }
            
            throw error;
        }
    }

    // ✅ 管理员获取购物车详情
    async getAdminCartDetail(cartId: number): Promise<CartResponse> {
        const url = `/api/admin/V1/cart/${cartId}`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Failed to fetch cart detail');
    }

    // ✅ 管理员获取购物车统计
    async getAdminCartStatistics(): Promise<CartStatistics> {
        const url = `/api/admin/V1/cart/statistics`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Failed to fetch cart statistics');
    }
}

export const cartService = new CartService();