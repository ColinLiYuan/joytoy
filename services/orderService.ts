// services/orderService.ts
import { OrderCreateRequest, OrderResponse, OrderListResponse, OrderPaymentResult } from '@/types/order';
import { SERVER_CONFIG, ADMIN_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';
import { PaymentRequest } from '@/types/payment';
import { apiGet, apiPost } from '@/lib/api-utils';

class OrderService {
    // 创建订单
    async createOrder(orderCreateRequest: OrderCreateRequest): Promise<OrderResponse> {
        const result = await apiPost<OrderResponse>(`${SERVER_CONFIG.apiRoutes.order}/add`, orderCreateRequest);

        if (!result.success) {
            throw new Error(result.message || 'order creation failed, please contact support@mythtoy.com');
        }

        return result.data;
    }

    // 获取订单详情
    async getOrder(orderNumber: string): Promise<OrderResponse> {
        const result = await apiGet<OrderResponse>(`${SERVER_CONFIG.apiRoutes.order}/${orderNumber}`);

        console.log('[OrderService.getOrder] Result:', {
            success: result.success,
            message: result.message,
            status: result.status,
            errorType: result.errorType,
            data: result.data
        });

        if (!result.success) {
            throw new Error(result.message || `Failed to fetch order (Status: ${result.status})`);
        }

        return result.data;
    }

    // 获取用户订单列表
    // @returns 订单列表，如果 session 过期则返回 null
    async getUserOrders(page: number = 0, size: number = 20): Promise<OrderResponse[] | null> {
        try {
            const result = await apiGet<OrderResponse[]>(`${SERVER_CONFIG.apiRoutes.order}/list?page=${page}&size=${size}`);
            
            console.log('[OrderService.getUserOrders] Result:', {
                success: result.success,
                message: result.message,
                status: result.status,
                errorType: result.errorType
            });
            
            // 检查错误消息，判断是否是 session 过期
            const errorMsg = result.message?.toLowerCase() || '';
            const isSessionExpired = errorMsg.includes('session') || 
                                    errorMsg.includes('login') || 
                                    errorMsg.includes('auth') || 
                                    errorMsg.includes('unauthorized') ||
                                    errorMsg.includes('登录') ||
                                    errorMsg.includes('expired');
            
            // 如果是认证错误或 session 过期，静默返回 null
            if (result.status === 401 || 
                result.status === 403 || 
                result.errorType === 'auth' ||
                isSessionExpired) {
                return null;
            }
            
            if (!result.success) {
                throw new Error(result.message || `Failed to fetch orders`);
            }

            return result.data;
        } catch (error) {
            // 网络错误或解析错误，静默返回 null
            console.error('[OrderService] Network error:', error);
            return null;
        }
    }

    async payOrder(orderNumber: string, paymentRequest: PaymentRequest, signal?: AbortSignal): Promise<OrderPaymentResult> {
        const result = await apiPost<OrderPaymentResult>(
            `${SERVER_CONFIG.apiRoutes.order}/${orderNumber}/pay`,
            paymentRequest
        );

        if (!result.success) {
            throw new Error(result.message || 'order creation failed, please contact support@mythtoy.com');
        }
        return result.data;
    }

    async trackOrder(orderNumber: string, email: string) {
        const result = await apiPost(`${SERVER_CONFIG.apiRoutes.order}/track`, { orderNumber, email });

        if (!result.success) {
            throw new Error(result.message || 'Tracking failed, please check your info.');
        }

        return result.data;
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
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());

            if (keyword) queryParams.append('keyword', keyword);
            if (status) queryParams.append('status', status);
            if (orderNumber) queryParams.append('orderNumber', orderNumber);
            if (guestEmail) queryParams.append('guestEmail', guestEmail);

            const result = await apiGet<OrderListResponse>(`${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.order}/list?${queryParams.toString()}`);

            if (!result.success) {
                throw new Error(result.message || 'Failed to fetch orders');
            }

            return result.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    // ✅ 新增：管理员发货
    async updateStatus(orderId: number, trackingNumber: string): Promise<OrderResponse> {
        const result = await apiPost<OrderResponse>(
            `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.order}/updateStatus`,
            { orderId, trackingNumber }
        );

        if (!result.success) {
            throw new Error(result.message || 'Shipping failed');
        }

        return result.data;
    }

    // ✅ 用户取消订单
    async cancelOrder(orderNumber: string): Promise<boolean> {
        const result = await apiPost(`${SERVER_CONFIG.apiRoutes.order}/${orderNumber}/cancel`);

        if (!result.success) {
            throw new Error(result.message || 'Failed to cancel order');
        }

        return true;
    }
}

export const orderService = new OrderService();