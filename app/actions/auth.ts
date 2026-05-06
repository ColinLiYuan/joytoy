'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { LoginRequest, RegisterRequest } from '@/types/auth'

const API_PATHS = {
  AUTH_LOGIN: `/api/V1/users/login`,
  AUTH_REGISTER: `/api/V1/users/register`,
  AUTH_FORGOT_PASSWORD: `/api/V1/users/forgot-password`,
  AUTH_RESET_PASSWORD: `/api/V1/users/reset-password`,
} as const

/**
 * 用户登录
 * @returns 成功时返回 { success: true, data: LoginResponse }，失败时返回 { success: false, error: string }
 */
export async function loginUser(request: LoginRequest) {
    try {
        // ✅ 从 Cookie 获取 sessionId（如果存在）
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('sessionId')?.value;

        console.log('[loginUser] Session ID from cookie:', sessionId ? `${sessionId.substring(0, 12)}...` : 'none');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (sessionId) {
            headers['X-Session-Id'] = sessionId;
        }

        const response = await fetchWithAuth(API_PATHS.AUTH_LOGIN, {
            method: 'POST',
            body: JSON.stringify(request),
            headers,
        })

        // 尝试解析响应（无论成功失败都可能是 JSON）
        let apiResponse: any;
        try {
            apiResponse = await response.json();
        } catch (e) {
            // 如果不是 JSON，说明服务器返回了 HTML 错误页面
            return {
                success: false,
                error: '服务器响应格式错误，请稍后重试'
            };
        }

        // 检查业务逻辑错误（HTTP 200 但 success: false）
        if (!apiResponse.success) {
            const errorMsg = apiResponse.message || 'Login failed. Please check your credentials.';
            console.error('[loginUser] Login failed:', errorMsg);
            return {
                success: false,
                error: errorMsg
            };
        }

        return {
            success: true,
            data: apiResponse.data
        };
    } catch (error: any) {
        // 捕获所有异常，返回错误对象
        const errorMsg = error?.message || 'Login failed. Please try again.';
        console.error('[loginUser] Exception caught:', errorMsg);
        return {
            success: false,
            error: errorMsg
        };
    }
}

/**
 * 用户注册
 */
export async function registerUser(request: RegisterRequest) {
    const response = await fetchWithAuth(API_PATHS.AUTH_REGISTER, {
        method: 'POST',
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Registration failed.')
    }

    return apiResponse.data
}

/**
 * 忘记密码 - 发送重置邮件
 */
export async function forgotPassword(email: string) {
    const response = await fetchWithAuth(API_PATHS.AUTH_FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email }),
    })

    if (!response.ok) {
        throw new Error(`Failed to send reset email: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to send reset email')
    }
}

/**
 * 重置密码
 */
export async function resetPassword(token: string, password: string) {
    const response = await fetchWithAuth(API_PATHS.AUTH_RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
        throw new Error(`Failed to reset password: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to update password.')
    }
}
