// services/cartService.ts
import { AddToCartRequest, CartResponse } from '@/types/cart';
import { SERVER_CONFIG } from '@/lib/api-config';

// 辅助函数：检查响应是否为 JSON
function validateJsonResponse(response: Response, serviceName: string, url: string) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        console.error(`[${serviceName}] Non-JSON response received:`, {
            url: url,
            status: response.status,
            statusText: response.statusText,
            contentType: contentType || 'null',
            ok: response.ok
        });
        throw new Error(`Invalid server response: Expected JSON but got ${contentType || 'no content-type'} (Status: ${response.status})`);
    }
}

class CartService {
    /**
     * 获取购物车
     */
    async getCart(): Promise<CartResponse> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.cart}/get`;
            const response = await fetch(url);

            validateJsonResponse(response, 'CartService', url);

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
            const url = `${SERVER_CONFIG.apiRoutes.cart}/add`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            validateJsonResponse(response, 'CartService', url);

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
            const url = `${SERVER_CONFIG.apiRoutes.cart}/remove`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            });

            validateJsonResponse(response, 'CartService', url);

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

            validateJsonResponse(response, 'CartService', url);

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