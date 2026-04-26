// services/reviewService.ts
import axiosClient from '@/lib/axios-client'
import { ReviewListResponse } from '@/types/review'
import { BACKEND_API_ROUTES } from '@/lib/api-config'

class ReviewService {

    /**
     * 获取产品评论列表（查询 - 使用 Axios 直连后端）
     */
    async getReviews(productId: number, page: number = 0, size: number = 5): Promise<ReviewListResponse> {
        try {
            const url = `${BACKEND_API_ROUTES.review.list}/${productId}?page=${page}&size=${size}`
            console.log('[ReviewService] Fetching reviews from:', url)
            const response = await axiosClient.get(url)
            console.log('[ReviewService] Response:', response.data)
            
            if (response.data?.success) {
                return response.data.data
            }
            
            throw new Error(response.data?.message || 'Failed to fetch reviews')
        } catch (error: any) {
            console.error('❌ Get reviews failed:', error)
            console.error('❌ Error response:', error.response?.data)
            console.error('❌ Error status:', error.response?.status)
            throw error
        }
    }
}

export const reviewService = new ReviewService();