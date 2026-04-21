'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG, ADMIN_CONFIG } from '@/lib/api-config'
import { refreshAccessToken, clearTokens } from '@/lib/api-utils'
import { OrderResponse } from '@/types/order'

export async function getOrderDetail(orderNumber: string, retry = false): Promise<OrderResponse> {
    let token = (await cookies()).get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_order}/${orderNumber}`
        
        console.log('[Order Detail] Request URL:', url)
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        console.log('[Order Detail] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Order Detail] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Order Detail] Token refreshed, retrying...')
                return getOrderDetail(orderNumber, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Order Detail] Backend error response:', errorText)
            throw new Error(`获取订单详情失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '获取订单详情失败')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Order Detail] Error:', error)
        throw error
    }
}
