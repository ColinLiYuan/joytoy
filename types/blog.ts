// types/blog.ts

export enum BlogStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
}

export interface ReleaseBlogRequest {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    summary: string;
    author: string;
    status: BlogStatus;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likeCount: number;
    tags: string[];
    coverImage?: string;
    slug: string;
}

export interface AdminBlogResponse {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    summary: string;
    author: string;
    status: BlogStatus;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likeCount: number;
    tags: string[];
    coverImage?: string;
    slug: string;
    topic?: string;
    rating?: number;
}

export interface AdminBlogListResponse {
    content: AdminBlogResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
