'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { OrderListResponse } from '@/types/order'

export async function getAdminOrders(params: {
    page: number
    size: number
    keyword?: string
    status?: string
    orderNumber?: string
    guestEmail?: string
}): Promise<OrderListResponse> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.keyword) queryParams.append('keyword', params.keyword)
        if (params.status) queryParams.append('status', params.status)
        if (params.orderNumber) queryParams.append('orderNumber', params.orderNumber)
        if (params.guestEmail) queryParams.append('guestEmail', params.guestEmail)

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/list?${queryParams.toString()}`

        console.log('Server Action: Fetching orders from:', url)

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to fetch orders')
        }

        return apiResponse.data || {
            content: [],
            currentPage: params.page,
            pageSize: params.size,
            totalElements: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
        }
    } catch (error) {
        console.error('Server Action: Error fetching orders:', error)
        throw error
    }
}

export async function updateOrderStatus(orderId: number, trackingNumberOrStatus: string): Promise<void> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/orders/${orderId}/status`

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trackingNumber: trackingNumberOrStatus
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`更新订单状态失败: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error('Server Action: Error updating order status:', error)
        throw error
    }
}
