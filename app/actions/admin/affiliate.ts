'use server'

import { cookies } from 'next/headers'
import { SERVER_CONFIG } from '@/lib/api-config'

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

export async function getAdminAffiliateStats(): Promise<AffiliateStats> {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const response = await fetch(`${SERVER_CONFIG.baseURL}/api/admin/affiliate/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(`获取统计数据失败: ${response.status}`)
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

export async function getAdminAffiliateList(params: { page: number; size: number }): Promise<{
    content: AffiliateUser[];
    totalPages: number;
    totalElements: number;
}> {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = new URL(`${SERVER_CONFIG.baseURL}/api/admin/affiliate/list`)
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

        if (!response.ok) {
            throw new Error(`获取联盟列表失败: ${response.status}`)
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
