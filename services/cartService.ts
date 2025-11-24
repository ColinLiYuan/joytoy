// services/cartService.ts
import { AddToCartRequest, CartResponse } from '@/types/cart';
import { SERVER_CONFIG } from '@/lib/api-config';

class CartService {
    /**
     * 获取购物车
     */
    async getCart(cartId: string): Promise<CartResponse> {
        try {
            if (!cartId) {
                throw new Error('Cart ID is required');
            }

            let url = `${SERVER_CONFIG.apiRoutes.cart}/${cartId}`;
            // console.log('getCart url: ', url)
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to fetch cart: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;
        } catch (error) {
            console.error('❌ Get cart failed:', error);
            throw error;
        }
    }

    /**
     * 添加商品到购物车
     */
    async addItemToCart(cartId: string, request: AddToCartRequest): Promise<CartResponse> {
        try {
            if (!cartId) {
                cartId = '0';
            }

            let url = `${SERVER_CONFIG.apiRoutes.cart}/${cartId}/items`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to add item: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;

        } catch (error) {
            console.error('Add item to cart failed:', error);
            throw error;
        }
    }

    /**
     * 从购物车移除商品
     */
    async removeItemFromCart(cartId: string, itemId: number): Promise<CartResponse> {
        try {
            if (!cartId) {
                throw new Error('Cart ID is required');
            }

            let url = `${SERVER_CONFIG.apiRoutes.cart}/items/${itemId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to remove item from cart');
            }

            const apiResponse = await response.json();
            return apiResponse.data;
        } catch (error) {
            console.error('Remove item from cart failed:', error);
            throw error;
        }
    }

    /**
     * 更新购物车商品数量
     */
    async updateItemQuantity(cartId: string, itemId: number, quantity: number): Promise<CartResponse> {
        try {
            console.log('updateItemQuantity start')
            if (!cartId) {
                throw new Error('Cart ID is required');
            }

            const url = `${SERVER_CONFIG.apiRoutes.cart}/items/${itemId}`;
            // console.log('updateItemQuantity url: ', url)
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity, cartId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to update item quantity');
            }

            const apiResponse = await response.json();
            console.log('updateItemQuantity apiResponse:', apiResponse)
            return apiResponse.data;
        } catch (error) {
            console.error('Update item quantity failed:', error);
            throw error;
        }
    }
}

export const cartService = new CartService();