'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { PageResponse } from '@/types/api'
import { PayoutResponse } from '@/types/affiliate'

// ==================== 类型定义 ====================

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

export interface PayoutRequest {
    amount: number
    paypalEmail: string
}

interface AffiliateUser {
    id: number;
    affiliateId: string;
    userId: number | null;
    userEmail: string;
    userName: string;
    commissionRate: number | null;
    affiliateCodes: string[];
    totalClicks: number;
    totalOrders: number;
    totalEarnings: number;
    currentBalance: number;
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
    createdAt: string | null;
    updatedAt: string | null;
}

interface AffiliateStats {
    totalAffiliates: number;
    activeAffiliates: number;
    totalClicks: number;
    totalConversions: number;
    totalCommission: number;
    conversionRate: number;
}

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

// ==================== 公共工具函数 ====================

/**
 * 服务端刷新 Token
 */
async function refreshServerToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        console.warn('[Affiliate Action] No refresh token found')
        return null
    }

    try {
        const url = `/api/V1/users/refresh`
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (!response.ok) return null

        const data = await response.json()

        if (data.success && data.data) {
            const { accessToken, refreshToken: newRefresh } = data.data

            cookieStore.set('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 60
            })

            if (newRefresh) {
                cookieStore.set('refreshToken', newRefresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60
                })
            }

            return accessToken
        }
        return null
    } catch (e) {
        console.error('[Affiliate Action] Refresh error:', e)
        return null
    }
}

// ==================== 用户端 (Affiliate) Actions ====================

/**
 * 获取联盟成员的佣金流水日志（分页）
 */
export async function getAffiliateCommissionLogs(
    page: number = 0,
    size: number = 20,
    retry = false
): Promise<CommissionLogsPageResponse> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = `/api/V1/affiliate/commission-logs?page=${page}&size=${size}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAffiliateCommissionLogs(page, size, true)
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`获取佣金日志失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.message || '获取佣金日志失败')

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

/**
 * 申请提现
 */
export async function requestAffiliatePayout(request: PayoutRequest, retry = false): Promise<any> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = `/api/V1/affiliate/payout/request`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return requestAffiliatePayout(request, true)
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`提现申请失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.message || '提现申请失败')

        return apiResponse.data
    } catch (error) {
        console.error('[Affiliate Payout] Error:', error)
        throw error
    }
}

// ==================== 管理端 (Admin) Actions ====================

/**
 * 获取联盟统计数据
 */
export async function getAdminAffiliateStats(retry = false): Promise<AffiliateStats> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const response = await fetch(`/api/admin/V1/affiliate/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateStats(true)
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`获取统计数据失败: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取统计数据失败')

        return data.data
    } catch (error) {
        console.error('获取联盟统计数据失败:', error)
        throw error
    }
}

/**
 * 获取联盟成员列表
 */
export async function getAdminAffiliateList(params: { page: number; size: number }, retry = false): Promise<{
    content: AffiliateUser[];
    totalPages: number;
    totalElements: number;
}> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = new URL(`/api/admin/V1/affiliate/list`)
        url.searchParams.append('page', params.page.toString())
        url.searchParams.append('size', params.size.toString())

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateList(params, true)
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`获取联盟列表失败: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取联盟列表失败')

        return data.data
    } catch (error) {
        console.error('获取联盟列表失败:', error)
        throw error
    }
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

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = `/api/admin/V1/affiliate/${affiliateId}/commission-logs?page=${page}&size=${size}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateCommissionLogs(affiliateId, page, size, true)
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`获取联盟成员佣金日志失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.message || '获取联盟成员佣金日志失败')

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

/**
 * 获取所有提现记录（管理端）
 */
export async function getAllPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        })

        const url = `/api/admin/V1/affiliate/payouts?${queryParams.toString()}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to fetch payouts: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to fetch payouts')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Payouts] Error:', error)
        throw error
    }
}

/**
 * 审核通过提现
 */
export async function approvePayout(payoutId: number, transactionId?: string, adminNote?: string): Promise<PayoutResponse> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const url = `/api/admin/V1/affiliate/payouts/${payoutId}/approve`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transactionId, adminNote }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to approve payout: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to approve payout')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Approve Payout] Error:', error)
        throw error
    }
}

/**
 * 拒绝提现
 */
export async function rejectPayout(payoutId: number, adminNote: string): Promise<PayoutResponse> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const url = `/api/admin/V1/affiliate/payouts/${payoutId}/reject`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ adminNote }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to reject payout: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to reject payout')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Reject Payout] Error:', error)
        throw error
    }
}
