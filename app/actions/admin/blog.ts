'use server'

import { cookies } from 'next/headers'
import { BACKEND_CONFIG, BACKEND_API_ROUTES } from '@/lib/api-config'
import { AdminBlogListResponse, AdminBlogResponse, ReleaseBlogRequest } from '@/types/admin/adminBlog'

/**
 * 刷新 Token
 */
async function refreshToken(refreshTokenValue: string): Promise<string | null> {
    try {
        console.log('[Blog Refresh Token] Calling refresh endpoint...')
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        })

        console.log('[Blog Refresh Token] Response status:', response.status)

        if (!response.ok) {
            console.log('[Blog Refresh Token] Failed, status:', response.status)
            return null
        }

        const result = await response.json()
        console.log('[Blog Refresh Token] Response:', result)
        
        if (result.success && result.data?.accessToken) {
            console.log('[Blog Refresh Token] Success, new token length:', result.data.accessToken.length)
            return result.data.accessToken
        }

        console.log('[Blog Refresh Token] No access token in response')
        return null
    } catch (error) {
        console.error('[Blog Refresh Token] Error:', error)
        return null
    }
}

/**
 * 获取管理端博客列表
 */
export async function getAdminBlogs(params: {
    page: number
    size: number
    status?: string
    sortBy?: string
}): Promise<AdminBlogListResponse> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        // 构建查询参数
        const queryParams = new URLSearchParams()
        queryParams.append('page', params.page.toString())
        queryParams.append('size', params.size.toString())
        if (params.status && params.status !== 'ALL') {
            queryParams.append('status', params.status)
        }
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy)
        }

        const url = `${BACKEND_API_ROUTES.admin.blog.list}?${queryParams.toString()}`
        console.log('[Admin Get Blogs] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Admin Get Blogs] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Admin Get Blogs] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    // 重试请求
                    response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                    })

                    console.log('[Admin Get Blogs] Retry response status:', response.status)
                }
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch blogs: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch blogs')
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
        console.error('[Admin Get Blogs] Error:', error)
        throw error
    }
}

/**
 * 获取博客详情
 */
export async function getAdminBlogById(id: number): Promise<AdminBlogResponse> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        const url = `${BACKEND_API_ROUTES.admin.blog.detail}/${id}`
        console.log('[Admin Get Blog] Calling URL:', url)

        let response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Admin Get Blog] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Admin Get Blog] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    response = await fetch(url, {
                        cache: 'no-store',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                    })
                }
            }
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch blog: ${response.status}`)
        }

        const apiResponse = await response.json()

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch blog')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Get Blog] Error:', error)
        throw error
    }
}

/**
 * 发布/更新博客
 */
export async function releaseBlog(request: ReleaseBlogRequest): Promise<AdminBlogListResponse> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        const url = BACKEND_API_ROUTES.admin.blog.release
        console.log('[Admin Release Blog] Calling URL:', url)
        console.log('[Admin Release Blog] Request:', request)

        let response = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Admin Release Blog] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Admin Release Blog] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    response = await fetch(url, {
                        cache: 'no-store',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${newToken}`,
                        },
                        body: JSON.stringify(request),
                    })
                }
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.message || `Failed to release blog: ${response.status}`)
        }

        const apiResponse = await response.json()
        console.log('[Admin Release Blog] Response:', apiResponse)

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to release blog')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Release Blog] Error:', error)
        throw error
    }
}

/**
 * 上传博客图片
 */
export async function uploadBlogImage(file: FormData): Promise<any> {
    try {
        const cookieStore = await cookies()
        let token = cookieStore.get('accessToken')?.value

        const url = BACKEND_API_ROUTES.admin.blog.upload
        console.log('[Admin Upload Blog Image] Calling URL:', url)

        const headers: Record<string, string> = {}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        let response = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers,
            body: file,
        })

        // 如果 401，尝试刷新 token
        if (response.status === 401) {
            console.log('[Admin Upload Blog Image] Got 401, trying to refresh token...')
            const refreshTokenValue = cookieStore.get('refreshToken')?.value
            if (refreshTokenValue) {
                const newToken = await refreshToken(refreshTokenValue)
                if (newToken) {
                    console.log('[Admin Upload Blog Image] Token refreshed, retrying...')
                    cookieStore.set('accessToken', newToken, {
                        path: '/',
                        maxAge: 1800,
                    })

                    const retryHeaders: Record<string, string> = {
                        'Authorization': `Bearer ${newToken}`,
                    }

                    response = await fetch(url, {
                        cache: 'no-store',
                        method: 'POST',
                        headers: retryHeaders,
                        body: file,
                    })
                }
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.message || `Upload failed: ${response.status}`)
        }

        const apiResponse = await response.json()
        console.log('[Admin Upload Blog Image] Response:', apiResponse)

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Upload failed')
        }

        return apiResponse.data
    } catch (error) {
        console.error('[Admin Upload Blog Image] Error:', error)
        throw error
    }
}
