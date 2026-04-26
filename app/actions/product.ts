'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { ReleaseProductRequest } from '@/types/admin/adminProduct'

const API_PATHS = {
  PRODUCT_RELEASE: `${BACKEND_CONFIG.baseURL}/api/admin/V1/product/release`,
  PRODUCT_UPLOAD: `${BACKEND_CONFIG.baseURL}/api/admin/V1/upload/myth/product/image`,
} as const

interface UploadResult {
    url: string;
    fileName: string;
    originalName: string;
}

/**
 * 发布/更新产品
 */
export async function releaseAdminProduct(productData: ReleaseProductRequest): Promise<void> {
    try {
        console.log('[Product Action] Releasing product:', productData)

        const response = await fetchWithAuth(API_PATHS.PRODUCT_RELEASE, {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify(productData),
        })

        console.log('[Product Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Product Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to release product: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Product Action] Success:', result)

        if (!result.success) {
            throw new Error(result.error || 'Failed to release product')
        }
    } catch (error) {
        console.error('[Product Action] Error:', error)
        throw error
    }
}

/**
 * 上传产品图片
 */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
    try {
        console.log('[Product Action] Uploading image')

        const response = await fetchWithAuth(API_PATHS.PRODUCT_UPLOAD, {
            cache: 'no-store',
            method: 'POST',
            body: formData,
        })

        console.log('[Product Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Product Action] Upload failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to upload image: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Product Action] Upload success:', result)

        return {
            url: result.data.url,
            fileName: result.data.fileName,
            originalName: result.data.originalName,
        }
    } catch (error) {
        console.error('[Product Action] Upload error:', error)
        throw error
    }
}
