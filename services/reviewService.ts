// services/reviewService.ts
import { ReviewCreateRequest, ReviewListResponse, ReviewAuditRequest } from '@/types/review';
import { ADMIN_CONFIG, SERVER_CONFIG, ReviewStatus } from '@/lib/api-config';

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

    async getAdminReviews(page: number = 0, size: number = 10, status?: ReviewStatus): Promise<ReviewListResponse> {
        // 构建 URL，例如 /api/admin/review/list?page=0&size=10&status=PENDING
        let url = `${ADMIN_CONFIG.apiRoutes.review}/list?page=${page}&size=${size}`;
        if (status) {
            url += `&status=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 如果需要 Authorization header，请在这里添加
            },
            credentials: 'include', // 携带 Admin Cookie/Session
            cache: 'no-store' // 后台数据不缓存
        });

        if (!response.ok) {
            throw new Error('Failed to fetch admin reviews');
        }

        const apiResponse = await response.json();
        // 假设后端返回结构是 { success: true, data: { ... } }
        return apiResponse.data || apiResponse;
    }

    /**
     * ✅ 新增：审核评论
     */
    async auditReview(request: ReviewAuditRequest): Promise<boolean> {
        const url = `${ADMIN_CONFIG.apiRoutes.review}/audit`;

        const response = await fetch(url, {
            method: 'POST', // 或 PUT，取决于后端定义
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            credentials: 'include',
        });

        const apiResponse = await response.json();

        if (!apiResponse.success && !response.ok) {
            throw new Error(apiResponse.message || 'Audit failed');
        }

        return true;
    }
}

export const reviewService = new ReviewService();