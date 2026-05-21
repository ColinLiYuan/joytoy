// types/site/blog.ts


export interface BlogResponse {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    summary: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likeCount: number;
    tags: string[];
    coverImage?: string;
    slug: string;
    topic?: string;
}

export interface BlogListResponse {
    content: BlogResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}