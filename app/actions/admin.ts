'use server'

import { fetchWithAuth, getAccessToken } from '@/lib/server-token-utils'
import { PageResponse } from '@/types/api'
import { PayoutResponse } from '@/types/affiliate'

// 兼容旧的 API，封装 fetchWithAuthGet 和 fetchWithAuthPost
const fetchWithAuthGet = (url: string) => fetchWithAuth(url, { method: 'GET', cache: 'no-store' })
const fetchWithAuthPost = (url: string, body: any) => fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(body)
})

// ==================== 类型定义 ====================

export interface DashboardStats {
    todaySales: number
    todayOrders: number
    yesterdaySales: number
    yesterdayOrders: number
    pendingOrders: number
    totalProducts: number
    totalUsers: number
    inventoryAlerts: number
    ordersByStatus: Record<string, number>
    salesTrend: { date: string; amount: number; orders: number }[]
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
    conversionRate: number;         // 转化率 (%)
    totalEarnings: number;          // 累计总收益
    currentBalance: number;         // 当前余额
    totalPaid: number;              // 累计已支付
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
    totalShipments: number;        // ✅ 新增：发货数
    totalVideoReviews: number;     // ✅ 新增：视频评测数
    totalBlogReviews: number;      // ✅ 新增：博客评测数
    settledAmount: number;         // Settled amount (over 30 days)
    pendingAmount: number;         // Pending amount (within 30 days)
    currentBalance: number;        // Current total balance
    totalPaid: number;             // Total paid amount
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

// ==================== 联盟活动类型定义 ====================

export interface AffiliateActivityResponse {
    id: number
    affiliateId: string
    activityType: string
    activityTypeName: string
    description: string
    trackingNumber: string
    linkUrl: string
    platform: string
    followerCount: number
    engagementRate: number
    expectedPublishDate: string
    actualPublishDate: string
    status: string
    adminNotes: string
    createdAt: string
    updatedAt: string
}

export interface AffiliateActivityRequest {
    affiliateId?: string
    activityType?: string
    description?: string
    trackingNumber?: string
    linkUrl?: string
    platform?: string
    followerCount?: number
    engagementRate?: number
    expectedPublishDate?: string
    actualPublishDate?: string
    status?: string
    adminNotes?: string
}

// ==================== 公共工具函数 ====================
// 已迁移到 lib/server-token-utils.ts

// ==================== 访问统计 (Analytics) Actions ====================

export interface AnalyticsOverview {
    todayPV: number
    yesterdayPV: number
    topPages: { page: string; count: number }[]
    hourly: number[]
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
    try {
        const response = await fetchWithAuthGet('/api/V1/analytics/admin/overview')

        if (!response.ok) throw new Error(`获取访问统计失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取访问统计失败')

        return data.data
    } catch (error) {
        console.error('Error fetching analytics overview:', error)
        return { todayPV: 0, yesterdayPV: 0, topPages: [], hourly: [] }
    }
}

// ==================== 仪表盘 (Dashboard) Actions ====================

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const response = await fetchWithAuthGet('/api/admin/V1/order/stats/dashboard')

        if (!response.ok) throw new Error(`获取仪表盘数据失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取仪表盘数据失败')

        return data.data
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            todaySales: 0,
            todayOrders: 0,
            yesterdaySales: 0,
            yesterdayOrders: 0,
            pendingOrders: 0,
            totalProducts: 0,
            totalUsers: 0,
            inventoryAlerts: 0,
            ordersByStatus: {},
            salesTrend: []
        }
    }
}

export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const response = await fetchWithAuthGet(`/api/admin/V1/order/list?page=0&size=${limit}`)

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

export async function getAdminAffiliateStats(): Promise<AffiliateStats> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const response = await fetchWithAuthGet(`/api/admin/V1/affiliate/stats`)

