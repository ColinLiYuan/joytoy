// services/reviewService.ts
import { ReviewCreateRequest, ReviewListResponse } from '@/types/review';
import { SERVER_CONFIG } from '@/lib/api-config';

class ReviewService {

    async createReview(reviewCreateRequest: ReviewCreateRequest): Promise<boolean> {
        const url = `${SERVER_CONFIG.apiRoutes.review}/add`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewCreateRequest),
            credentials: 'include', // 允许携带 Cookie (针对已登录用户)
        });

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Review submission failed');
        }

        return true;
    }

    // ✅ 修改：必须传入 productId
    async getReviews(productId: number, page: number = 0, size: number = 5): Promise<ReviewListResponse> {
        // 假设后端接口支持 ?productId=xxx
        const url = `${SERVER_CONFIG.apiRoutes.review}/list?productId=${productId}&page=${page}&size=${size}`;

        const response = await fetch(url, {
            // GET 请求通常不需要 credentials，除非是获取“我的评论”
            // 但为了兼容性可以加上
            credentials: 'include',
            next: { revalidate: 60 } // Next.js 缓存 60秒
        });

        const apiResponse = await response.json();

        // 确保返回的数据结构符合前端预期
        // 如果后端 data 直接是数组，这里可能需要适配一下
        return apiResponse.data;
    }
}

export const reviewService = new ReviewService();