'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { ReviewListResponse } from '@/types/review'

export async function getAdminReviews(params: {
    page: number
    size: number
    status?: string
}): Promise<ReviewListResponse> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.status) queryParams.append('status', params.status)

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/review/list?${queryParams.toString()}`

        console.log('Server Action: Fetching reviews from:', url)

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
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
        console.error('Server Action: Error fetching reviews:', error)
        throw error
    }
}

export async function auditReview(reviewId: string | number, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/review/${reviewId}/audit`

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
        console.error('Server Action: Error auditing review:', error)
        throw error
    }
}
