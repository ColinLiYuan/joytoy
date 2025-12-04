// lib/api-utils.ts
import { BACKEND_CONFIG } from '@/lib/api-config';
import { FrontApiResponse, ApiResponse } from '@/types/api';

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
        public errorType?: 'network' | 'http' | 'system_business' | 'custom_business'
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
): 'http' | 'system_business' | 'custom_business' {
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
 * 处理 API 响应
 */
export async function handleApiResponse<T>(
    response: Response
): Promise<FrontApiResponse<T>> {
    try {
        // Clone response to check content
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        // 空响应体处理
        if (!responseText.trim()) {
            const result: FrontApiResponse<T> = {
                success: response.ok,
                status: response.status,
                errorType: 'http'
            };
            if (!response.ok) {
                result.error = 'Empty response body';
            }
            return result;
        }

        let data: any;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return {
                success: false,
                error: 'Failed to parse response as JSON',
                status: response.status,
                errorType: 'http'
            };
        }

        const backendResponse: ApiResponse<T> = data;
        const errorType = getErrorType(response.status, backendResponse);

        // HTTP 异常或业务失败
        if (!response.ok || !backendResponse.success) {
            return {
                success: false,
                error: backendResponse.message ||
                    (response.status >= 400 ? `HTTP error: ${response.status}` : 'Business logic failed'),
                data: backendResponse,
                status: response.status,
                code: backendResponse.errorCode,
                errorType
            };
        }

        // 成功响应
        return {
            success: true,
            data: backendResponse.data,
            status: response.status
        };
    } catch (error) {
        console.error('handleApiResponse caught error:', error);
        // JSON 解析异常视为 HTTP 异常
        return {
            success: false,
            error: 'Response parsing failed',
            status: 500,
            errorType: 'http'
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
 * Convenient GET request
 */
export async function apiGet<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'GET',
            ...options,
        });
        return await handleApiResponse<T>(response);
    } catch (error) {
        console.error('apiGet caught error:', error);

        // 如果是 ApiError（网络异常）
        if (error instanceof ApiError) {
            return {
                success: false,
                error: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }

        // 其他未知错误
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network'
        };
    }
}

/**
 * Convenient POST request
 */
export async function apiPost<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return await handleApiResponse<T>(response);
    } catch (error) {
        console.error('apiPost caught error:', error);

        if (error instanceof ApiError) {
            return {
                success: false,
                error: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network'
        };
    }
}

/**
 * Convenient PUT request
 */
export async function apiPut<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return await handleApiResponse<T>(response);
    } catch (error) {
        console.error('apiPut caught error:', error);

        if (error instanceof ApiError) {
            return {
                success: false,
                error: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network'
        };
    }
}

/**
 * Convenient DELETE request
 */
export async function apiDelete<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'DELETE',
            ...options,
        });
        return await handleApiResponse<T>(response);
    } catch (error) {
        console.error('apiDelete caught error:', error);

        if (error instanceof ApiError) {
            return {
                success: false,
                error: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network'
        };
    }
}

/**
 * 错误处理工具函数
 */
export function handleApiError(error: FrontApiResponse<any>): {
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
                errorMessage: error.error || '系统业务异常',
                errorType: 'system_business'
            };

        case 'custom_business':
            // 其他业务异常：留给调用者处理
            return {
                shouldHandle: false,
                errorMessage: error.error || '业务异常',
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