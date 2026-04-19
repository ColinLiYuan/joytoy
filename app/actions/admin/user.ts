'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { UserListResponse } from '@/types/auth'

export async function getAdminUsers(params: {
    page: number
    size: number
    keyword?: string
    status?: string
    sortBy?: string
}): Promise<UserListResponse> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        queryParams.append('sortBy', params.sortBy || 'createdAt')
        if (params.keyword) queryParams.append('keyword', params.keyword)
        if (params.status) queryParams.append('status', params.status)

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/user/list?${queryParams.toString()}`

        console.log('Server Action: Fetching users from:', url)

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
            throw new Error(`Failed to fetch users: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch users')
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
        console.error('Server Action: Error fetching users:', error)
        throw error
    }
}
