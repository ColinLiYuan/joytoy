// lib/api-utils.ts
import { BACKEND_CONFIG, SERVER_CONFIG } from '@/lib/api-config';
import { FrontApiResponse } from '@/types/api';

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

        if (!response.ok) {
            // Clone response to handle errors without consuming original response body
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

            console.error('proxyRequest HTTP error:', errorData);

            throw new ApiError(
                response.status,
                errorData.message || `HTTP error! status: ${response.status}`,
                errorData
            );
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        // Safely handle error messages
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

        // Throw all exceptions
        throw error;
    }
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): { error: string } {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
        throw error; // Throw ApiError
    }

    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout'); // Throw timeout error
        }
        throw error; // Throw other Error instances
    }

    throw new Error('An unexpected error occurred'); // Throw generic error
}

/**
 * Unified API response handler
 */
export async function handleApiResponse<T>(
    response: Response
): Promise<FrontApiResponse<T>> {
    try {
        // Clone response to check content
        const responseClone = response.clone();
        const responseText = await responseClone.text();

        // If response body is empty but request succeeded, consider it an update success
        if (!responseText.trim()) {
            if (response.ok) {
                return {
                    success: true,
                    data: undefined as T
                };
            } else {
                throw new Error('Empty response body');
            }
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            throw new Error('Failed to parse response as JSON');
        }

        if (!response.ok) {
            throw new ApiError(
                response.status,
                data?.message || 'Request failed',
                data
            );
        }

        return {
            success: true,
            data,
        };
    } catch (error) {
        console.error('handleApiResponse caught error:', error);
        // Re-throw the error
        throw error;
    }
}

/**
 * Determine if retry should be attempted
 */
function shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
        // Only retry on server errors
        return error.status >= 500;
    }

    // Retry on network errors
    return error instanceof TypeError && error.message.includes('fetch');
}

/**
 * Convenient GET request
 */
export async function apiGet<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'GET',
            ...options,
        });

        const result = await handleApiResponse<T>(response);
        return result;
    } catch (error) {
        console.error('apiGet caught error:', error);
        // Throw the exception
        throw error;
    }
}

/**
 * Convenient POST request
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
        console.error('apiPost caught error:', error);
        throw error;
    }
}

/**
 * Convenient PUT request
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
        console.error('apiPut caught error:', error);
        throw error;
    }
}

/**
 * Convenient DELETE request
 */
export async function apiDelete<T>(
    endpoint: string,
    options?: RequestOptions
): Promise<FrontApiResponse<T>> {
    try {
        const response = await proxyRequest(endpoint, {
            method: 'DELETE',
            ...options,
        });
        return handleApiResponse<T>(response);
    } catch (error) {
        console.error('apiDelete caught error:', error);
        throw error;
    }
}