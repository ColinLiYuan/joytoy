'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { AdminBlogListResponse } from '@/types/admin/adminBlog'

export async function getAdminBlogs(params: {
    page: number
    size: number
    status?: string
}): Promise<AdminBlogListResponse> {
    try {
        // 从 Cookie 获取 Token
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.status && params.status !== 'ALL') {
            queryParams.append('status', params.status)
        }

        // 直接调用后端 API
        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/blog/list?${queryParams.toString()}`

        console.log('Server Action: Fetching blogs from:', url)

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
            throw new Error(`Failed to fetch blogs: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || 'Failed to fetch blogs')
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
        console.error('Server Action: Error fetching blogs:', error)
        throw error
    }
}
