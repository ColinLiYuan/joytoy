'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG } from '@/lib/api-config'

interface UploadResult {
    url: string;
    fileName: string;
    originalName: string;
}

// 上传博客图片
export async function uploadBlogImage(formData: FormData): Promise<UploadResult> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('accessToken')?.value

        if (!token) {
            throw new Error('未登录或登录已过期')
        }

        const file = formData.get('file') as File
        
        if (!file) {
            throw new Error('缺少文件')
        }

        // 调用后端统一上传接口
        const backendFormData = new FormData()
        backendFormData.append('file', file)

        const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/upload/myth/blog/image`

        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Authorization': `Bearer ${token}`,
                // 注意：不要手动设置 Content-Type，让浏览器自动设置 multipart/form-data
            },
            body: backendFormData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`上传图片失败: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.error || '上传图片失败')
        }

        return {
            url: apiResponse.data.url,
            fileName: apiResponse.data.fileName,
            originalName: apiResponse.data.originalName,
        }
    } catch (error) {
        console.error('Server Action: Error uploading blog image:', error)
        throw error
    }
}
