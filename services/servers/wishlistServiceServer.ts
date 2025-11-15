// services/servers/wishlistServiceServer.ts
import { WishlistResponse } from '@/types/wishlist';
import { SERVER_CONFIG } from '@/lib/api-config';
import { getServerUserId } from '@/lib/cookie-utils';

const API_BASE_URL = '/api';

class WishlistServiceServer {

    async getWishlist(): Promise<WishlistResponse[]> {
        try {

            const userId = await getServerUserId();
            const queryParams = new URLSearchParams({
                userId: userId? userId.toString() : ''
            });

            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.wishlist}/list?${queryParams}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to fetch wishlist: ${response.status}`);
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to get wishlist');
            }

            const wishlistItems = apiResponse.data || [];
            // console.log('getWishlist service wishlistItems:', wishlistItems)

            return wishlistItems;

        } catch (error) {
            console.error('❌ Get wishlist failed:', error);
            throw error;
        }
    }

    /**
     * 清空心愿单
     */
    async clearWishlist(): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
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

export const wishlistServiceServer = new WishlistServiceServer();