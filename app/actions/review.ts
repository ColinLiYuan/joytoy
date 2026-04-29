'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { ReviewListResponse } from '@/types/review'

// API 路径常量
const API_PATHS = {
  REVIEW_LIST: `/api/V1/review/list`,
  REVIEW_CREATE_AUTHENTICATED: `/api/V1/review/authenticated`,
  REVIEW_CREATE_GUEST: `/api/V1/review/guest`,
  ADMIN_REVIEW_LIST: `/api/admin/V1/review/list`,
  ADMIN_REVIEW_AUDIT: `/api/admin/V1/review`,
} as const

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
        console.log('[Create Review] Calling authenticated URL:', API_PATHS.REVIEW_CREATE_AUTHENTICATED)

        const response = await fetchWithAuth(API_PATHS.REVIEW_CREATE_AUTHENTICATED, {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify(reviewData),
        })

        console.log('[Create Review] Response status:', response.status)

        if (!response.ok) {
            console.log('[Create Review] Failed:', response.status)
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

/**
 * 游客创建评论
 */
export async function createReviewAsGuest(reviewData: {
    productId: number
    rating: number
    title: string
    content: string
    authorName: string
    email: string
}): Promise<boolean> {
    try {
        console.log('[Create Review Guest] Calling guest URL:', API_PATHS.REVIEW_CREATE_GUEST)

        const response = await fetch(API_PATHS.REVIEW_CREATE_GUEST, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })

        console.log('[Create Review Guest] Response status:', response.status)

        if (!response.ok) {
            const errorResult = await response.json()
            console.error('[Create Review Guest] Error:', errorResult)
            return false
        }

        const result = await response.json()
        console.log('[Create Review Guest] Response:', result)
        return result.success === true
    } catch (error) {
        console.error('[Create Review Guest] Error:', error)
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
        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.status) queryParams.append('status', params.status)

        const url = `${API_PATHS.ADMIN_REVIEW_LIST}?${queryParams.toString()}`
        console.log('[Admin Get Reviews] Calling URL:', url)

        const response = await fetchWithAuth(url, {
            cache: 'no-store',
        })

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
        const url = `${API_PATHS.ADMIN_REVIEW_AUDIT}/${reviewId}/audit`
        console.log('[Admin Audit Review] Calling URL:', url)

        const response = await fetchWithAuth(url, {
            method: 'PUT',
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
