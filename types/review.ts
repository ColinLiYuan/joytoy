// types/review.ts

export interface ReviewCreateRequest {
    productId: number;
    authorName: string; // 显示的昵称 (用户自己填的，如 "Secret Fan")
    email?: string;     // ✅ 新增：如果是游客，必须填邮箱用于验证身份
    rating: number;
    title: string;
    content: string;
}

export interface Review {
    id: string;
    productId: string;
    authorName: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    isVerified: boolean;
    helpfulCount: number;
}

export interface ReviewListResponse {
    content: Review[];
    totalPages: number;
    totalElements: number;
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