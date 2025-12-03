// services/orderService.ts
import { OrderCreateRequest, OrderResponse } from '@/types/order';
import { FrontApiResponse } from '@/types/api';
import { SERVER_CONFIG } from '@/lib/api-config';

class OrderService {
    // 创建订单
    async createOrder(orderCreateRequest: OrderCreateRequest): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}/add`;
            console.log('🟢 Creating order, URL:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderCreateRequest),
                credentials: 'include', // 添加这行，确保发送 cookie/token
            });

            console.log('🟢 Order creation response status:', response.status, response.statusText);

            // 先尝试读取响应文本，再解析 JSON
            const responseText = await response.text();
            console.log('🟢 Order creation response body:', responseText);

            if (!response.ok) {
                // 尝试解析错误信息
                let errorData;
                try {
                    errorData = responseText ? JSON.parse(responseText) : {};
                } catch (e) {
                    console.error('🟡 Failed to parse error response as JSON:', e);
                    errorData = { error: responseText || `HTTP error ${response.status}` };
                }

                console.error('🔴 Order creation failed:', errorData);
                throw new Error(errorData.error || errorData.message || `Failed to create order: ${response.status}`);
            }

            // 解析成功响应
            let apiResponse: FrontApiResponse;
            try {
                apiResponse = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('🟡 Failed to parse success response as JSON:', e);
                throw new Error('Invalid JSON response from server');
            }

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || apiResponse.error || 'Failed to create order');
            }

            return {
                success: true,
                data: apiResponse.data
            };
        } catch (error) {
            console.error('🔴 Order creation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error while creating order'
            };
        }
    }

    // 获取订单详情
    async getOrder(orderId: number): Promise<{ success: boolean; data?: OrderResponse; error?: string }> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}/${orderId}`;
            const response = await fetch(url, {
                credentials: 'include', // 添加这行
            });

            // 先读取文本
            const responseText = await response.text();

            if (!response.ok) {
                let errorData;
                try {
                    errorData = responseText ? JSON.parse(responseText) : {};
                } catch {
                    errorData = { error: `HTTP error ${response.status}` };
                }
                return {
                    success: false,
                    error: errorData.error || 'Failed to get order'
                };
            }

            // 解析成功响应
            let result;
            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                return {
                    success: false,
                    error: 'Invalid JSON response'
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
    async getUserOrders(page: number = 0, size: number = 20): Promise<OrderResponse[]> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.order}/list?page=${page}&size=${size}`;
            const response = await fetch(url, {
                credentials: 'include', // 添加这行
            });

            console.log('🟢 Getting user orders, status:', response.status);

            const responseText = await response.text();
            console.log('🟢 Orders response body:', responseText);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = responseText ? JSON.parse(responseText) : {};
                } catch {
                    errorData = { error: `HTTP error ${response.status}` };
                }
                throw new Error(errorData?.error || `Failed to get orders: ${response.status}`);
            }

            let apiResponse: FrontApiResponse;
            try {
                apiResponse = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('🟡 Failed to parse orders response as JSON:', e);
                throw new Error('Invalid JSON response from server');
            }

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to get orders');
            }

            console.log('🟢 Orders API response data:', apiResponse.data);

            // 确保返回的是数组
            return Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data];
        } catch (error) {
            console.error('🔴 Orders list fetch error:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();