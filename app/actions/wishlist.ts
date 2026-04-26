'use server'

import { BACKEND_CONFIG } from '@/lib/api-config'
import { fetchWithAuth } from '@/lib/server-token-utils'
import { WishlistRequest } from '@/types/wishlist'

const WISHLIST_URL = `${BACKEND_CONFIG.baseURL}/api/V1/wishlist`

export async function addToWishlist(wishlistData: WishlistRequest): Promise<boolean> {
    try {
        console.log('[Add to Wishlist] Calling API...')
        const response = await fetchWithAuth(WISHLIST_URL, {
            cache: 'no-store',
            method: 'POST',
            body: JSON.stringify(wishlistData),
        })

        console.log('[Add to Wishlist] Response status:', response.status)

        if (!response.ok) {
            console.log('[Add to Wishlist] Failed:', response.status)
            return false
        }

        const result = await response.json()
        console.log('[Add to Wishlist] Success:', result.success)
        return result.success === true
    } catch (error) {
        console.error('[Add to Wishlist] Error:', error)
        return false
    }
}

export async function removeFromWishlist(productId: number): Promise<boolean> {
    try {
        const url = `${WISHLIST_URL}?productId=${productId}`
        const response = await fetchWithAuth(url, {
            cache: 'no-store',
            method: 'DELETE',
        })

        if (!response.ok) {
            console.log('[Remove from Wishlist] Failed:', response.status)
            return false
        }

        const result = await response.json()
        return result.success === true
    } catch (error) {
        console.error('[Remove from Wishlist] Error:', error)
        return false
    }
}
