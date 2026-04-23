'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { PageResponse } from '@/types/api'
import { PayoutResponse } from '@/types/affiliate'

// ==================== 类型定义 ====================

export interface DashboardStats {
    todaySales: number
    totalOrders: number
    totalProducts: number
    totalUsers: number
    salesChange: string
    ordersChange: string
    productsChange: string
    usersChange: string
}

export interface RecentOrder {
    id: string
    customer: string
    amount: number
    status: string
    date: string
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
    settledAmount: number;       // Settled amount (over 30 days)
    pendingAmount: number;       // Pending amount (within 30 days)
    currentBalance: number;      // Current total balance
    totalPaid: number;           // Total paid amount
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
        console.warn('[Admin Action] No refresh token found')
        return null
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
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
        console.error('[Admin Action] Refresh error:', e)
        return null
    }
}

// ==================== 仪表盘 (Dashboard) Actions ====================

export async function getDashboardStats(retry = false): Promise<DashboardStats> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        // 并行获取所有统计数据
        const [ordersRes, productsRes, usersRes] = await Promise.all([
            fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/order/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }),
            fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/product/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            }),
            fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/user/list?page=0&size=1000`, {
                cache: 'no-store',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            })
        ])

        if (ordersRes.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getDashboardStats(true)
            // ✅ Token 刷新失败，返回默认值而不是抛出错误
            return {
                todaySales: 0,
                totalOrders: 0,
                totalProducts: 0,
                totalUsers: 0,
                salesChange: '+0%',
                ordersChange: '+0%',
                productsChange: '+0%',
                usersChange: '+0%'
            }
        }

        const ordersData = await ordersRes.json()
        const productsData = await productsRes.json()
        const usersData = await usersRes.json()

        const orders = ordersData.success ? ordersData.data.content || [] : []
        const products = productsData.success ? productsData.data.content || [] : []
        const users = usersData.success ? usersData.data.content || [] : []

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todayOrders = orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt)
            return orderDate >= today
        })
        
        const todaySales = todayOrders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0)

        return {
            todaySales,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: users.length,
            salesChange: '+12%',
            ordersChange: '+8%',
            productsChange: '+3%',
            usersChange: '+5%'
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw error
    }
}

export async function getRecentOrders(limit: number = 5, retry = false): Promise<RecentOrder[]> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/order/list?page=0&size=${limit}`, {
            cache: 'no-store',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getRecentOrders(limit, true)
            // ✅ Token 刷新失败，返回空数组
            return []
        }

        if (!response.ok) return []

        const data = await response.json()
        if (!data.success || !data.data?.content) return []

        return data.data.content.map((order: any) => ({
            id: `#${order.orderNumber || order.id}`,
            customer: `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || '未知客户',
            amount: order.totalAmount || 0,
            status: order.status || '待处理',
            date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('zh-CN') : '-'
        }))
    } catch (error) {
        console.error('Error fetching recent orders:', error)
        return []
    }
}

// ==================== 联盟管理 (Affiliate) Actions ====================

export async function getAdminAffiliateStats(retry = false): Promise<AffiliateStats> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/stats`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateStats(true)
            // ✅ Token 刷新失败，返回默认值
            return {
                totalAffiliates: 0,
                activeAffiliates: 0,
                totalCommission: 0,
                totalClicks: 0,
                totalConversions: 0,
                conversionRate: 0,
                settledAmount: 0,
                pendingAmount: 0,
                currentBalance: 0,
                totalPaid: 0
            }
        }

        if (!response.ok) throw new Error(`获取统计数据失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取统计数据失败')

        return data.data
    } catch (error) {
        console.error('获取联盟统计数据失败:', error)
        throw error
    }
}

export async function getAdminAffiliateList(params: { page: number; size: number }, retry = false): Promise<{
    content: AffiliateUser[];
    totalPages: number;
    totalElements: number;
}> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = new URL(`${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/list`)
        url.searchParams.append('page', params.page.toString())
        url.searchParams.append('size', params.size.toString())

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateList(params, true)
            // ✅ Token 刷新失败，返回空列表
            return { content: [], totalPages: 0, totalElements: 0 }
        }

        if (!response.ok) throw new Error(`获取联盟列表失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取联盟列表失败')

        return data.data
    } catch (error) {
        console.error('获取联盟列表失败:', error)
        throw error
    }
}

export async function getAdminAffiliateCommissionLogs(
    affiliateId: string,
    page: number = 0,
    size: number = 20,
    retry = false
): Promise<AdminCommissionLogsPageResponse> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) throw new Error('未登录或登录已过期')

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/${affiliateId}/commission-logs?page=${page}&size=${size}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            cache: 'no-store',
        })

        if (response.status === 401 && !retry) {
            const newToken = await refreshServerToken()
            if (newToken) return getAdminAffiliateCommissionLogs(affiliateId, page, size, true)
            // ✅ Token 刷新失败，返回空列表
            return {
                content: [],
                currentPage: page,
                pageSize: size,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            }
        }

        if (!response.ok) throw new Error(`获取联盟成员佣金日志失败: ${response.status}`)

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

export async function getAllPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() })
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts?${queryParams.toString()}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            cache: 'no-store',
        })

        if (!response.ok) throw new Error(`Failed to fetch payouts: ${response.status}`)

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to fetch payouts')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Payouts] Error:', error)
        throw error
    }
}

export async function approvePayout(payoutId: number, transactionId?: string, adminNote?: string): Promise<PayoutResponse> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts/${payoutId}/approve`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionId, adminNote }),
        })

        if (!response.ok) throw new Error(`Failed to approve payout: ${response.status}`)

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to approve payout')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Approve Payout] Error:', error)
        throw error
    }
}

export async function rejectPayout(payoutId: number, adminNote: string): Promise<PayoutResponse> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) throw new Error('Unauthorized - No token provided')

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts/${payoutId}/reject`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminNote }),
        })

        if (!response.ok) throw new Error(`Failed to reject payout: ${response.status}`)

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to reject payout')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Reject Payout] Error:', error)
        throw error
    }
}
