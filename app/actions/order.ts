'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'

const API_PATHS = {
  ORDER_CANCEL: (orderNumber: string) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/cancel`,
  ORDER_REFUND: (orderNumber: string) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/refund`,
  ORDER_SETTLE_COMMISSION: (orderNumber: string) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/commission/settle`,
  ORDER_UPDATE_STATUS: (orderNumber: string) => `${BACKEND_CONFIG.baseURL}/api/admin/V1/order/${orderNumber}/status`,
} as const

/**
 * 管理员取消订单
 */
export async function cancelAdminOrder(orderNumber: string, reason?: string): Promise<void> {
    try {
        console.log('[Order Action] Cancelling order:', orderNumber)

        const response = await fetchWithAuth(API_PATHS.ORDER_CANCEL(orderNumber), {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify({ reason: reason || '管理员取消' }),
        })

        console.log('[Order Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Order Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to cancel order: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Order Action] Success:', result)

        if (!result.success) {
            throw new Error(result.message || 'Failed to cancel order')
        }
    } catch (error) {
        console.error('[Order Action] Error:', error)
        throw error
    }
}

/**
 * 管理员退款订单
 */
export async function refundAdminOrder(orderNumber: string, reason?: string): Promise<void> {
    try {
        console.log('[Order Action] Refunding order:', orderNumber)

        const response = await fetchWithAuth(API_PATHS.ORDER_REFUND(orderNumber), {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify({ reason: reason || '管理员退款' }),
        })

        console.log('[Order Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Order Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to refund order: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Order Action] Success:', result)

        if (!result.success) {
            throw new Error(result.message || 'Failed to refund order')
        }
    } catch (error) {
        console.error('[Order Action] Error:', error)
        throw error
    }
}

/**
 * 结算订单佣金
 */
export async function settleOrderCommission(orderNumber: string): Promise<any> {
    try {
        console.log('[Order Action] Settling commission for order:', orderNumber)

        const response = await fetchWithAuth(API_PATHS.ORDER_SETTLE_COMMISSION(orderNumber), {
            cache: 'no-store',
            method: 'POST',
        })

        console.log('[Order Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Order Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to settle commission: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Order Action] Success:', result)

        if (!result.success) {
            throw new Error(result.message || 'Failed to settle commission')
        }

        return result.data
    } catch (error) {
        console.error('[Order Action] Error:', error)
        throw error
    }
}

/**
 * 更新订单状态（发货等）
 */
export async function updateOrderStatus(orderNumber: string, trackingNumber?: string): Promise<void> {
    try {
        console.log('[Order Action] Updating order status:', orderNumber)

        const response = await fetchWithAuth(API_PATHS.ORDER_UPDATE_STATUS(orderNumber), {
            cache: 'no-store',
            method: 'PUT',
            body: JSON.stringify({ trackingNumber }),
        })

        console.log('[Order Action] Response status:', response.status)

        if (!response.ok) {
            console.log('[Order Action] Failed:', response.status)
            const errorText = await response.text()
            throw new Error(`Failed to update order status: ${errorText}`)
        }

        const result = await response.json()
        console.log('[Order Action] Success:', result)

        if (!result.success) {
            throw new Error(result.message || 'Failed to update order status')
        }
    } catch (error) {
        console.error('[Order Action] Error:', error)
        throw error
    }
}
