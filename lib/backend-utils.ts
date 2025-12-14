// lib/backend-utils.ts
import { apiGet, apiPost, apiPut, apiDelete, RequestOptions } from './api-utils';
import { BackendApiResponse } from '@/types/api';

export interface BackendApiOptions extends RequestOptions {
    requiresAuth?: boolean;
    handleBusinessError?: boolean;
    defaultErrorMessage?: string;
}

async function getAuthToken(): Promise<string | null> {
    try {
        if (typeof window !== 'undefined') {
            return getClientAuthToken();
        } else {
            const { getToken } = await import('@/lib/token-utils');
            // console.log('server get token')
            const token = await getToken();
            return token || null; // 将 undefined 转换为 null
        }
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
}

function getClientAuthToken(): string | null {
    try {
        const userInfoStr = localStorage.getItem('userInfo');

        if (userInfoStr) {
            try {
                const userInfo = JSON.parse(userInfoStr);
                if (userInfo?.token) {
                    return userInfo.token;
                }
            } catch (parseError) {
                console.error('Failed to parse userInfo from localStorage:', parseError);
                localStorage.removeItem('userInfo');
                localStorage.removeItem('isLoggedIn');
            }
        }

        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            if (cookie.startsWith('auth_token=')) {
                return cookie.substring('auth_token='.length);
            }
        }

        return null;
    } catch (error) {
        console.error('Failed to get client auth token:', error);
        return null;
    }
}

/**
 * Backend API call function based on existing api-utils
 * Returns BackendApiResponse format
 */
export async function callBackendApi<T = any>(
    endpoint: string,
    options: BackendApiOptions = {}
): Promise<BackendApiResponse<T>> {
    const {
        handleBusinessError = true,
        defaultErrorMessage = 'System busy, please try again later',
        method = 'GET',
        requiresAuth = false,
        ...restOptions
    } = options;

    try {
        let response: BackendApiResponse<T>;

        const headers: Record<string, string> = { ...(restOptions.headers as Record<string, string>) };

        if (requiresAuth) {
            const token = await getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        const apiOptions = {
            ...restOptions,
            headers: headers
        };

        switch (method.toUpperCase()) {
            case 'POST':
                response = await apiPost<T>(endpoint, restOptions.body, apiOptions);
                break;
            case 'PUT':
                response = await apiPut<T>(endpoint, restOptions.body, apiOptions);
                break;
            case 'DELETE':
                response = await apiDelete<T>(endpoint, apiOptions);
                break;
            case 'GET':
            default:
                response = await apiGet<T>(endpoint, apiOptions);
                break;
        }

        // If API call successful, return directly
        if (response.success) {
            return response;
        }

        // Business exception: use backend message information
        const errorMessage = response.message || 'Operation failed';  // 改为 message
        console.warn(`Business exception [${endpoint}]:`, errorMessage);

        if (!handleBusinessError) {
            throw new Error(errorMessage);
        }

        return {
            success: false,
            message: errorMessage,  // 改为 message
            data: response.data
        };

    } catch (error) {
        console.error(`System exception [${endpoint}]:`, error);

        if (!handleBusinessError) {
            throw error;
        }

        let errorMessage = defaultErrorMessage;

        if (error instanceof Error) {
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
                errorMessage = 'Request timeout, please check network connection';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Network connection failed, please check network settings';
            } else {
                errorMessage = error.message || errorMessage;
            }
        }

        return {
            success: false,
            message: errorMessage,  // 改为 message
            data: undefined
        };
    }
}

/**
 * Shortcut for GET request
 */
export async function callBackendGet<T = any>(
    endpoint: string,
    options: Omit<BackendApiOptions, 'method'> = {}
): Promise<BackendApiResponse<T>> {
    return callBackendApi<T>(endpoint, { method: 'GET', ...options });
}

/**
 * Shortcut for POST request
 */
export async function callBackendPost<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<BackendApiOptions, 'method' | 'body'> = {}
): Promise<BackendApiResponse<T>> {
    return callBackendApi<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...options
    });
}

/**
 * Shortcut for PUT request
 */
export async function callBackendPut<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<BackendApiOptions, 'method' | 'body'> = {}
): Promise<BackendApiResponse<T>> {
    return callBackendApi<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...options
    });
}

/**
 * Shortcut for DELETE request
 */
export async function callBackendDelete<T = any>(
    endpoint: string,
    options: Omit<BackendApiOptions, 'method'> = {}
): Promise<BackendApiResponse<T>> {
    return callBackendApi<T>(endpoint, { method: 'DELETE', ...options });
}