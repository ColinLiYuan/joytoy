'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { ReviewListResponse } from '@/types/review'

// API 路径常量
const API_PATHS = {
  REVIEW_LIST: `${BACKEND_CONFIG.baseURL}/api/V1/review/list`,
  REVIEW_CREATE: `${BACKEND_CONFIG.baseURL}/api/V1/review`,
  ADMIN_REVIEW_LIST: `${BACKEND_CONFIG.baseURL}/api/admin/V1/review/list`,
  ADMIN_REVIEW_AUDIT: `${BACKEND_CONFIG.baseURL}/api/admin/V1/review`,
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

// ==================== 用户端功能 ====================

/**
 * 用户创建评论
 */
export async function createReview(reviewData: {
    productId: number
    rating: number
    title: string
    content: string
    authorName: string
    email?: string
}): Promise<boolean> {
    try {
        const cookieStore = await cookies()
        
        // 获取所有 Cookie
        const allCookies = cookieStore.getAll()
        console.log('[Create Review] All cookie names:', allCookies.map(c => c.name))
        
        // 尝试读取 accessToken
        let token = cookieStore.get('accessToken')?.value
        console.log('[Create Review] Initial token status:', token ? 'FOUND' : 'NOT FOUND')
        console.log('[Create Review] Review data:', reviewData)

        // 如果没有 token，尝试刷新
        if (!token) {
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                console.log('[Create Review] No access token, trying to refresh...')
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    token = newToken
                    console.log('[Create Review] Token refreshed successfully')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })
                }
            }
        }

        const url = API_PATHS.REVIEW_CREATE
        console.log('[Create Review] Calling URL:', url)

        // 构建 headers，如果有 token 就加上 Authorization
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        let response = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers,
            body: JSON.stringify(reviewData),
        })

        console.log('[Create Review] Response status:', response.status)

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Create Review] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Create Review] Token refreshed, retrying...')
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
                        body: JSON.stringify(reviewData),
                    })

                    console.log('[Create Review] Retry response status:', response.status)
                }
            }
        }

        if (response.status === 401) {
            console.log('[Create Review] Token expired or invalid after refresh')
            return false
        }

        const result = await response.json()
        console.log('[Create Review] Response:', result)
        return result.success === true
    } catch (error) {
        console.error('[Create Review] Error:', error)
        return false
    }
}

// ==================== 管理端功能 ====================

/**
 * 获取管理端评论列表
 */
export async function getAdminReviews(params: {
    page: number
    size: number
    status?: string
}): Promise<ReviewListResponse> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        // 如果没有 token，尝试刷新
        if (!token) {
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                console.log('[Admin Get Reviews] No access token, trying to refresh...')
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    token = newToken
                    console.log('[Admin Get Reviews] Token refreshed successfully')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })
                }
            }
        }

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.status) queryParams.append('status', params.status)

        const url = `${API_PATHS.ADMIN_REVIEW_LIST}?${queryParams.toString()}`
        console.log('[Admin Get Reviews] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Admin Get Reviews] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Admin Get Reviews] Token refreshed, retrying...')
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

                    console.log('[Admin Get Reviews] Retry response status:', response.status)
                }
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.status}`)
        }

        const apiResponse = await response.json()

        return apiResponse.data || apiResponse || {
            content: [],
            currentPage: params.page,
            pageSize: params.size,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
        }
    } catch (error) {
        console.error('[Admin Get Reviews] Error:', error)
        throw error
    }
}

/**
 * 审核评论
 */
export async function auditReview(reviewId: string | number, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${API_PATHS.ADMIN_REVIEW_AUDIT}/${reviewId}/audit`
        console.log('[Admin Audit Review] Calling URL:', url)

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`审核评论失败: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error('[Admin Audit Review] Error:', error)
        throw error
    }
}
