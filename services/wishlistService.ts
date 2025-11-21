// services/wishlistService.ts
import { WishlistRequest } from '@/types/wishlist';
import { SERVER_CONFIG } from '@/lib/api-config';

class WishlistService {

    /**
     * 添加商品到心愿单
     */
    async addItemToWishlist(request: WishlistRequest): Promise<void> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.wishlist}/add`;
            // console.log('addItemToWishlist service request:', request)
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to add item to wishlist: ${response.status}`);
            }

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to add item to wishlist');
            }

        } catch (error) {
            console.error('❌ Add item to wishlist failed:', error);
            throw error;
        }
    }

    /**
     * 从心愿单移除商品
     */
    async removeItemFromWishlist(request: WishlistRequest): Promise<void> {
        try {
            const params = new URLSearchParams({
                userId: request.userId.toString(), // 转换为字符串
                productId: request.productId.toString() // 转换为字符串
            });
            const url = `${SERVER_CONFIG.apiRoutes.wishlist}/remove?${params.toString()}`;
            // console.log('removeItemFromWishlist url： ' + url);
            const response = await fetch(url, {
                method: 'DELETE',
            });


            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to remove item from wishlist');
            }

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to remove item from wishlist');
            }

        } catch (error) {
            console.error('❌ Remove item from wishlist failed:', error);
            throw error;
        }
    }

    /**
     * 清空心愿单
     */
    async clearWishlist(): Promise<void> {
        try {
            const response = await fetch(`${SERVER_CONFIG.apiRoutes.wishlist}/wishlist/clear`, {
                method: 'DELETE',
            });

            // console.log('after clear wishlist ' + response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to clear wishlist');
            }

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to clear wishlist');
            }

        } catch (error) {
            console.error('❌ Clear wishlist failed:', error);
            throw error;
        }
    }

}

export const wishlistService = new WishlistService();