'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { ProductListResponse } from '@/types/product'
import { AdminProductResponse, ReleaseProductRequest } from '@/types/admin/adminProduct'
import { getRefreshToken } from '@/lib/token-utils'

export async function getAdminProducts(params: {
    category: string
    page: number
    size: number
    keyword: string
    status: string
    vendor: string
}): Promise<ProductListResponse> {
    try {
        // 从 Cookie 获取 Token（服务端直接访问）
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        console.log('Server Action: Token from cookie:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND')

        // 构建查询参数
        const queryParams = new URLSearchParams()
        if (params.category) queryParams.append('category', params.category)
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.keyword) queryParams.append('keyword', params.keyword)
        if (params.status) queryParams.append('status', params.status)
        if (params.vendor) queryParams.append('vendor', params.vendor)

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/product/list?${queryParams.toString()}`

        console.log('Server Action: Fetching products from:', url)

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
            console.log('Server Action: Authorization header set')
        } else {
            console.error('Server Action: No token found in cookies!')
        }

        const response = await fetch(url, {
            cache: 'no-store',
            headers,
        })

        console.log('Server Action: Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Server Action: Error response:', errorText)
            throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const apiResponse = await response.json()

        console.log('Server Action: API Response:', apiResponse)

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to fetch products')
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
        console.error('Server Action: Error fetching products:', error)
        throw error
    }
}

// 获取产品详情
export async function getAdminProductById(id: string, retry = false): Promise<AdminProductResponse> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/product/${id}`

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 401 && !retry) {
            console.log('[Get Admin Product] Token expired, refreshing...')
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
                        
                        console.log('[Get Admin Product] Token refreshed, retrying...')
                        return getAdminProductById(id, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            throw new Error(`获取产品详情失败: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || '获取产品详情失败')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Get Admin Product] Error:', error)
        throw error
    }
}

// 发布/更新产品
export async function releaseAdminProduct(productData: ReleaseProductRequest, retry = false): Promise<void> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/product/release`

        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })

        if (response.status === 401 && !retry) {
            console.log('[Release Product] Token expired, refreshing...')
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
                        
                        console.log('[Release Product] Token refreshed, retrying...')
                        return releaseAdminProduct(productData, true)
                    }
                }
            }
            throw new Error('Token refresh failed, please login again')
        }

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`发布产品失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || '发布产品失败')
        }
    } catch (error) {
        console.error('[Release Product] Error:', error)
        throw error
    }
}
