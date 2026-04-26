'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { AddToCartRequest } from '@/types/cart'
import { cookies } from 'next/headers'

/**
 * 获取或生成 sessionId（用于游客购物车）
 */
async function getSessionId(): Promise<string> {
    const cookieStore = await cookies()
    let sessionId = cookieStore.get('sessionId')?.value
    
    console.log('[Cart Action] Get sessionId from cookie:', sessionId)
    
    if (!sessionId) {
        sessionId = crypto.randomUUID()
        console.log('[Cart Action] Generated new sessionId:', sessionId)
        cookieStore.set('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30天
        })
    }
    
    return sessionId
}

/**
 * 获取用户购物车
 */
export async function getUserCart() {
    const sessionId = await getSessionId()
    console.log('[Cart Action] Getting cart with sessionId:', sessionId)

    try {
        const response = await fetchWithAuth(API_PATHS.CART_GET, {
            cache: 'no-store',
            headers: { 'X-Session-Id': sessionId },
        })

        console.log('[Cart Action] Get cart response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Cart Action] Get cart failed:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            })
            throw new Error(`Failed to fetch cart: ${response.status} - ${errorText}`)
        }

        const apiResponse = await response.json()
        console.log('[Cart Action] Get cart full response:', JSON.stringify(apiResponse, null, 2))

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to fetch cart')
        }

        // 如果已登录（有 accessToken）但返回游客购物车（没有 userId），说明 Token 可能过期了
        const { getAccessToken, refreshAccessToken } = await import('@/lib/server-token-utils')
        const accessToken = await getAccessToken()
        
        if (accessToken && !apiResponse.data?.userId) {
            console.log('[Cart Action] Detected: logged in but got guest cart, refreshing token...')
            // 主动刷新 Token
            const newToken = await refreshAccessToken()
            
            if (newToken) {
                console.log('[Cart Action] Token refreshed, retrying cart fetch...')
                // 用新 Token 重试
                const retriedResponse = await fetch(`${API_PATHS.CART_GET}`, {
                    cache: 'no-store',
                    headers: { 
                        'Authorization': `Bearer ${newToken}`,
                        'Content-Type': 'application/json',
                        'X-Session-Id': sessionId,
                    },
                })
                
                if (retriedResponse.ok) {
                    const retriedData = await retriedResponse.json()
                    console.log('[Cart Action] Retried cart fetch success:', retriedData)
                    return retriedData.data
                }
            }
        }

        console.log('[Cart Action] Returning cart data:', apiResponse.data)
        return apiResponse.data
    } catch (error) {
        console.error('[Cart Action] getUserCart exception:', error)
        throw error
    }
}

const API_PATHS = {
  // 用户端购物车操作
  CART_GET: `${BACKEND_CONFIG.baseURL}/api/V1/cart`,
  CART_ADD: `${BACKEND_CONFIG.baseURL}/api/V1/cart`,
  CART_UPDATE: (itemId: number, quantity: number) => 
    `${BACKEND_CONFIG.baseURL}/api/V1/cart?itemId=${itemId}&quantity=${quantity}`,
  CART_REMOVE: (itemId: number) => `${BACKEND_CONFIG.baseURL}/api/V1/cart/${itemId}`,
  
  // 管理员购物车操作
  CART_CLEAR: (cartId: number) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/${cartId}/clear`,
  CART_ABANDON: (cartId: number) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/${cartId}/abandon`,
  CART_CLEANUP_EXPIRED: `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/cleanup/expired`,
  CART_ITEM_REMOVE: (itemId: number) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/item/${itemId}`,
  CART_ITEM_UPDATE_QUANTITY: (itemId: number, quantity: number) => 
    `${BACKEND_CONFIG.baseURL}/api/admin/V1/cart/item/${itemId}/quantity?quantity=${quantity}`,
} as const

/**
 * 添加商品到购物车
 */
export async function addToCart(request: AddToCartRequest) {
    const sessionId = await getSessionId()
    console.log('[Cart Action] Adding item with sessionId:', sessionId, 'request:', request)

    const response = await fetchWithAuth(API_PATHS.CART_ADD, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId,
        },
        body: JSON.stringify(request),
    })

    console.log('[Cart Action] Add item response status:', response.status)

    if (!response.ok) {
        const errorText = await response.text()
        console.error('[Cart Action] Add item failed:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
        })
        throw new Error(`Failed to add item: ${response.status} - ${errorText}`)
    }

    const apiResponse = await response.json()
    console.log('[Cart Action] Add item success:', apiResponse)

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to add item')
    }

    return apiResponse.data
}

/**
 * 从购物车移除商品
 */
export async function removeFromCart(itemId: number) {
    const sessionId = await getSessionId()

    const response = await fetchWithAuth(API_PATHS.CART_REMOVE(itemId), {
        method: 'DELETE',
        headers: { 'X-Session-Id': sessionId },
    })

    if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to remove item from cart')
    }

    return apiResponse.data
}

/**
 * 更新购物车商品数量
 */
export async function updateCartItemQuantity(itemId: number, quantity: number) {
    const sessionId = await getSessionId()

    const response = await fetchWithAuth(API_PATHS.CART_UPDATE(itemId, quantity), {
        method: 'PUT',
        headers: { 'X-Session-Id': sessionId },
    })

    if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to update item quantity')
    }

    return apiResponse.data
}

/**
 * 清空购物车
 */
export async function clearAdminCart(cartId: number): Promise<void> {
    const response = await fetchWithAuth(API_PATHS.CART_CLEAR(cartId), {
        cache: 'no-store',
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to clear cart')
    }
}

/**
 * 废弃购物车
 */
export async function abandonAdminCart(cartId: number): Promise<void> {
    const response = await fetchWithAuth(API_PATHS.CART_ABANDON(cartId), {
        cache: 'no-store',
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error(`Failed to abandon cart: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to abandon cart')
    }
}

/**
 * 清理过期购物车
 */
export async function cleanupExpiredAdminCarts(): Promise<{ cleanedCount: number; message: string }> {
    const response = await fetchWithAuth(API_PATHS.CART_CLEANUP_EXPIRED, {
        cache: 'no-store',
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error(`Failed to cleanup expired carts: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to cleanup expired carts')
    }

    return apiResponse.data
}

/**
 * 移除购物车商品项
 */
export async function removeAdminCartItem(itemId: number): Promise<void> {
    const response = await fetchWithAuth(API_PATHS.CART_ITEM_REMOVE(itemId), {
        cache: 'no-store',
        method: 'DELETE',
    })

    if (!response.ok) {
        throw new Error(`Failed to remove cart item: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to remove cart item')
    }
}

/**
 * 更新购物车商品数量
 */
export async function updateAdminCartItemQuantity(itemId: number, quantity: number): Promise<void> {
    const response = await fetchWithAuth(API_PATHS.CART_ITEM_UPDATE_QUANTITY(itemId, quantity), {
        cache: 'no-store',
        method: 'PUT',
    })

    if (!response.ok) {
        throw new Error(`Failed to update item quantity: ${response.status}`)
    }

    const apiResponse = await response.json()

    if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Failed to update item quantity')
    }
}
