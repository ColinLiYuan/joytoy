// lib/server-token-utils.ts
// 专用于 Server Action 的 Token 处理工具
import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'

const TOKEN_REFRESH_URL = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`

/**
 * 从 cookie 获取 access token
 */
export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('accessToken')?.value
}

/**
 * 从 cookie 获取 refresh token
 */
export async function getRefreshTokenValue(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get('refreshToken')?.value
}

/**
 * 刷新 access token
 * @returns 新的 access token, 失败返回 null
 */
export async function refreshAccessToken(): Promise<string | null> {
    try {
        const refreshTokenValue = await getRefreshTokenValue()
        if (!refreshTokenValue) {
            console.log('[Server Token] No refresh token found')
            return null
        }

        console.log('[Server Token] Refreshing access token...')
        const response = await fetch(TOKEN_REFRESH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        })

        if (!response.ok) {
            console.log('[Server Token] Refresh failed, status:', response.status)
            const errorText = await response.text()
            console.error('[Server Token] Refresh error response:', errorText)
            return null
        }

        const result = await response.json()
        console.log('[Server Token] Refresh response:', JSON.stringify(result, null, 2))
        
        if (result.success && result.data) {
            const { accessToken, refreshToken: newRefreshToken } = result.data
            
            console.log('[Server Token] Extracted accessToken:', accessToken ? 'YES' : 'NO')
            console.log('[Server Token] Extracted refreshToken:', newRefreshToken ? 'YES' : 'NO')
            
            if (accessToken) {
                console.log('[Server Token] Token refreshed successfully')
                // 更新 cookie（同时更新 accessToken 和 refreshToken）
                const cookieStore = await cookies()
                cookieStore.set('accessToken', accessToken, {
                    path: '/',
                    maxAge: 1800, // 30分钟
                })
                
                // 如果后端返回了新的 refreshToken，也要更新
                if (newRefreshToken) {
                    console.log('[Server Token] Updating refresh token')
                    cookieStore.set('refreshToken', newRefreshToken, {
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60, // 7天
                    })
                }
                
                return accessToken
            } else {
                console.log('[Server Token] No access token in response')
            }
        } else {
            console.log('[Server Token] Refresh response not success or no data')
        }

        return null
    } catch (error) {
        console.error('[Server Token] Refresh error:', error)
        return null
    }
}

/**
 * 执行带认证的请求,自动处理 401 刷新重试
 * @param url 请求地址
 * @param options fetch options (会自动添加 Authorization header)
 * @param retryCount 当前重试次数 (内部使用)
 */
export async function fetchWithAuth(
    url: string,
    options: RequestInit,
    retryCount = 0
): Promise<Response> {
    const token = await getAccessToken()
    
    console.log('[Server Token] fetchWithAuth called for:', url)
    console.log('[Server Token] Token exists:', !!token)
    console.log('[Server Token] Token preview:', token ? `${token.substring(0, 20)}...` : 'none')
    console.log('[Server Token] Retry count:', retryCount)

    // 构建 headers
    const headers = new Headers(options.headers || {})
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        console.log('[Server Token] Authorization header set')
    } else {
        console.log('[Server Token] WARNING: No token available!')
    }
    // 只有在 body 不是 FormData 且没有设置 Content-Type 时,才设置为 application/json
    // FormData 需要浏览器自动设置 Content-Type (包含 boundary)
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    
    console.log('[Server Token] Final headers:', Object.fromEntries(headers.entries()))

    const response = await fetch(url, {
        ...options,
        headers,
    })

    // 如果 401 且有 refresh token,尝试刷新后重试一次
    if (response.status === 401 && retryCount === 0) {
        console.log('[Server Token] Got 401, trying refresh...')
        const newToken = await refreshAccessToken()
        
        if (newToken) {
            console.log('[Server Token] Refreshed, retrying...')
            // 用新 token 重试
            return fetchWithAuth(url, options, retryCount + 1)
        } else {
            console.log('[Server Token] Refresh failed')
        }
    }

    return response
}
