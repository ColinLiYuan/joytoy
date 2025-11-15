// lib/api-utils.ts
import { BACKEND_CONFIG, SERVER_CONFIG } from '@/lib/api-config';
import { FrontApiResponse } from '@/types/api';
import { logger } from '@/lib/file-logger';

interface RequestOptions extends RequestInit {
    timeout?: number;
    retry?: number;
}

class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * 统一的 API 请求函数
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

    // logger.info('proxyRequest 完整URL:', { url });
    // logger.info('环境变量检查:', {
    //     backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL
    // });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: requestHeaders,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // logger.info('proxyRequest 响应状态:', { status: response.status, ok: response.ok });

        if (!response.ok) {
            // 克隆响应来处理错误，避免消耗原始响应体
            const errorResponse = response.clone();
            let errorData;

            try {
                errorData = await errorResponse.json();
            } catch {
                try {
                    const errorText = await errorResponse.text();
                    errorData = { message: errorText || response.statusText };
                } catch {
                    errorData = { message: response.statusText };
                }
            }

            logger.error('proxyRequest HTTP错误:', {
                status: response.status,
                errorData
            });

            throw new ApiError(
                response.status,
                errorData.message || `HTTP error! status: ${response.status}`,
                errorData
            );
        }

        // logger.info('proxyRequest 请求成功');
        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        // 安全地处理错误信息
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('proxyRequest 捕获错误:', { error: errorMessage });

        // 重试逻辑
        if (retry > 0 && shouldRetry(error)) {
            logger.warn(`API调用失败，重试中... (剩余 ${retry} 次)`);
            return proxyRequest(endpoint, {
                ...options,
                retry: retry - 1,
            });
        }

        throw error;
    }
}

/**
 * 处理 API 错误
 */
export function handleApiError(error: unknown): { error: string } {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
        return { error: error.message };
    }

    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            return { error: 'Request timeout' };
        }
        return { error: error.message };
    }

    return { error: 'An unexpected error occurred' };
}

/**
 * 统一的 API 响应处理器
 */
export async function handleApiResponse<T>(
    response: Response
): Promise<FrontApiResponse<T>> {
    try {
        // 克隆响应来检查内容
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        // 如果响应体为空但请求成功，认为是更新成功
        if (!responseText.trim()) {
            if (response.ok) {
                return {
                    success: true,
                    data: undefined as T  // 或者 {} as T
                };
            } else {
                return {
                    success: false,
                    error: 'Empty response body',
                };
            }
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('🔍 JSON 解析错误:', parseError);
            return {
                success: false,
                error: 'Failed to parse response as JSON',
            };
        }

        if (!response.ok) {
            return {
                success: false,
                error: data?.message || 'Request failed',
                data: data,
            };
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('🔍 handleApiResponse 捕获错误:', error);
        return {
            success: false,
            error: 'Failed to process response',
        };
    }
}

/**
 * 判断是否应该重试
 */
function shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
        // 只对服务器错误进行重试
        return error.status >= 500;
    }

    // 对网络错误进行重试
    return error instanceof TypeError && error.message.includes('fetch');
}

/**
 * 便捷的 GET 请求
 */
export async function apiGet<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        // logger.info('apiGet 开始调用', { endpoint });
        // logger.info('前端serverURL:', { baseURL: SERVER_CONFIG.baseURL });
        // logger.info('后端基础URL:', { baseURL: BACKEND_CONFIG.baseURL });

        const response = await proxyRequest(endpoint, {
            method: 'GET',
            ...options,
        });

        // logger.info('apiGet 响应状态:', { status: response.status });
        const result = await handleApiResponse<T>(response);
        // logger.info('apiGet 处理结果:', { success: result.success });

        return result;
    } catch (error) {
        // 安全地处理 error 对象
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('apiGet 捕获错误:', { error: errorMessage });

        return {
            success: false,
            ...handleApiError(error),
        };
    }
}

/**
 * 便捷的 POST 请求
 */
export async function apiPost<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return handleApiResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            ...handleApiError(error),
        };
    }
}

/**
 * 便捷的 PUT 请求
 */
export async function apiPut<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return handleApiResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            ...handleApiError(error),
        };
    }
}

/**
 * 便捷的 DELETE 请求
 */
export async function apiDelete<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        // console.log('api- utils ')
        const response = await proxyRequest(endpoint, {
            method: 'DELETE',
            ...options,
        });
        return handleApiResponse<T>(response);
    } catch (error) {
        return {
            success: false,
            ...handleApiError(error),
        };
    }
}