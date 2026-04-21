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
export async function refreshAccessToken(): Promise<string | null> {
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

            // ✅ 关键修复：在客户端更新 Token，Server 端只返回新 Token
            if (typeof window !== 'undefined') {
                // 客户端：使用 setTokens 更新 Cookie 和 LocalStorage
                setTokens(accessToken, newRefresh || refreshToken);
            }
            // Server 端：不执行任何操作，只返回新 Token
            // 调用方需要自己处理 Cookie 更新

            console.log('Token refreshed successfully');
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
        method = 'GET',
        ...fetchOptions
    } = options;

    // 🔧 关键修复：判断是 Next.js API Route 还是后端接口
    // - 如果 endpoint 以 /api/site/ 开头，说明是 Next.js API Route，使用相对路径
    // - 否则，认为是后端接口，拼接 BACKEND_CONFIG.baseURL
    const isNextJsRoute = endpoint.startsWith('/api/site/');
    const url = isNextJsRoute ? endpoint : `${BACKEND_CONFIG.baseURL}${endpoint}`;

    // 1. 获取 Token (Async) - 只有在没有手动传递 Authorization 时才获取
    let token: string | undefined;
    const hasCustomAuth = headers && headers['Authorization'];
    
    console.log('[PROXY REQUEST] Endpoint:', endpoint);
    console.log('[PROXY REQUEST] Has custom auth:', !!hasCustomAuth);
    
    if (!hasCustomAuth) {
        token = await getToken();
        console.log('[PROXY REQUEST] Auto-fetched token:', token ? 'YES' : 'NO');
    } else {
        console.log('[PROXY REQUEST] Using custom auth header');
    }

    // 2. 构造 Header
    const authHeaders: Record<string, string> = {};
    if (token) {
        authHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 🔧 重要：不要包含 BACKEND_CONFIG.defaultHeaders 中的 Authorization
    // 因为它可能是空字符串，会覆盖后面传递的 Token
    const requestHeaders = {
        'Content-Type': 'application/json', // 只保留 Content-Type
        ...authHeaders,                     // 自动获取的 Token
        ...headers,                         // 手动传递的 Token（优先级最高）
    };
    
    console.log('[PROXY REQUEST] Final headers:', {
        hasAuth: !!requestHeaders['Authorization'],
        authPreview: requestHeaders['Authorization'] ? `${requestHeaders['Authorization'].substring(0, 30)}...` : 'none'
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const fetchConfig: RequestInit = {
            ...fetchOptions,
            method,
            headers: requestHeaders,
            signal: controller.signal,
        };
        
        // 🔧 Critical: include credentials (cookies) when calling Next.js API Routes
        // Without this, HttpOnly cookies won't be sent
        if (isNextJsRoute) {
            fetchConfig.credentials = 'include';
        }
        
        const response = await fetch(url, fetchConfig);

        clearTimeout(timeoutId);

        // 3. 拦截 401，先尝试刷新 Token
        if (response.status === 401 && !_isRetry) {
            console.warn('401 Unauthorized, token expired.');
            
            // 🔧 关键修复：只在客户端尝试刷新，Server 端直接返回 401
            if (typeof window !== 'undefined') {
                console.log('Attempting refresh on client...');
                
                // 尝试刷新 Token
                const newToken = await refreshAccessToken();
                
                if (newToken) {
                    // 刷新成功，使用新 Token 重试请求
                    console.log('Token refreshed successfully, retrying request...');
                    return proxyRequest(endpoint, {
                        ...options,
                        _isRetry: true,
                    });
                }
                
                // 刷新失败，清除 Token 并触发登录事件
                console.warn('Token refresh failed, clearing tokens...');
                // 🔧 关键修复：只清除 Access Token，保留 Refresh Token
                // 因为 Refresh Token 可能还没过期，下次可以直接用
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    // 不删除 refreshToken，让它继续保留
                }
                
                // 触发自定义事件，通知全局显示登录框
                window.dispatchEvent(new CustomEvent('auth:tokenExpired', {
                    detail: { message: 'Your session has expired. Please login again.' }
                }));
            } else {
                // Server 端：不尝试刷新，直接返回 401 给客户端处理
                console.log('Server-side 401, forwarding to client...');
            }
            
            // 返回一个特殊响应，让业务层停止处理
            return new Response(JSON.stringify({
                success: false,
                message: 'Session expired, please login again',
                errorType: 'auth'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
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

        // 🔍 调试日志：记录原始响应
        console.log('[API-UTILS] Raw response:', {
            url: response.url,
            status: response.status,
            ok: response.ok,
            textLength: responseText?.length || 0,
            first100Chars: responseText?.substring(0, 100)
        });

        // 处理空响应
        if (!responseText || !responseText.trim()) {
            return {
                success: response.ok,
                message: response.ok ? undefined : 'Empty response body',
                status: response.status,
                errorType: 'http' as ApiErrorType
            };
        }

        let data: any;
        try {
            // 尝试清理响应文本（移除可能的 BOM 或空白）
            const cleanedText = responseText.trim().replace(/^\uFEFF/, '');
            
            // 如果清理后为空，视为空响应
            if (!cleanedText) {
                console.warn('[API-UTILS] Empty response after cleaning:', {
                    url: response.url,
                    status: response.status
                });
                return {
                    success: response.ok,
                    message: response.ok ? undefined : 'Empty response body',
                    status: response.status,
                    errorType: 'http' as ApiErrorType
                };
            }
            
            data = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('[API-UTILS] JSON parse failed:', {
                url: response.url,
                status: response.status,
                rawText: responseText.substring(0, 200),
                error: parseError instanceof Error ? parseError.message : String(parseError)
            });
            return {
                success: false,
                message: 'Failed to parse response as JSON',
                status: response.status,
                errorType: 'http' as ApiErrorType
            };
        }

        const backendResponse: BackendApiResponse<T> = data;
        const errorType = getErrorType(response.status, backendResponse);

        // 🔍 检测后端返回的认证错误（HTTP 200 但 success: false 且 message 包含认证关键词）
        if (!backendResponse.success && backendResponse.message) {
            const msg = backendResponse.message.toLowerCase();
            const isAuthError = msg.includes('请先登录') || 
                               msg.includes('登录') || 
                               msg.includes('authenticate') || 
                               msg.includes('login') || 
                               msg.includes('authentication required') ||
                               msg.includes('unauthorized');
            
            if (isAuthError && typeof window !== 'undefined') {
                console.log('[API-UTILS] Backend returned auth error:', backendResponse.message);
                
                // 🔧 关键修复：先尝试刷新 Token
                const newToken = await refreshAccessToken();
                
                if (newToken) {
                    console.log('[API-UTILS] Token refreshed successfully');
                    // 注意：这里无法直接重试，因为已经解析完响应了
                    // 刷新成功后，下次请求会自动使用新 Token
                } else {
                    // 刷新失败，只清除 Access Token，保留 Refresh Token
                    console.warn('[API-UTILS] Token refresh failed, clearing access token only...');
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('accessToken');
                        // 不删除 refreshToken，让它继续保留
                    }
                    
                    // 触发自定义事件，通知全局显示登录框
                    window.dispatchEvent(new CustomEvent('auth:tokenExpired', {
                        detail: { message: backendResponse.message }
                    }));
                }
            }
        }

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