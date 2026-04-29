'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { ReleaseBlogRequest } from '@/types/blog'

const API_PATHS = {
  BLOG_RELEASE: `/api/admin/V1/blog/release`,
  BLOG_UPLOAD: `/api/admin/V1/upload/myth/blog/image`,
} as const

// ==================== 博客写操作 (Server Action) ====================

/**
 * 发布/更新博客
 */
export async function releaseBlog(request: ReleaseBlogRequest): Promise<any> {
    try {
        console.log('[Blog Action] Releasing blog:', request)

        const response = await fetchWithAuth(API_PATHS.BLOG_RELEASE, {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify(request),
        })

        console.log('[Blog Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Blog Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to release blog: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Blog Action] Success:', result)
        return result
    } catch (error) {
        console.error('[Blog Action] Error:', error)
        throw error
    }
}

/**
 * 上传博客图片
 */
export async function uploadBlogImage(file: File): Promise<{ url: string; fileName: string; originalName: string }> {
    try {
        console.log('[Blog Action] Uploading image:', file.name)

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetchWithAuth(API_PATHS.BLOG_UPLOAD, {
            cache: 'no-store',
            method: 'POST',
            body: formData,
        })

        console.log('[Blog Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Blog Action] Upload failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to upload image: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Blog Action] Upload success:', result)
        return result.data
    } catch (error) {
        console.error('[Blog Action] Upload error:', error)
        throw error
    }
}
