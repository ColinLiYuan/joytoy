// types/api.ts

// 这里和后端不对应，会再包一层。
export interface FrontApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    code?: number;
    timestamp?: string;
}


// 分页响应类型
export interface PaginatedResponse<T> extends FrontApiResponse<T[]> {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}