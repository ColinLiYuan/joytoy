'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { refreshAccessToken, clearTokens } from '@/lib/api-utils'

export interface CartItem {
    id: number
    productId: number
    productTitle: string
    productName: string
    productSku: string
    skuId: number
    productImage: string
    quantity: number
    unitPrice: number
    totalPrice: number
    color: string
    size: string
    material: string
    weight: string
}

export interface CartResponse {
    id: number
    cartToken: string
    sessionId: string
    userId: number | null
    userEmail: string | null
    userName: string
    status: string
    totalItems: number
    subtotalAmount: number
    discountAmount: number
    totalAmount: number
    currency: string
    createdAt: string
    updatedAt: string
    expiresAt: string
    itemCount: number
    items?: CartItem[]
}

export interface CartStatistics {
    totalCarts: number
    activeCarts: number
    convertedCarts: number
    abandonedCarts: number
    totalItems: number
    avgItemsPerCart: number
}

// 获取购物车列表
export async function getAdminCartList(params: {
    page?: number
    size?: number
    status?: string
    userId?: number
    sortBy?: string
}, retry = false): Promise<{ content: CartResponse[]; totalPages: number; totalElements: number }> {
    try {
        const {
            page = 0,
            size = 20,
            status = '',
            userId,
            sortBy = 'createdAt'
        } = params

        let token = (await cookies()).get('accessToken')?.value

        console.log('[Cart List] Token status:', {
            hasToken: !!token,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'NOT FOUND'
        })

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const queryParams = new URLSearchParams()
        queryParams.append('page', page.toString())
        queryParams.append('size', size.toString())
        queryParams.append('sortBy', sortBy)

        if (status) queryParams.append('status', status)
        if (userId) queryParams.append('userId', userId.toString())

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/list?${queryParams.toString()}`

        console.log('[Cart List] Request URL:', url)

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
        })

        console.log('[Cart List] Response status:', response.status)

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Cart List] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Cart List] Token refreshed, retrying...')
                return getAdminCartList(params, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch cart list: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch cart list')
        }

        return apiResponse.data
    } catch (error) {
        console.error('Server Action: Error fetching admin cart list:', error)
        throw error
    }
}

// 获取购物车详情
export async function getAdminCartDetail(cartId: number, retry = false): Promise<CartResponse> {
    try {
        let token = (await cookies()).get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/${cartId}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
        })

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Cart Detail] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Cart Detail] Token refreshed, retrying...')
                return getAdminCartDetail(cartId, true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch cart detail: ${response.status}`)
        }

        const apiResponse = await response.json()

        console.log('[Cart Detail] Full API Response:', JSON.stringify(apiResponse, null, 2))

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch cart detail')
        }

        return apiResponse.data
    } catch (error) {
        console.error('Server Action: Error fetching cart detail:', error)
        throw error
    }
}

// 获取购物车统计
export async function getAdminCartStatistics(retry = false): Promise<CartStatistics> {
    try {
        let token = (await cookies()).get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/statistics`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
        })

        // 401 且未重试过，则刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Cart Statistics] Token expired, refreshing...')
            const newToken = await refreshAccessToken()
            if (newToken) {
                console.log('[Cart Statistics] Token refreshed, retrying...')
                return getAdminCartStatistics(true)
            } else {
                throw new Error('Token refresh failed, please login again')
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch cart statistics: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch cart statistics')
        }

        return apiResponse.data
    } catch (error) {
        console.error('Server Action: Error fetching cart statistics:', error)
        throw error
    }
}

// 清空购物车
export async function clearAdminCart(cartId: number): Promise<void> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/${cartId}/clear`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to clear cart: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to clear cart')
        }
    } catch (error) {
        console.error('Server Action: Error clearing cart:', error)
        throw error
    }
}

// 废弃购物车
export async function abandonAdminCart(cartId: number): Promise<void> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/${cartId}/abandon`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to abandon cart: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to abandon cart')
        }
    } catch (error) {
        console.error('Server Action: Error abandoning cart:', error)
        throw error
    }
}

// 清理过期购物车
export async function cleanupExpiredAdminCarts(): Promise<{ cleanedCount: number; message: string }> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/cleanup/expired`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }

        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers,
        })

        if (!response.ok) {
            throw new Error(`Failed to cleanup expired carts: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to cleanup expired carts')
        }

        return apiResponse.data
    } catch (error) {
        console.error('Server Action: Error cleaning up expired carts:', error)
        throw error
    }
}
