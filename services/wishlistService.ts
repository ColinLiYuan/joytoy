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
            console.log('[WishlistService] Calling getWishlist...')
            const response = await axiosClient.get('/api/V1/wishlist')
            console.log('[WishlistService] Full response:', JSON.stringify(response.data, null, 2))
            
            if (response.data?.success) {
                console.log('[WishlistService] Data array:', response.data.data)
                console.log('[WishlistService] First item:', response.data.data?.[0])
                console.log('[WishlistService] First item keys:', response.data.data?.[0] ? Object.keys(response.data.data[0]) : 'empty')
                console.log('[WishlistService] Success! Items count:', response.data.data?.length)
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
                console.log('[WishlistService] Auth error detected')
                return null
            }
                
            throw new Error(response.data?.message || 'Failed to fetch wishlist')
        } catch (error: any) {
            // 401 或其他认证错误
            if (error.response?.status === 401) {
                console.log('[WishlistService] 401 error')
                return null
            }
            console.error('❌ Get wishlist failed:', error)
            throw error
        }
    }
}

export const wishlistService = new WishlistService();
