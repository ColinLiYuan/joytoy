// services/adminCartService.ts
import { ADMIN_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';
import { getToken } from '@/lib/token-utils';

export interface CartItem {
    id: number;
    productId: number;
    productTitle: string;
    productName: string;
    productSku: string;
    skuId: number;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    color: string;
    size: string;
    material: string;
    weight: string;
}

export interface CartResponse {
    id: number;
    cartToken: string;
    sessionId: string;
    userId: number | null;
    userEmail: string | null;
    userName: string;
    status: string;
    totalItems: number;
    subtotalAmount: number;
    discountAmount: number;
    totalAmount: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    itemCount: number;
    items?: CartItem[];
}

export interface CartStatistics {
    totalCarts: number;
    activeCarts: number;
    convertedCarts: number;
    abandonedCarts: number;
    totalItems: number;
    avgItemsPerCart: number;
}

class AdminCartService {
    async getCartList(params: {
        page?: number;
        size?: number;
        status?: string;
        userId?: number;
        sortBy?: string;
    } = {}): Promise<{ content: CartResponse[]; totalPages: number; totalElements: number }> {
        try {
            const {
                page = 0,
                size = 20,
                status = '',
                userId,
                sortBy = 'createdAt'
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            queryParams.append('sortBy', sortBy);

            if (status) queryParams.append('status', status);
            if (userId) queryParams.append('userId', userId.toString());

            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/list?${queryParams.toString()}`;
            
            console.log('[AdminCartService] Fetching cart list:', {
                url: url,
                baseURL: BACKEND_CONFIG.baseURL,
                apiRoute: ADMIN_CONFIG.apiRoutes.V1_cart
            });
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to fetch cart list');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching admin cart list:', error);
            throw error;
        }
    }

    async getCartDetail(cartId: number): Promise<CartResponse> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/${cartId}`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to fetch cart detail');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching cart detail:', error);
            throw error;
        }
    }

    async clearCart(cartId: number): Promise<void> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/${cartId}/clear`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to clear cart');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    async removeCartItem(itemId: number): Promise<void> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/item/${itemId}`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to remove cart item');
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            throw error;
        }
    }

    async updateCartItemQuantity(itemId: number, quantity: number): Promise<void> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/item/${itemId}/quantity?quantity=${quantity}`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to update item quantity');
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw error;
        }
    }

    async abandonCart(cartId: number): Promise<void> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/${cartId}/abandon`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to abandon cart');
            }
        } catch (error) {
            console.error('Error abandoning cart:', error);
            throw error;
        }
    }

    async cleanupExpiredCarts(): Promise<{ cleanedCount: number; message: string }> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/cleanup/expired`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    status: response.status,
                    contentType: contentType
                });
                throw new Error('Invalid server response');
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to cleanup expired carts');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error cleaning up expired carts:', error);
            throw error;
        }
    }

    async getCartStatistics(): Promise<CartStatistics> {
        try {
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.V1_cart}/statistics`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            // 检查 Content-Type 是否为 JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('[AdminCartService] Non-JSON response received:', {
                    url: url,
                    status: response.status,
                    statusText: response.statusText,
                    contentType: contentType || 'null',
                    ok: response.ok
                });
                throw new Error(`Invalid server response: Expected JSON but got ${contentType || 'no content-type'} (Status: ${response.status})`);
            }

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to fetch cart statistics');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching cart statistics:', error);
            throw error;
        }
    }
}

export const adminCartService = new AdminCartService();
