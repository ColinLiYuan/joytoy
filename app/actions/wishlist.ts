'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { WishlistRequest } from '@/types/wishlist'

// API 路径常量
const API_PATHS = {
  WISHLIST: `${BACKEND_CONFIG.baseURL}/api/V1/wishlist`,
  TOKEN_REFRESH: `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`,
} as const

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

/**
 * 添加商品到心愿单
 */
export async function addToWishlist(wishlistData: WishlistRequest): Promise<boolean> {
    try {
        const cookieStore = await cookies()
        
        // 获取所有 Cookie
        const allCookies = cookieStore.getAll()
        console.log('[Add to Wishlist] All cookie names:', allCookies.map(c => c.name))
        
        // 尝试读取 accessToken
        let token = cookieStore.get('accessToken')?.value
        console.log('[Add to Wishlist] Initial token status:', token ? 'FOUND' : 'NOT FOUND')
        console.log('[Add to Wishlist] Product data:', wishlistData)

        // 如果没有 token，尝试刷新
        if (!token) {
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                console.log('[Add to Wishlist] No access token, trying to refresh...')
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    token = newToken
                    console.log('[Add to Wishlist] Token refreshed successfully')
                    // 更新 Cookie
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800, // 30分钟
                    })
                }
            }
        }

        if (!token) {
            console.log('[Add to Wishlist] No token found in cookies after refresh attempt')
            return false
        }

        const url = API_PATHS.WISHLIST
        console.log('[Add to Wishlist] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(wishlistData),
        })

        console.log('[Add to Wishlist] Response status:', response.status)

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Add to Wishlist] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Add to Wishlist] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    // 重试请求
                    response = await fetch(url, {
                        cache: 'no-store',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                        body: JSON.stringify(wishlistData),
                    })

                    console.log('[Add to Wishlist] Retry response status:', response.status)
                }
            }
        }

        if (response.status === 401) {
            console.log('[Add to Wishlist] Token expired or invalid after refresh')
            return false
        }

        const result = await response.json()
        console.log('[Add to Wishlist] Response:', result)
        return result.success === true
    } catch (error) {
        console.error('[Add to Wishlist] Error:', error)
        return false
    }
}

/**
 * 从心愿单移除商品
 */
export async function removeFromWishlist(productId: number): Promise<boolean> {
    try {
        const cookieStore = await cookies()
        
        // 获取所有 Cookie
        const allCookies = cookieStore.getAll()
        console.log('[Remove from Wishlist] All cookie names:', allCookies.map(c => c.name))
        
        // 尝试读取 accessToken
        let token = cookieStore.get('accessToken')?.value
        console.log('[Remove from Wishlist] Initial token status:', token ? 'FOUND' : 'NOT FOUND')
        console.log('[Remove from Wishlist] Product ID:', productId)

        // 如果没有 token，尝试刷新
        if (!token) {
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                console.log('[Remove from Wishlist] No access token, trying to refresh...')
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    token = newToken
                    console.log('[Remove from Wishlist] Token refreshed successfully')
                    // 更新 Cookie
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800, // 30分钟
                    })
                }
            }
        }

        if (!token) {
            console.log('[Remove from Wishlist] No token found in cookies after refresh attempt')
            return false
        }

        const url = `${API_PATHS.WISHLIST}?productId=${productId}`
        console.log('[Remove from Wishlist] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        console.log('[Remove from Wishlist] Response status:', response.status)

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Remove from Wishlist] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Remove from Wishlist] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    // 重试请求
                    response = await fetch(url, {
                        cache: 'no-store',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                    })

                    console.log('[Remove from Wishlist] Retry response status:', response.status)
                }
            }
        }

        if (response.status === 401) {
            console.log('[Remove from Wishlist] Token expired or invalid after refresh')
            return false
        }

        const result = await response.json()
        console.log('[Remove from Wishlist] Response:', result)
        return result.success === true
    } catch (error) {
        console.error('[Remove from Wishlist] Error:', error)
        return false
    }
}
