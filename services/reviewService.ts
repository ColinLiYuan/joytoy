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
const response = await axiosClient.get(url)
            if (response.data?.success) {
                return response.data.data
            }
            
            throw new Error(response.data?.message || 'Failed to fetch reviews')
        } catch (error: any) {
            console.error('❌ Get reviews failed:', error)
            // 区分 HTTP 错误和网络错误
            if (error.response) {
                // HTTP 错误（后端返回了错误响应）
                console.error('❌ HTTP Error - Status:', error.response.status)
                console.error('❌ HTTP Error - Data:', error.response.data)
            } else if (error.request) {
                // 网络错误（请求发出去了，但没收到响应）
                console.error('❌ Network Error - Message:', error.message)
                console.error('❌ Network Error - Request:', error.request)
            } else {
                // 其他错误（请求配置阶段出错）
                console.error('❌ Setup Error - Message:', error.message)
            }
            throw error
        }
    }
}

export const reviewService = new ReviewService();