// types/review.ts

export interface Review {
    id: string;
    productId: string;
    authorName: string; // 显示的昵称
    rating: number; // 1-5
    title: string; // 评论标题 (如 "Worth every penny")
    content: string; // 详细内容
    createdAt: string;
    isVerified: boolean; // 是否购买过
    helpfulCount: number; // 点赞数
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