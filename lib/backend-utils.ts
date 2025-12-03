// lib/backend-utils.ts
import { apiGet, apiPost, apiPut, apiDelete, RequestOptions } from './api-utils';
import { FrontApiResponse } from '@/types/api';

export interface BackendApiOptions extends RequestOptions {
    /**
     * 是否自动处理业务异常（默认 true）
     * true: 业务异常直接返回错误信息
     * false: 抛出异常
     */
    handleBusinessError?: boolean;

    /**
     * 默认错误消息（系统异常时使用）
     */
    defaultErrorMessage?: string;
}

/**
 * 基于现有 api-utils 的后端 API 调用函数
 * 返回 FrontApiResponse 格式
 */
export async function callBackendApi<T = any>(
    endpoint: string,
    options: BackendApiOptions = {}
): Promise<FrontApiResponse<T>> {
    const {
        handleBusinessError = true,
        defaultErrorMessage = '系统繁忙，请稍后重试',
        method = 'GET',
        ...restOptions
    } = options;

    try {
        let response: FrontApiResponse<T>;

        // 根据方法调用现有的 api-utils
        switch (method.toUpperCase()) {
            case 'POST':
                response = await apiPost<T>(endpoint, restOptions.body, restOptions);
                break;
            case 'PUT':
                response = await apiPut<T>(endpoint, restOptions.body, restOptions);
                break;
            case 'DELETE':
                response = await apiDelete<T>(endpoint, restOptions);
                break;
            case 'GET':
            default:
                response = await apiGet<T>(endpoint, restOptions);
                break;
        }

        // 如果不需要自动处理业务异常，直接返回
        if (!handleBusinessError) {
            return response;
        }

        // 如果 API 调用成功，直接返回
        if (response.success) {
            return response;
        }

        // 业务异常：使用后端返回的错误信息
        console.warn(`业务异常 [${endpoint}]:`, response.error);
        return {
            success: false,
            error: response.error || '操作失败',
            data: response.data
        };

    } catch (error) {
        // 系统异常：网络错误、超时、服务器错误等
        console.error(`系统异常 [${endpoint}]:`, error);

        let errorMessage = defaultErrorMessage;

        // 如果是已知的错误类型，可以给出更具体的提示
        if (error instanceof Error) {
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
                errorMessage = '请求超时，请检查网络连接';
            } else if (error.message.includes('Network')) {
                errorMessage = '网络连接失败，请检查网络设置';
            }
        }

        return {
            success: false,
            error: errorMessage,
            data: undefined
        };
    }
}

/**
 * GET 请求的快捷方式
 */
export async function callBackendGet<T = any>(
    endpoint: string,
    options: Omit<BackendApiOptions, 'method'> = {}
): Promise<FrontApiResponse<T>> {
    return callBackendApi<T>(endpoint, { method: 'GET', ...options });
}

/**
 * POST 请求的快捷方式
 */
export async function callBackendPost<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<BackendApiOptions, 'method' | 'body'> = {}
): Promise<FrontApiResponse<T>> {
    return callBackendApi<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...options
    });
}

/**
 * PUT 请求的快捷方式
 */
export async function callBackendPut<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<BackendApiOptions, 'method' | 'body'> = {}
): Promise<FrontApiResponse<T>> {
    return callBackendApi<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...options
    });
}

/**
 * DELETE 请求的快捷方式
 */
export async function callBackendDelete<T = any>(
    endpoint: string,
    options: Omit<BackendApiOptions, 'method'> = {}
): Promise<FrontApiResponse<T>> {
    return callBackendApi<T>(endpoint, { method: 'DELETE', ...options });
}