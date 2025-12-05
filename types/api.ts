// types/api.ts

// 这里和后端不对应，会再包一层。
// export interface FrontApiResponse<T = any> {
//     success: boolean;
//     message?: string;
//     data?: BackendApiResponse<T>;
//     error?: string;
//     code?: number;
//     timestamp?: string;
// }

/**
 * 后端API响应格式
 * 这个被包裹在 FrontApiResponse.data 里
 */
export interface BackendApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errorCode?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> extends BackendApiResponse<T[]> {
    page: number;
    size: number;
    total: number;
    totalPages: number;
}