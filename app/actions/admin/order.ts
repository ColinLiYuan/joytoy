'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { OrderListResponse } from '@/types/order'
import { getRefreshToken } from '@/lib/token-utils'

export async function getAdminOrders(params: {
    page: number
    size: number
    keyword?: string
    status?: string
    orderNumber?: string
    guestEmail?: string
}, retry = false): Promise<OrderListResponse> {
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

        console.log('[Get Admin Orders] URL:', url)

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

        // 401 且未重试过，刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Get Admin Orders] Token expired, refreshing...')
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                })

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    if (refreshData.success && refreshData.data?.accessToken) {
                        const newToken = refreshData.data.accessToken
                        const newRefresh = refreshData.data.refreshToken || refreshToken
                        
                        // 手动写入 Cookie（Server Action 环境）
                        const cookieStore = await cookies()
                        cookieStore.set('accessToken', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30 // 30天
                        })
                        cookieStore.set('refreshToken', newRefresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        
                        console.log('[Get Admin Orders] Token refreshed, retrying...')
                        return getAdminOrders(params, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`获取订单列表失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || '获取订单列表失败')
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
        console.error('[Get Admin Orders] Error:', error)
        throw error
    }
}

export async function cancelAdminOrder(orderNumber: string, retry = false): Promise<void> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        // 直接调用后端 API - 使用订单号
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/cancel`

        console.log('[Cancel Admin Order] URL:', url)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        // 401 且未重试过，刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Cancel Admin Order] Token expired, refreshing...')
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                })

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    if (refreshData.success && refreshData.data?.accessToken) {
                        const newToken = refreshData.data.accessToken
                        const newRefresh = refreshData.data.refreshToken || refreshToken
                        
                        // 手动写入 Cookie（Server Action 环境）
                        const cookieStore = await cookies()
                        cookieStore.set('accessToken', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        cookieStore.set('refreshToken', newRefresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        
                        console.log('[Cancel Admin Order] Token refreshed, retrying...')
                        return cancelAdminOrder(orderNumber, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            const errorMessage = errorData?.message || errorData?.error || `取消订单失败: ${response.status}`
            throw new Error(errorMessage)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '取消订单失败')
        }
    } catch (error) {
        console.error('[Cancel Admin Order] Error:', error)
        throw error
    }
}

export async function updateOrderStatus(orderNumber: string, trackingNumberOrStatus: string, retry = false): Promise<void> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        // 直接调用后端 API - 使用 RESTful 路径和订单号
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/status`

        console.log('[Update Order Status] URL:', url)

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

        // 401 且未重试过，刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Update Order Status] Token expired, refreshing...')
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                })

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    if (refreshData.success && refreshData.data?.accessToken) {
                        const newToken = refreshData.data.accessToken
                        const newRefresh = refreshData.data.refreshToken || refreshToken
                        
                        // 手动写入 Cookie（Server Action 环境）
                        const cookieStore = await cookies()
                        cookieStore.set('accessToken', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        cookieStore.set('refreshToken', newRefresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        
                        console.log('[Update Order Status] Token refreshed, retrying...')
                        return updateOrderStatus(orderNumber, trackingNumberOrStatus, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`更新订单状态失败: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error('[Update Order Status] Error:', error)
        throw error
    }
}

/**
 * 结算订单佣金
 */
export async function settleOrderCommission(orderNumber: string, retry = false): Promise<any> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/commission/settle`

        console.log('[Settle Order Commission] URL:', url)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        // 401 且未重试过，刷新 Token 后重试
        if (response.status === 401 && !retry) {
            console.log('[Settle Order Commission] Token expired, refreshing...')
            const refreshToken = await getRefreshToken()
            if (refreshToken) {
                const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                })

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json()
                    if (refreshData.success && refreshData.data?.accessToken) {
                        const newToken = refreshData.data.accessToken
                        const newRefresh = refreshData.data.refreshToken || refreshToken
                        
                        const cookieStore = await cookies()
                        cookieStore.set('accessToken', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        cookieStore.set('refreshToken', newRefresh, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 60 * 60 * 24 * 30
                        })
                        
                        console.log('[Settle Order Commission] Token refreshed, retrying...')
                        return settleOrderCommission(orderNumber, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`结算佣金失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || '结算佣金失败')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Settle Order Commission] Error:', error)
        throw error
    }
}
