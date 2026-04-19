'use server'

import { cookies } from 'next/headers'

interface UploadResult {
    url: string;
    fileName: string;
    originalName: string;
}

// 上传产品图片
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
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

        // 获取其他参数
        const type = formData.get('type') as string || 'main'
        const slug = formData.get('slug') as string || ''
        const index = formData.get('index') as string

        // 调用后端统一上传接口
        const backendFormData = new FormData()
        backendFormData.append('file', file)
        backendFormData.append('type', type)
        backendFormData.append('slug', slug)
        if (index) {
            backendFormData.append('index', index)
        }

        const baseUrl = process.env.BACKEND_BASE_URL || 'http://localhost:9356'
        const url = `${baseUrl}/api/admin/V1/upload/myth/product/image`

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
        console.error('Server Action: Error uploading product image:', error)
        throw error
    }
}
