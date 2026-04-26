'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'

/**
 * 服务端刷新 Token
 */
async function refreshServerToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        console.warn('[fetchWithAuth] No refresh token found')
        return null
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (!response.ok) return null

        const data = await response.json()

        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefresh } = data.data

            cookieStore.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60
            })

            if (newRefresh) {
                cookieStore.set('refreshToken', newRefresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60
                })
            }

            return accessToken
        }
        return null
    } catch (e) {
        console.error('[fetchWithAuth] Refresh error:', e)
        return null
    }
}

/**
 * 统一的认证请求函数
 * 自动处理 Token 刷新和重试
 * @param url - 请求 URL（完整路径或相对路径）
 * @param options - fetch 选项
 * @param retry - 是否已经重试过（内部使用）
 */
export async function fetchWithAuth(
    url: string,
    options: RequestInit = {},
    retry = false
): Promise<Response> {
    const cookieStore = await cookies()
    let token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('Unauthorized - No token provided')
    }

    // 确保 headers 存在
    const headers = new Headers(options.headers || {})
    headers.set('Authorization', `Bearer ${token}`)
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
        ...options,
        headers
    })

    // ✅ 自动处理 401：刷新 Token 并重试
    if (response.status === 401 && !retry) {
        console.log('[fetchWithAuth] Token expired, attempting refresh...')
        const newToken = await refreshServerToken()
        
        if (newToken) {
            console.log('[fetchWithAuth] Token refreshed, retrying...')
            // 使用新 Token 重试
            headers.set('Authorization', `Bearer ${newToken}`)
            return fetchWithAuth(url, { ...options, headers }, true)
        }
        
        throw new Error('Failed to refresh token - please login again')
    }

    return response
}

/**
 * 简化的 GET 请求
 */
export async function fetchWithAuthGet(url: string, retry = false): Promise<Response> {
    return fetchWithAuth(url, { method: 'GET', cache: 'no-store' }, retry)
}

/**
 * 简化的 POST 请求
 */
export async function fetchWithAuthPost(url: string, body: any, retry = false): Promise<Response> {
    return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(body)
    }, retry)
}

/**
 * 简化的 PUT 请求
 */
export async function fetchWithAuthPut(url: string, body: any, retry = false): Promise<Response> {
    return fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(body)
    }, retry)
}

/**
 * 简化的 DELETE 请求
 */
export async function fetchWithAuthDelete(url: string, retry = false): Promise<Response> {
    return fetchWithAuth(url, { method: 'DELETE' }, retry)
}
