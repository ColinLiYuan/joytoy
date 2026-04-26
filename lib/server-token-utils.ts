// lib/server-token-utils.ts
// 服务端 Token 工具 - 供 Server Action 和 generateMetadata 使用

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from './api-config'

/**
 * 从 Cookie 获取 Access Token
 */
export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('accessToken')?.value
}

/**
 * 刷新 Token
 */
export async function refreshAccessToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('refreshToken')?.value
        
        if (!refreshToken) {
            console.error('[Server Token] No refresh token found')
            return null
        }

        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) {
            console.error('[Server Token] Refresh failed:', response.status)
            return null
        }

        const data = await response.json()
        
        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = data.data
            
            // ✅ 使用后端返回的过期时间，而不是写死的 30 分钟
            const accessMaxAge = expiresIn || 30 * 60 // 默认 30 分钟
            const refreshMaxAge = refreshExpiresIn || 7 * 24 * 60 * 60 // 默认 7 天
            
            console.log('[Server Token] Using backend expires:', {
                expiresIn: accessMaxAge,
                refreshExpiresIn: refreshMaxAge,
                expiresInMinutes: accessMaxAge / 60,
                refreshExpiresInDays: refreshMaxAge / 60 / 60 / 24
            })
            
            // 更新 Cookie
            cookieStore.set('accessToken', accessToken, {
                path: '/',
                maxAge: accessMaxAge,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            })

            if (newRefreshToken) {
                cookieStore.set('refreshToken', newRefreshToken, {
                    path: '/',
                    maxAge: refreshMaxAge,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                })
            }

            console.log('[Server Token] Token refreshed successfully')
            return accessToken
        }

        return null
    } catch (error) {
        console.error('[Server Token] Refresh error:', error)
        return null
    }
}

/**
 * 带认证的 Fetch - 自动处理 Token 刷新
 */
export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = await getAccessToken()
    
    console.log('[Server Token] fetchWithAuth called:', {
        url: url.substring(0, 100),
        hasToken: !!token,
        tokenLength: token?.length || 0
    })
    
    const headers = new Headers(options.headers || {})
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    } else {
        console.warn('[Server Token] No access token found! Request will be unauthenticated.')
    }
    // 只在 body 不是 FormData 时才设置 Content-Type
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    let response = await fetch(url, {
        ...options,
        headers,
    })

    // 如果 401，尝试刷新 token 并重试（只重试一次）
    if (response.status === 401 && !headers.has('X-Retry-After-Refresh')) {
        console.log('[Server Token] Got 401, attempting refresh...')
        const newToken = await refreshAccessToken()
        
        if (newToken) {
            headers.set('Authorization', `Bearer ${newToken}`)
            // 标记已重试，防止无限循环
            headers.set('X-Retry-After-Refresh', 'true')
            
            console.log('[Server Token] Retrying with new token...')
            response = await fetch(url, {
                ...options,
                headers,
            })
        }
    }

    return response
}