        if (!response.ok) throw new Error(`获取统计数据失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取统计数据失败')

        return data.data
    } catch (error) {
        console.error('获取联盟统计数据失败:', error)
        // 返回默认值
        return {
            totalAffiliates: 0,
            activeAffiliates: 0,
            totalCommission: 0,
            totalClicks: 0,
            totalConversions: 0,
            conversionRate: 0,
            totalShipments: 0,        // ✅ 新增默认值
            totalVideoReviews: 0,     // ✅ 新增默认值
            totalBlogReviews: 0,      // ✅ 新增默认值
            settledAmount: 0,
            pendingAmount: 0,
            currentBalance: 0,
            totalPaid: 0
        }
    }
}

export async function getAdminAffiliateList(params: { page: number; size: number }): Promise<{
    content: AffiliateUser[];
    totalPages: number;
    totalElements: number;
}> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = new URL(`/api/admin/V1/affiliate/list`)
        url.searchParams.append('page', params.page.toString())
        url.searchParams.append('size', params.size.toString())

        const response = await fetchWithAuthGet(url.toString())

        if (!response.ok) throw new Error(`获取联盟列表失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取联盟列表失败')

        return data.data
    } catch (error) {
        console.error('获取联盟列表失败:', error)
        // 返回空列表
        return { content: [], totalPages: 0, totalElements: 0 }
    }
}

export async function getAdminAffiliateCommissionLogs(
    affiliateId: string,
    page: number = 0,
    size: number = 20
): Promise<AdminCommissionLogsPageResponse> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/${affiliateId}/commission-logs?page=${page}&size=${size}`
        
        const response = await fetchWithAuthGet(url)

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
        // 返回空列表
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
}

export async function getAllPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const queryParams = new URLSearchParams({ page: page.toString(), size: size.toString() })
        const url = `/api/admin/V1/affiliate/payouts?${queryParams.toString()}`
        
        const response = await fetchWithAuthGet(url)

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
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/payouts/${payoutId}/approve`
        
        const response = await fetchWithAuthPost(url, { transactionId, adminNote })

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
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/payouts/${payoutId}/reject`
        
        const response = await fetchWithAuthPost(url, { adminNote })

        if (!response.ok) throw new Error(`Failed to reject payout: ${response.status}`)

        const apiResponse = await response.json()
        if (!apiResponse.success) throw new Error(apiResponse.error || 'Failed to reject payout')

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Reject Payout] Error:', error)
        throw error
    }
}

// ==================== 联盟活动管理 Actions ====================

/**
 * 获取联盟客活动列表
 */
export async function getAdminAffiliateActivities(
    affiliateId: string,
    page: number = 0,
    size: number = 20
): Promise<PageResponse<AffiliateActivityResponse>> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        // 首先获取详情，详情中包含活动列表
        const url = `/api/admin/V1/affiliate/${affiliateId}/detail`
        const response = await fetchWithAuthGet(url)

        if (!response.ok) throw new Error(`获取联盟客详情失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '获取联盟客详情失败')

        // 从详情中提取活动列表，并手动分页
        const activities = data.data.activities || []
        const start = page * size
        const end = start + size
        const paginatedActivities = activities.slice(start, end)

        return {
            content: paginatedActivities,
            currentPage: page,
            pageSize: size,
            totalElements: activities.length,
            totalPages: Math.ceil(activities.length / size),
            hasNext: end < activities.length,
            hasPrevious: page > 0
        }
    } catch (error) {
        console.error('[Admin Affiliate Activities] Error:', error)
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
}

/**
 * 创建联盟客活动
 */
export async function createAffiliateActivity(
    affiliateId: string,
    request: AffiliateActivityRequest
): Promise<AffiliateActivityResponse> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/${affiliateId}/activities`
        const response = await fetchWithAuthPost(url, request)

        if (!response.ok) throw new Error(`创建活动失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '创建活动失败')

        return data.data
    } catch (error) {
        console.error('[Admin Create Activity] Error:', error)
        throw error
    }
}

/**
 * 更新联盟客活动
 */
export async function updateAffiliateActivity(
    activityId: number,
    request: AffiliateActivityRequest
): Promise<AffiliateActivityResponse> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/activities/${activityId}`
        
        const response = await fetchWithAuth(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        })

        if (!response.ok) throw new Error(`更新活动失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '更新活动失败')

        return data.data
    } catch (error) {
        console.error('[Admin Update Activity] Error:', error)
        throw error
    }
}

/**
 * 删除联盟客活动
 */
export async function deleteAffiliateActivity(activityId: number): Promise<void> {
    const { BACKEND_CONFIG } = await import('@/lib/api-config')

    try {
        const url = `/api/admin/V1/affiliate/activities/${activityId}`
        const response = await fetchWithAuth(url, {
            method: 'DELETE',
        })

        if (!response.ok) throw new Error(`删除活动失败: ${response.status}`)

        const data = await response.json()
        if (!data.success) throw new Error(data.message || '删除活动失败')
    } catch (error) {
        console.error('[Admin Delete Activity] Error:', error)
        throw error
    }
}
