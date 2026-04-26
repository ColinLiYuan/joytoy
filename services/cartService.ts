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
        sortBy?: string;
    } = {}): Promise<{ content: CartResponse[]; totalPages: number; totalElements: number }> {
        try {
            const {
                page = 0,
                size = 20,
                status = '',
                userId,
                sortBy = 'createdAt'
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            queryParams.append('sortBy', sortBy);

            if (status) queryParams.append('status', status);
            if (userId) queryParams.append('userId', userId.toString());

            const url = `/api/admin/V1/cart/list?${queryParams.toString()}`;
            
            console.log('[CartService] Fetching admin cart list:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart list');
        } catch (error) {
            console.error('Error fetching admin cart list:', error);
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