// services/wishlistService.ts
import axiosClient from '@/lib/axios-client';
import { WishlistResponse } from '@/types/wishlist';

class WishlistService {

    /**
     * 获取用户心愿单（查询 - 使用 Axios 直连后端）
     * @returns 心愿单列表，如果 session 过期则返回 null
     */
    async getWishlist(): Promise<WishlistResponse[] | null> {
        try {
const response = await axiosClient.get('/api/V1/wishlist')
            if (response.data?.success) {
return response.data.data || []
            }
                
            // 检查是否是认证相关错误
            const errorMsg = response.data?.message?.toLowerCase() || ''
            if (errorMsg.includes('session') || 
                errorMsg.includes('login') || 
                errorMsg.includes('auth') || 
                errorMsg.includes('unauthorized') ||
                errorMsg.includes('登录') ||
                errorMsg.includes('expired')) {
return null
            }
                
            throw new Error(response.data?.message || 'Failed to fetch wishlist')
        } catch (error: any) {
            // 401 或其他认证错误
            if (error.response?.status === 401) {
return null
            }
            console.error('❌ Get wishlist failed:', error)
            throw error
        }
    }
}

export const wishlistService = new WishlistService();
