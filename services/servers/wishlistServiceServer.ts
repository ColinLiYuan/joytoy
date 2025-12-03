// services/servers/wishlistServiceServer.ts
import { WishlistResponse } from '@/types/wishlist';
import { callBackendGet } from '@/lib/backend-utils';

class WishlistServiceServer {
    /**
     * 获取用户心愿单列表
     */
    async getWishlist(): Promise<WishlistResponse[]> {
        try {
            const url = `/api/V1/wishlist`;

            // 使用 callBackendGet，它会处理认证和错误
            const result = await callBackendGet<WishlistResponse[]>(url, {
                requiresAuth: true
            });

            // 返回数据，类似 product-service-server 的模式
            return result.data?.data || result.data || [];
        } catch (error) {
            console.error('❌ Get wishlist failed:', error);
            throw error;
        }
    }

}

export const wishlistServiceServer = new WishlistServiceServer();