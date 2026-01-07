// types/review.ts
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewCreateRequest {
    productId: number;
    authorName: string; // 显示的昵称 (用户自己填的，如 "Secret Fan")
    email?: string;     // ✅ 新增：如果是游客，必须填邮箱用于验证身份
    rating: number;
    title: string;
    content: string;
}

export interface Review {
    id: number; // 或者是 number，取决于你的数据库
    productId: number;
    productName?: string; // ✅ 新增：后台列表最好能显示是哪个商品的评论
    authorName: string;
    email?: string;       // ✅ 新增：后台可能需要看到邮箱
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    isVerified: boolean;
    helpfulCount: number;
    status: ReviewStatus; // ✅ 新增：状态字段
}

export interface ReviewListResponse {
    content: Review[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    stats?: ReviewStats;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

export interface ReviewAuditRequest {
    reviewId: number;
    status: 'APPROVED' | 'REJECTED';
}