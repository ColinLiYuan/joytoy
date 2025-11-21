// services/orderService.ts
import { OrderCreateRequest, OrderResponse } from '@/types/order';
import { FrontApiResponse } from '@/types/api';
import { SERVER_CONFIG } from '@/lib/api-config';

class OrderService {
    // 创建订单
    async createOrder(orderCreateRequest: OrderCreateRequest): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderCreateRequest),
            });
            // console.log('after createOrder service ' + response.ok)

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const apiResponse: FrontApiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to create order');
            }

            return {
                success: true,
                data: apiResponse.data
            };
        } catch (error) {
            console.error('Order creation error:', error);
            return {
                success: false,
                error: 'Network error while creating order'
            };
        }
    }

    // 获取订单详情
    async getOrder(orderId: number): Promise<{ success: boolean; data?: OrderResponse; error?: string }> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}/${orderId}`;
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: result.error || 'Failed to get order'
                };
            }

            return {
                success: true,
                data: result.data
            };
        } catch (error) {
            console.error('Order fetch error:', error);
            return {
                success: false,
                error: 'Network error while fetching order'
            };
        }
    }

    // 获取用户订单列表
    async getUserOrders(userId: number, page: number = 0, size: number = 20): Promise<OrderResponse[]> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}/list?userId=${userId}&page=${page}&size=${size}`;
            const response = await fetch(url);
            // console.log('after getUserOrders service ' + response.ok)

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to get orders: ${response.status}`);
            }

            const apiResponse: FrontApiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to get orders');
            }

            console.log('after getUserOrders apiResponse data:', apiResponse.data);

            // 确保返回的是数组
            return Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data];
        } catch (error) {
            console.error('Orders list fetch error:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();