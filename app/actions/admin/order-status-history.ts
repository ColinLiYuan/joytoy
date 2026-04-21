'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG, ADMIN_CONFIG } from '@/lib/api-config'
import { refreshAccessToken } from '@/lib/api-utils'

export interface OrderStatusLog {
    id: number
    orderId: number
    orderNumber: string
    oldStatus?: string
    newStatus: string
    changedBy?: string
    reason?: string
    affiliatePayoutStatusBefore?: string
    affiliatePayoutStatusAfter?: string
    ipAddress?: string
    createdAt: string
}

export interface AffiliateCommissionLog {
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

/**
 * 获取订单状态变更历史
 */
export async function getOrderStatusLogs(orderNumber: string, retry = false): Promise<OrderStatusLog[]> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_order}/${orderNumber}/status-logs`
        
        console.log('[Order Status Logs] Request URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('[Order Status Logs] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Order Status Logs] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Order Status Logs] Token refreshed, retrying...')
                return getOrderStatusLogs(orderNumber, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Order Status Logs] Backend error response:', errorText)
            throw new Error(`获取订单状态历史失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '获取订单状态历史失败')
        }

        return apiResponse.data || []
    } catch (error) {
        console.error('[Order Status Logs] Error:', error)
        throw error
    }
}

/**
 * 获取订单佣金流水日志
 */
export async function getOrderCommissionLogs(orderNumber: string, retry = false): Promise<AffiliateCommissionLog[]> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_order}/${orderNumber}/commission-logs`
        
        console.log('[Order Commission Logs] Request URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('[Order Commission Logs] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Order Commission Logs] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Order Commission Logs] Token refreshed, retrying...')
                return getOrderCommissionLogs(orderNumber, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Order Commission Logs] Backend error response:', errorText)
            throw new Error(`获取订单佣金日志失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '获取订单佣金日志失败')
        }

        return apiResponse.data || []
    } catch (error) {
        console.error('[Order Commission Logs] Error:', error)
        throw error
    }
}
