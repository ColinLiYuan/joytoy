// lib/api-utils.ts
import { BACKEND_CONFIG } from '@/lib/api-config';
import { BackendApiResponse, ApiErrorType } from '@/types/api';
import { getToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token-utils'; // 确保你有这个文件

export interface RequestOptions extends RequestInit {
    timeout?: number;
    retry?: number;
    _isRetry?: boolean; // 内部标志，防止死循环
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
 * 刷新 Token 的独立逻辑
 * 避免使用 proxyRequest 造成循环调用
 */
async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return null;

        // 这里使用原生 fetch，不走 proxyRequest，避免死循环
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`;
        console.log('refreshAccessToken url: ', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        console.log('refreshAccessToken api util: ', response)
        if (!response.ok) return null;

        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefresh } = data.data;
            setTokens(accessToken, newRefresh);
            return accessToken;
        }
        return null;
    } catch (e) {
        console.error('Token refresh failed:', e);
        return null;
    }
}

/**
 * 统一 API 请求函数 (包含 Token 自动注入和刷新逻辑)
 */
export async function proxyRequest(
    endpoint: string,
    options: RequestOptions = {}
): Promise<Response> {
    const {
        timeout = BACKEND_CONFIG.timeout,
        retry = 0,
        headers = {},
        _isRetry = false, // 默认不是重试请求
        ...fetchOptions
    } = options;

    const url = `${BACKEND_CONFIG.baseURL}${endpoint}`;

    // 1. 自动注入 Token
    const token = getToken();
    const authHeaders: Record<string, string> = {};
    if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`;
    }

    const requestHeaders = {
        ...BACKEND_CONFIG.defaultHeaders,
        ...authHeaders,
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

        // 2. 核心逻辑：拦截 401 并尝试刷新 Token
        if (response.status === 401 && !_isRetry) {
            console.warn('Token expired, attempting refresh...');

            // 尝试刷新
            const newToken = await refreshAccessToken();

            if (newToken) {
                console.log('Token refreshed, retrying request...');
                // 刷新成功，带上新 Token 重试原请求
                return proxyRequest(endpoint, {
                    ...options,
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${newToken}` // 覆盖旧 Token
                    },
                    _isRetry: true // 标记为重试，防止无限死循环
                });
            } else {
                // 刷新失败（Refresh Token 也过期了），清理登录状态
                console.error('Refresh failed, logging out.');
                clearTokens();
                // 可选：强制跳转登录页，或者由上层业务处理
                // window.location.href = '/?login=expired';
            }
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        const errorMessage = error instanceof Error ? error.message : String(error);

        // Retry logic (针对网络错误)
        if (retry > 0 && shouldRetry(error)) {
            console.warn(`Network error, retrying... ${retry} attempts left`);
            return proxyRequest(endpoint, {
                ...options,
                retry: retry - 1,
            });
        }

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
    backendResponse: BackendApiResponse<any>
): ApiErrorType {
    if (httpStatus === 401) return 'http'; // 401 单独处理
    if (httpStatus >= 400) return 'http';
    if (!backendResponse.success) {
        const errorCode = backendResponse.errorCode;
        if (errorCode && (errorCode.startsWith('C') || errorCode.startsWith('c'))) {
            return 'system_business';
        }
        return 'custom_business';
    }
    return 'custom_business';
}

/**
 * 处理 API 响应
 */
export async function handleApiResponse<T>(
    response: Response
): Promise<BackendApiResponse<T> & {
    status?: number;
    errorType?: ApiErrorType;
}> {
    try {
        const responseClone = response.clone();
        const responseText = await responseClone.text();

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

        const backendResponse: BackendApiResponse<T> = data;
        const errorType = getErrorType(response.status, backendResponse);

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

        return {
            ...backendResponse,
            status: response.status
        };
    } catch (error) {
        return {
            success: false,
            message: 'Response parsing failed',
            status: 500,
            errorType: 'http' as ApiErrorType
        };
    }
}

function shouldRetry(error: unknown): boolean {
    return error instanceof ApiError && error.errorType === 'network';
}

// ... 下面的 apiRequest, apiGet, apiPost 等保持不变，它们会自动使用新的 proxyRequest ...
async function apiRequest<T>(
    endpoint: string,
    method: string,
    data?: any,
    options: RequestOptions = {}
): Promise<BackendApiResponse<T> & {
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
        if (error instanceof ApiError) {
            return {
                success: false,
                message: error.message,
                data: error.data,
                status: error.status,
                errorType: error.errorType
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            status: 0,
            errorType: 'network' as ApiErrorType
        };
    }
}

export async function apiGet<T>(endpoint: string, options: RequestOptions = {}) {
    return apiRequest<T>(endpoint, 'GET', undefined, options);
}

export async function apiPost<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return apiRequest<T>(endpoint, 'POST', data, options);
}

export async function apiPut<T>(endpoint: string, data?: any, options: RequestOptions = {}) {
    return apiRequest<T>(endpoint, 'PUT', data, options);
}

export async function apiDelete<T>(endpoint: string, options: RequestOptions = {}) {
    return apiRequest<T>(endpoint, 'DELETE', undefined, options);
}

export function handleApiError(errorInput: unknown): { shouldHandle: boolean; errorMessage: string; errorType: string; } {
    let message = '';
    let errorType: string = 'unknown';
    let status: number | undefined;

    if (typeof errorInput === 'string') {
        message = errorInput;
    } else if (errorInput instanceof Error) {
        message = errorInput.message;
    } else if (errorInput && typeof errorInput === 'object') {
        const typedError = errorInput as Partial<BackendApiResponse<any> & { status?: number; errorType?: string }>;
        message = typedError.message || 'Unknown error';
        errorType = typedError.errorType || 'unknown';
        status = typedError.status;
    }

    switch (errorType) {
        case 'network':
            return { shouldHandle: true, errorMessage: 'Network connection error', errorType: 'network' };
        case 'http':
            // 401 已经在 proxyRequest 处理过了，这里一般不会再弹窗提示，除非刷新也失败
            if (status === 401) return { shouldHandle: false, errorMessage: 'Session expired', errorType: 'auth' };
            return { shouldHandle: true, errorMessage: `Server Error (${status || 'Unknown'})`, errorType: 'http' };
        case 'system_business':
            return { shouldHandle: true, errorMessage: message || 'System error', errorType: 'system_business' };
        case 'custom_business':
            return { shouldHandle: false, errorMessage: message || 'Business error', errorType: 'custom_business' };
        default:
            return { shouldHandle: true, errorMessage: 'Unknown error occurred', errorType: 'unknown' };
    }
}