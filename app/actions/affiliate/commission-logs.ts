'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'

export interface CommissionLogResponse {
    id: number
    orderNumber: string
    changeType: string
    commissionAmount: number
    balanceBefore: number
    balanceAfter: number
    totalEarnedBefore: number
    totalEarnedAfter: number
    description?: string
    createdAt: string
}

export interface CommissionLogsPageResponse {
    content: CommissionLogResponse[]
    currentPage: number
    pageSize: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

/**
 * 服务端刷新 Token
 */
async function refreshServerToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        console.warn('[Affiliate Refresh Token] No refresh token found')
        return null
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
        console.log('[Affiliate Refresh Token] Refreshing...')

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (!response.ok) {
            console.error('[Affiliate Refresh Token] Failed with status:', response.status)
            return null
        }

        const data = await response.json()

        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefresh } = data.data

            // 更新 Cookie
            cookieStore.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60 // 30分钟
            })

            if (newRefresh) {
                cookieStore.set('refreshToken', newRefresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 // 7天
                })
            }

            console.log('[Affiliate Refresh Token] Success')
            return accessToken
        }
        return null
    } catch (e) {
        console.error('[Affiliate Refresh Token] Error:', e)
        return null
    }
}

/**
 * 获取联盟成员的佣金流水日志（分页）
 */
export async function getAffiliateCommissionLogs(
    page: number = 0,
    size: number = 20,
    retry = false
): Promise<CommissionLogsPageResponse> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/affiliate/commission-logs?page=${page}&size=${size}`
        
        console.log('[Affiliate Commission Logs] Request URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('[Affiliate Commission Logs] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Affiliate Commission Logs] Token expired, refreshing...')
            const newToken = await refreshServerToken()
            if (newToken) {
                console.log('[Affiliate Commission Logs] Token refreshed, retrying...')
                return getAffiliateCommissionLogs(page, size, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Affiliate Commission Logs] Backend error response:', errorText)
            throw new Error(`获取佣金日志失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '获取佣金日志失败')
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
        console.error('[Affiliate Commission Logs] Error:', error)
        throw error
    }
}
