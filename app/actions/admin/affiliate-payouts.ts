// app/actions/admin/affiliate-payouts.ts
'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { PageResponse } from '@/types/api'
import { PayoutResponse } from '@/types/affiliate'

/**
 * 获取所有提现记录（管理端）
 */
export async function getAllPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value
        
        if (!token) {
            throw new Error('Unauthorized - No token provided')
        }

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        })

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts?${queryParams.toString()}`
        
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
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to fetch payouts')
        }

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
        
        if (!token) {
            throw new Error('Unauthorized - No token provided')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts/${payoutId}/approve`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transactionId,
                adminNote
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to approve payout: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to approve payout')
        }

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
        
        if (!token) {
            throw new Error('Unauthorized - No token provided')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/payouts/${payoutId}/reject`
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                adminNote
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to reject payout: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to reject payout')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Reject Payout] Error:', error)
        throw error
    }
}
