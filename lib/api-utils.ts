// lib/api-utils.ts
import { BACKEND_CONFIG } from '@/lib/api-config';
import { BackendApiResponse, ApiErrorType } from '@/types/api';
// ✅ 引入 setTokens 即可，不需要 updateAccessToken，保持逻辑统一
import { getToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token-utils';

export interface RequestOptions extends RequestInit {
    timeout?: number;
    retry?: number;
    _isRetry?: boolean;
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
 */
async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            console.warn('No refresh token found');
            return null;
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`;
        console.log('Refreshing token...');

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) {
            console.error('Refresh failed with status:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefresh } = data.data;

            // ✅ 核心修复：直接使用 setTokens 统一更新 Cookie 和 LocalStorage
            // 如果后端没返回新的 refresh token，就沿用旧的
            setTokens(accessToken, newRefresh || refreshToken);

            // console.log('Token refreshed successfully: ', accessToken);
            return accessToken;
        }
        return null;
    } catch (e) {
        console.error('Token refresh logic error:', e);
        return null;
    }
}

/**
 * 统一 API 请求函数
 */
export async function proxyRequest(
    endpoint: string,
    options: RequestOptions = {}
): Promise<Response> {
    const {
        timeout = BACKEND_CONFIG.timeout,
        retry = 0,
        headers = {},
        _isRetry = false,
        ...fetchOptions
    } = options;

    const url = `${BACKEND_CONFIG.baseURL}${endpoint}`;

    // 1. 获取 Token (Async)
    const token = await getToken();

    // 2. 构造 Header
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

        // 3. 拦截 401 并重试
        if (response.status === 401 && !_isRetry) {
            console.warn('401 Unauthorized, attempting refresh...');

            // 尝试刷新
            const newToken = await refreshAccessToken();

            if (newToken) {
                console.log('Retrying original request with new token...');

                // ✅ 递归调用，并强制覆盖 Authorization Header
                return proxyRequest(endpoint, {
                    ...options,
                    headers: {
                        ...headers,
                        'Authorization': `Bearer ${newToken}`
                    },
                    _isRetry: true // 标记防止死循环
                });
            } else {
                console.error('Refresh failed, logging out.');
                clearTokens();
                // 可选：触发页面跳转
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
            }
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        const errorMessage = error instanceof Error ? error.message : String(error);

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

// ... 下面的辅助函数 (getErrorType, handleApiResponse, apiRequest 等) 保持不变 ...
// ... (为了节省篇幅，这里省略，直接复用你之前的代码即可) ...

function getErrorType(
    httpStatus: number,
    backendResponse: BackendApiResponse<any>
): ApiErrorType {
    if (httpStatus === 401) return 'http';
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
                message: backendResponse.message || (response.status >= 400 ? `HTTP error: ${response.status}` : 'Business logic failed'),
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