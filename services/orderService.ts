// services/orderService.ts
import { OrderCreateRequest, OrderResponse } from '@/types/order';
import { SERVER_CONFIG } from '@/lib/api-config';
import { PaymentRequest } from '@/types/payment';

class OrderService {
    // 创建订单
    async createOrder(orderCreateRequest: OrderCreateRequest): Promise<OrderResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/add`;
        // console.log('🟢 Creating order, URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderCreateRequest),
            credentials: 'include',
        });

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'order creation failed, please contact support@mythtoy.com');
        }

        // console.log('createOrder service: ', apiResponse)
        return apiResponse.data;
    }

    // 获取订单详情
    async getOrder(orderId: number): Promise<OrderResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/${orderId}`;
        const response = await fetch(url, {
            credentials: 'include', // 添加这行
        });

        const apiResponse = await response.json();

        // console.log('getOrder service: ', apiResponse)
        return apiResponse.data;
    }

    // 获取用户订单列表
    async getUserOrders(page: number = 0, size: number = 20): Promise<OrderResponse[]> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/list?page=${page}&size=${size}`;
        const response = await fetch(url, {
            credentials: 'include',
        });

        const apiResponse = await response.json();

        // console.log('getUserOrders service: ', apiResponse)
        return apiResponse.data;
    }

    async payOrder(orderId: number, paymentRequest: PaymentRequest): Promise<OrderResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/${orderId}/pay`;
        // console.log('🟢 Paying order, URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentRequest),
            credentials: 'include',
        });

        const apiResponse = await response.json();
        // console.log('payOrder service response: ', apiResponse);

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'order creation failed, please contact support@mythtoy.com');
        }
        return apiResponse.data;
    }
}

export const orderService = new OrderService();