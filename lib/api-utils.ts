// lib/api-utils.ts
import { BACKEND_CONFIG } from '@/lib/api-config';
import { ApiResponse, ApiErrorType } from '@/types/api';

interface RequestOptions extends RequestInit {
    timeout?: number;
    retry?: number;
}

class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any,
        public errorCode?: string,
        public errorType?: ApiErrorType
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Unified API request function
 */
export async function proxyRequest(
    endpoint: string,
    options: RequestOptions = {}
): Promise<Response> {
    const {
        timeout = BACKEND_CONFIG.timeout,
        retry = 0,
        headers,
        ...fetchOptions
    } = options;

    const url = `${BACKEND_CONFIG.baseURL}${endpoint}`;
    const requestHeaders = {
        ...BACKEND_CONFIG.defaultHeaders,
        ...headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: requestHeaders,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('proxyRequest caught error:', errorMessage);

        // Retry logic
        if (retry > 0 && shouldRetry(error)) {
            console.warn(`API call failed, retrying... ${retry} attempts left`);
            return proxyRequest(endpoint, {
                ...options,
                retry: retry - 1,
            });
        }

        // 网络异常，直接抛出
        throw new ApiError(
            0,
            errorMessage,
            undefined,
            undefined,
            'network'
        );
    }
}

/**
 * 判断错误类型
 */
function getErrorType(
    httpStatus: number,
    backendResponse: ApiResponse<any>
): ApiErrorType {
    // 1. HTTP 级别异常 (400, 401, 403, 404, 500, 502 等)
    if (httpStatus >= 400) {
        return 'http';
    }

    // 2. 后端返回 success: false，根据 errorCode 判断
    if (!backendResponse.success) {
        const errorCode = backendResponse.errorCode;
        if (errorCode && (errorCode.startsWith('C') || errorCode.startsWith('c'))) {
            return 'system_business'; // C 开头的需要统一处理
        }
        return 'custom_business'; // 其他业务错误留给调用者
    }

    // 正常情况不会走到这里
    return 'custom_business';
}

/**
 * 处理 API 响应，直接返回后端格式
 */
export async function handleApiResponse<T>(
    response: Response
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    try {
        // Clone response to check content
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        // 空响应体处理
        if (!responseText.trim()) {
            return {
                success: response.ok,
                message: response.ok ? undefined : 'Empty response body',
                status: response.status,
                errorType: 'http' as ApiErrorType
            };
        }

        let data: any;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return {
                success: false,
                message: 'Failed to parse response as JSON',
                status: response.status,
                errorType: 'http' as ApiErrorType
            };
        }

        const backendResponse: ApiResponse<T> = data;
        const errorType = getErrorType(response.status, backendResponse);

        // HTTP 异常或业务失败
        if (!response.ok || !backendResponse.success) {
            return {
                ...backendResponse,
                success: false,
                message: backendResponse.message ||
                    (response.status >= 400 ? `HTTP error: ${response.status}` : 'Business logic failed'),
                status: response.status,
                errorType
            };
        }

        // 成功响应
        return {
            ...backendResponse,
            status: response.status
        };
    } catch (error) {
        console.error('handleApiResponse caught error:', error);
        // JSON 解析异常视为 HTTP 异常
        return {
            success: false,
            message: 'Response parsing failed',
            status: 500,
            errorType: 'http' as ApiErrorType
        };
    }
}

/**
 * Determine if retry should be attempted
 */
function shouldRetry(error: unknown): boolean {
    // 只对网络错误重试
    return error instanceof ApiError && error.errorType === 'network';
}

/**
 * 统一的错误处理函数，用于封装 try-catch 逻辑
 */
async function apiRequest<T>(
    endpoint: string,
    method: string,
    data?: any,
    options: RequestOptions = {}
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    try {
        const response = await proxyRequest(endpoint, {
            method,
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return await handleApiResponse<T>(response);
    } catch (error) {
        console.error(`api${method} caught error:`, error);

        // 如果是 ApiError（网络异常）
        if (error instanceof ApiError) {
            return {
                success: false,
                message: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }

        // 其他未知错误
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network' as ApiErrorType
        };
    }
}

/**
 * Convenient GET request
 */
export async function apiGet<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    return apiRequest<T>(endpoint, 'GET', undefined, options);
}

/**
 * Convenient POST request
 */
export async function apiPost<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    return apiRequest<T>(endpoint, 'POST', data, options);
}

/**
 * Convenient PUT request
 */
export async function apiPut<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    return apiRequest<T>(endpoint, 'PUT', data, options);
}

/**
 * Convenient DELETE request
 */
export async function apiDelete<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    return apiRequest<T>(endpoint, 'DELETE', undefined, options);
}

/**
 * 错误处理工具函数
 */
export function handleApiError(error: ApiResponse<any> & {
    status?: number;
    errorType?: ApiErrorType;
}): {
    shouldHandle: boolean;
    errorMessage: string;
    errorType: string;
} {
    console.error('API Error:', error);

    switch (error.errorType) {
        case 'network':
            // 网络异常：需要统一处理
            return {
                shouldHandle: true,
                errorMessage: '网络连接异常，请检查网络后重试',
                errorType: 'network'
            };

        case 'http':
            // HTTP 异常：需要统一处理
            return {
                shouldHandle: true,
                errorMessage: `服务器错误 (${error.status})，请稍后重试`,
                errorType: 'http'
            };

        case 'system_business':
            // C 开头的业务异常：需要统一处理
            return {
                shouldHandle: true,
                errorMessage: error.message || '系统业务异常',
                errorType: 'system_business'
            };

        case 'custom_business':
            // 其他业务异常：留给调用者处理
            return {
                shouldHandle: false,
                errorMessage: error.message || '业务异常',
                errorType: 'custom_business'
            };

        default:
            // 未知类型
            return {
                shouldHandle: true,
                errorMessage: '未知错误，请稍后重试',
                errorType: 'unknown'
            };
    }
}