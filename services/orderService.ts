// services/orderService.ts
import { OrderCreateRequest, OrderResponse, OrderListResponse } from '@/types/order';
import { SERVER_CONFIG, ADMIN_CONFIG } from '@/lib/api-config';
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
    async getOrder(orderNumber: string): Promise<OrderResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/${orderNumber}`;
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

    async payOrder(orderNumber: string, paymentRequest: PaymentRequest): Promise<OrderResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.order}/${orderNumber}/pay`;
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

    async trackOrder(orderNumber: string, email: string) {
        // 请求我们自己项目里的 Next.js API 路由
        const url = `${SERVER_CONFIG.apiRoutes.order}/track`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderNumber, email })
        });

        const json = await response.json();

        if (!json.success) {
            throw new Error(json.error || json.errorMessage || 'Tracking failed, please check your info.');
        }

        return json.data;
    }

    async adminList(params: {
        page?: number;
        size?: number;
        keyword?: string;
        status?: string;
        orderNumber?: string;
        guestEmail?: string;
    } = {}): Promise<OrderListResponse> {
        try {
            const {
                page = 0,
                size = 12,
                keyword = '',
                status = '',
                orderNumber = '',
                guestEmail = ''
            } = params;

            const queryParams = new URLSearchParams();

            // 统一使用 toString() 确保拼接到 URL 的是纯字符串
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());

            if (keyword) queryParams.append('keyword', keyword);
            if (status) queryParams.append('status', status);
            if (orderNumber) queryParams.append('orderNumber', orderNumber);
            if (guestEmail) queryParams.append('guestEmail', guestEmail);

            const url = `${ADMIN_CONFIG.apiRoutes.order}/list?${queryParams.toString()}`;
            // console.log('Fetching orders from URL:', url);

            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const apiResponse = await response.json();
            if (!apiResponse.success) {
                throw new Error(apiResponse.error || 'Failed to fetch orders');
            }

            return apiResponse.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    // ✅ 新增：管理员发货
    async updateStatus(orderId: number, trackingNumber: string): Promise<OrderResponse> {
        // 假设后端接口为 PUT /api/admin/order/{id}/ship
        // 你需要在后端 AdminOrderController 实现这个接口
        const url = `${ADMIN_CONFIG.apiRoutes.order}/updateStatus`;

        const response = await fetch(url, {
            method: 'POST', // 或 POST，取决于后端定义
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, trackingNumber })
        });

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Shipping failed');
        }

        return apiResponse.data;
    }
}

export const orderService = new OrderService();