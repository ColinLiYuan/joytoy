'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { OrderResponse } from '@/types/order'

// API 路径常量
const API_PATHS = {
  ORDER_LIST: `${BACKEND_CONFIG.baseURL}/api/V1/orders`,
  TOKEN_REFRESH: `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`,
} as const

/**
 * 获取用户订单列表
 * @returns 订单列表，如果未登录返回 null，如果 session 过期返回 null
 */
export async function getUserOrders(page = 0, size = 20, retry = false): Promise<OrderResponse[] | null> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        if (!token) {
            console.log('[Get User Orders] No token found, trying to refresh...')
            
            // 尝试刷新 Token
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    token = newToken
                    console.log('[Get User Orders] Token refreshed successfully')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })
                }
            }
        }

        if (!token) {
            console.log('[Get User Orders] No token available, returning null')
            return null
        }

        const url = `${API_PATHS.ORDER_LIST}?page=${page}&size=${size}`
        console.log('[Get User Orders] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401 && !retry) {
            console.log('[Get User Orders] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Get User Orders] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    // 重试请求
                    response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                    })

                    console.log('[Get User Orders] Retry response status:', response.status)
                }
            }
        }

        if (!response.ok) {
            console.error('[Get User Orders] Response not ok:', response.status)
            return null
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            console.error('[Get User Orders] API response not success:', apiResponse.message)
            // 检查是否是认证相关错误
            const errorMsg = apiResponse.message?.toLowerCase() || ''
            if (errorMsg.includes('session') || 
                errorMsg.includes('login') || 
                errorMsg.includes('auth') || 
                errorMsg.includes('unauthorized') ||
                errorMsg.includes('登录') ||
                errorMsg.includes('expired')) {
                return null
            }
            return null
        }

        return apiResponse.data || []
    } catch (error) {
        console.error('[Get User Orders] Error:', error)
        return null
    }
}

/**
 * 刷新 Token
 */
async function refreshToken(refreshTokenValue: string): Promise<string | null> {
    try {
        console.log('[Refresh Token] Calling refresh endpoint...')
        const response = await fetch(API_PATHS.TOKEN_REFRESH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        })

        console.log('[Refresh Token] Response status:', response.status)

        if (!response.ok) {
            console.log('[Refresh Token] Failed, status:', response.status)
            return null
        }

        const result = await response.json()
        console.log('[Refresh Token] Response:', result)
        
        if (result.success && result.data?.accessToken) {
            console.log('[Refresh Token] Success, new token length:', result.data.accessToken.length)
            return result.data.accessToken
        }

        console.log('[Refresh Token] No access token in response')
        return null
    } catch (error) {
        console.error('[Refresh Token] Error:', error)
        return null
    }
}
