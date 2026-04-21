'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'

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

/**
 * 服务端刷新 Token
 */
async function refreshServerToken(): Promise<string | null> {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (!refreshToken) {
        console.warn('[Refresh Server Token] No refresh token found')
        return null
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
        console.log('[Refresh Server Token] Refreshing...')

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        })

        if (!response.ok) {
            console.error('[Refresh Server Token] Failed with status:', response.status)
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

            console.log('[Refresh Server Token] Success')
            return accessToken
        }
        return null
    } catch (e) {
        console.error('[Refresh Server Token] Error:', e)
        return null
    }
}

export async function getAdminAffiliateStats(retry = false): Promise<AffiliateStats> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Get Admin Affiliate Stats] Token expired, refreshing...')
            const newToken = await refreshServerToken()
            if (newToken) {
                console.log('[Get Admin Affiliate Stats] Token refreshed, retrying...')
                return getAdminAffiliateStats(true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Get Admin Affiliate Stats] Backend error response:', errorText)
            throw new Error(`获取统计数据失败: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        
        if (!data.success) {
            throw new Error(data.message || '获取统计数据失败')
        }

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

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = new URL(`${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/list`)
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

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Get Admin Affiliate List] Token expired, refreshing...')
            const newToken = await refreshServerToken()
            if (newToken) {
                console.log('[Get Admin Affiliate List] Token refreshed, retrying...')
                return getAdminAffiliateList(params, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Get Admin Affiliate List] Backend error response:', errorText)
            throw new Error(`获取联盟列表失败: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        
        if (!data.success) {
            throw new Error(data.message || '获取联盟列表失败')
        }

        return data.data
    } catch (error) {
        console.error('获取联盟列表失败:', error)
        throw error
    }
}
