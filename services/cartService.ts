// services/cartService.ts
import { AddToCartRequest, CartResponse } from '@/types/cart';
import { SERVER_CONFIG } from '@/lib/api-config';

class CartService {
    /**
     * 获取购物车
     */
    async getCart(): Promise<CartResponse> {
        try {
            let url = `${SERVER_CONFIG.apiRoutes.cart}/get`;
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
    async addItemToCart(request: AddToCartRequest): Promise<CartResponse> {
        try {
            let url = `${SERVER_CONFIG.apiRoutes.cart}/add`;
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
    async removeItemFromCart(itemId: number): Promise<CartResponse> {
        try {
            let url = `${SERVER_CONFIG.apiRoutes.cart}/remove`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
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
    async updateItemQuantity(itemId: number, quantity: number): Promise<CartResponse> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.cart}/update`;
            // console.log('updateItemQuantity url: ', url)
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity, itemId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to update item quantity');
            }

            const apiResponse = await response.json();
            // console.log('updateItemQuantity apiResponse:', apiResponse)
            return apiResponse.data;
        } catch (error) {
            console.error('Update item quantity failed:', error);
            throw error;
        }
    }
}

export const cartService = new CartService();