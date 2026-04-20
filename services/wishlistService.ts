// services/wishlistService.ts
import { WishlistRequest, WishlistResponse } from '@/types/wishlist';
import { SERVER_CONFIG } from '@/lib/api-config';

// 自定义认证错误类，用于静默处理
export class AuthRequiredError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthRequiredError';
    }
}

class WishlistService {

    /**
     * 获取用户心愿单
     * @returns 心愿单列表，如果 session 过期则返回 null
     */
    async getWishlist(): Promise<WishlistResponse[] | null> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.wishlist}/list`;
            const response = await fetch(url);

            const responseData = await response.json().catch(() => null);
            
            // 检查 HTTP 状态码和业务逻辑成功标志
            if (!response.ok || !responseData?.success) {
                const errorMessage = responseData?.message || `Failed to fetch wishlist: ${response.status}`;
                
                // 如果是认证错误，静默返回 null
                if (response.status === 401 || errorMessage.includes('未登录') || errorMessage.includes('Session expired')) {
                    return null;
                }
                
                console.error('[WishlistService] Failed to fetch wishlist:', errorMessage);
                throw new Error(errorMessage);
            }
            
            return responseData.data || [];
        } catch (error) {
            console.error('❌ Get wishlist failed:', error);
            throw error;
        }
    }

    /**
     * 添加商品到心愿单
     * @returns true 成功，false 需要登录
     */
    async addItemToWishlist(request: WishlistRequest): Promise<boolean> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.wishlist}/add`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            const responseData = await response.json().catch(() => null);
            
            // 检查 HTTP 状态码和业务逻辑成功标志
            if (!response.ok || !responseData?.success) {
                const errorMessage = responseData?.message || `Failed to add item to wishlist: ${response.status}`;
                
                // 如果是认证错误，静默返回 false，不抛出异常
                if (response.status === 401 || errorMessage.includes('未登录') || errorMessage.includes('Session expired')) {
                    return false;
                }
                
                console.error('[WishlistService] Failed to add item:', errorMessage);
                throw new Error(errorMessage);
            }
            
            return true;
        } catch (error) {
            console.error('Add item to wishlist failed:', error);
            throw error;
        }
    }

    /**
     * 从心愿单移除商品
     * @returns true 成功，false 需要登录
     */
    async removeItemFromWishlist(request: WishlistRequest): Promise<boolean> {
        try {
            const params = new URLSearchParams({
                productId: request.productId.toString()
            });
            const url = `${SERVER_CONFIG.apiRoutes.wishlist}/remove?${params.toString()}`;
            
            const response = await fetch(url, {
                method: 'DELETE',
            });
            
            const responseData = await response.json().catch(() => null);
            
            // 检查 HTTP 状态码和业务逻辑成功标志
            if (!response.ok || !responseData?.success) {
                const errorMessage = responseData?.message || 'Failed to remove item from wishlist';
                
                // 如果是认证错误，静默返回 false，不抛出异常
                if (response.status === 401 || errorMessage.includes('未登录') || errorMessage.includes('Session expired')) {
                    return false;
                }
                
                console.error('[WishlistService] Failed to remove item:', errorMessage);
                throw new Error(errorMessage);
            }
            
            return true;
        } catch (error) {
            console.error('Remove item from wishlist failed:', error);
            throw error;
        }
    }
}

export const wishlistService = new WishlistService();
