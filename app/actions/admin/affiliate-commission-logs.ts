'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { refreshAccessToken } from '@/lib/api-utils'

export interface AdminCommissionLogResponse {
    id: number
    affiliateId: string
    orderId: number
    orderNumber: string
    changeType: string
    commissionAmount: number
    balanceBefore: number
    balanceAfter: number
    totalEarnedBefore: number
    totalEarnedAfter: number
    description?: string
    payoutStatusBefore?: string
    payoutStatusAfter?: string
    createdAt: string
}

export interface AdminCommissionLogsPageResponse {
    content: AdminCommissionLogResponse[]
    currentPage: number
    pageSize: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

/**
 * 管理员获取指定联盟成员的佣金流水日志（分页）
 */
export async function getAdminAffiliateCommissionLogs(
    affiliateId: string,
    page: number = 0,
    size: number = 20,
    retry = false
): Promise<AdminCommissionLogsPageResponse> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/${affiliateId}/commission-logs?page=${page}&size=${size}`
        
        console.log('[Admin Affiliate Commission Logs] Request URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('[Admin Affiliate Commission Logs] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Admin Affiliate Commission Logs] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Admin Affiliate Commission Logs] Token refreshed, retrying...')
                return getAdminAffiliateCommissionLogs(affiliateId, page, size, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Admin Affiliate Commission Logs] Backend error response:', errorText)
            throw new Error(`获取联盟成员佣金日志失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '获取联盟成员佣金日志失败')
        }

        return apiResponse.data || {
            content: [],
            currentPage: page,
            pageSize: size,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
        }
    } catch (error) {
        console.error('[Admin Affiliate Commission Logs] Error:', error)
        throw error
    }
}
