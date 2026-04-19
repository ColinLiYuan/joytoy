'use server'

import { cookies } from 'next/headers'
import { SERVER_CONFIG } from '@/lib/api-config'

interface BlogDetail {
    id: number;
    title: string;
    slug: string;
    subTitle?: string;
    content: string;
    summary?: string;
    author: string;
    tags: string[];
    coverImage?: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    viewCount?: number;
    createdAt: string;
    updatedAt: string;
}

export async function getBlogById(blogId: number): Promise<BlogDetail> {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const response = await fetch(`${SERVER_CONFIG.baseURL}/api/blogs/${blogId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(`获取博客详情失败: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('获取博客详情失败:', error)
        throw error
    }
}

export async function updateBlog(blogId: number, blogData: any): Promise<void> {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) {
        throw new Error('未登录或登录已过期')
    }

    try {
        const response = await fetch(`${SERVER_CONFIG.baseURL}/api/blogs/release`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: blogId,
                ...blogData
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`更新博客失败: ${response.status} - ${errorText}`)
        }
    } catch (error) {
        console.error('更新博客失败:', error)
        throw error
    }
}
