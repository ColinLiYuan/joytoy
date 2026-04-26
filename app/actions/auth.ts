'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { LoginRequest, RegisterRequest } from '@/types/auth'

const API_PATHS = {
  AUTH_LOGIN: `${BACKEND_CONFIG.baseURL}/api/V1/users/login`,
  AUTH_REGISTER: `${BACKEND_CONFIG.baseURL}/api/V1/users/register`,
  AUTH_FORGOT_PASSWORD: `${BACKEND_CONFIG.baseURL}/api/V1/users/forgot-password`,
  AUTH_RESET_PASSWORD: `${BACKEND_CONFIG.baseURL}/api/V1/users/reset-password`,
} as const

/**
 * 用户登录
 */
export async function loginUser(request: LoginRequest) {
    const response = await fetch(API_PATHS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Login failed. Please check your credentials.')
    }

    return apiResponse.data
}

/**
 * 用户注册
 */
export async function registerUser(request: RegisterRequest) {
    const response = await fetch(API_PATHS.AUTH_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(API_PATHS.AUTH_FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(API_PATHS.AUTH_RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
