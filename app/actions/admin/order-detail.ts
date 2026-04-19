'use server'

import { cookies } from 'next/headers'
import { SERVER_CONFIG } from '@/lib/api-config'
import { OrderResponse } from '@/types/order'

export async function getOrderDetail(orderNumber: string): Promise<OrderResponse> {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const response = await fetch(`${SERVER_CONFIG.baseURL}/api/orders/${orderNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(`获取订单详情失败: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('获取订单详情失败:', error)
        throw error
    }
}
