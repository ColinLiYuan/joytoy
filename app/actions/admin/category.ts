'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'
import { RootResponse } from '@/types/category'

// 获取根分类（包含子分类）
export async function getAdminRootCategories(): Promise<RootResponse[]> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/category/roots`

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`获取分类失败: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || '获取分类失败')
        }

        return apiResponse.data || []
    } catch (error) {
        console.error('Server Action: Error fetching categories:', error)
        throw error
    }
}
