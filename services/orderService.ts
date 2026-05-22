// services/orderService.ts
import axiosClient from '@/lib/axios-client';
import { OrderCreateRequest, OrderResponse, OrderListResponse, OrderPaymentResult } from '@/types/order';
import { SERVER_CONFIG, ADMIN_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';
import { PaymentRequest } from '@/types/payment';
import { apiGet, apiPost } from '@/lib/api-utils';

export interface OrderStatusLog {
    id: number
    orderId: number
    orderNumber: string
    oldStatus?: string
    newStatus: string
    changedBy?: string
    reason?: string
    affiliatePayoutStatusBefore?: string
    affiliatePayoutStatusAfter?: string
    ipAddress?: string
    createdAt: string
}

export interface AffiliateCommissionLog {
    id: number
    affiliateId: string
    orderId: number
    orderNumber: string
    changeType: string
    commissionAmount: number
    balanceBefore: number
    balanceAfter: number
    totalEarnedBefore: number
    totalEarnedAfter: number
    description?: string
    payoutStatusBefore?: string
    payoutStatusAfter?: string
    createdAt: string
}

class OrderService {
    // 创建订单
    async createOrder(orderCreateRequest: OrderCreateRequest): Promise<OrderResponse> {
        const url = `/api/V1/order`;
        try {
            const response = await axiosClient.post(url, orderCreateRequest);
            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'order creation failed, please contact support@mythtoy.com');
        } catch (error: any) {
            console.error('[OrderService] Create order failed - Full error:', error)
            console.error('[OrderService] Error name:', error.name)
            console.error('[OrderService] Error message:', error.message)
            console.error('[OrderService] Error stack:', error.stack)
            
            if (error.response) {
                console.error('[OrderService] Error response status:', error.response.status)
                console.error('[OrderService] Error response data:', error.response.data)
            } else if (error.request) {
                console.error('[OrderService] Error request (no response received):', error.request)
            } else {
                console.error('[OrderService] Error setting up request:', error.message)
            }
            
            throw error;
        }
    }

    // 获取订单详情
    async getOrder(orderNumber: string): Promise<OrderResponse> {
        const url = `/api/V1/order/${orderNumber}`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || `Failed to fetch order`);
    }

    // 获取用户订单列表
    async getUserOrders(page: number = 0, size: number = 20): Promise<OrderResponse[] | null> {
        try {
            const url = `/api/V1/order/list?page=${page}&size=${size}`;
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            // 检查是否是认证相关错误
            const errorMsg = response.data?.message?.toLowerCase() || '';
            if (errorMsg.includes('session') || 
                errorMsg.includes('login') || 
                errorMsg.includes('auth') || 
                errorMsg.includes('unauthorized') ||
                errorMsg.includes('登录') ||
                errorMsg.includes('expired')) {
                return null;
            }

            throw new Error(response.data?.message || `Failed to fetch orders`);
        } catch (error: any) {
            // 401 或其他认证错误
            if (error.response?.status === 401) {
                return null;
            }
            console.error('[OrderService] Network error:', error);
            return null;
        }
    }

    async payOrder(orderNumber: string, paymentRequest: PaymentRequest, signal?: AbortSignal): Promise<OrderPaymentResult> {
        const url = `/api/V1/order/${orderNumber}/pay`;
        const response = await axiosClient.post(url, paymentRequest);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'order creation failed, please contact support@mythtoy.com');
    }

    async trackOrder(orderNumber: string, email: string) {
        const url = `/api/V1/order/track`;
        const response = await axiosClient.post(url, { orderNumber, email });

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Tracking failed, please check your info.');
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

            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (keyword) queryParams.append('keyword', keyword);
            if (status) queryParams.append('status', status);
            if (orderNumber) queryParams.append('orderNumber', orderNumber);
            if (guestEmail) queryParams.append('guestEmail', guestEmail);

            const url = `/api/admin/V1/order/list?${queryParams.toString()}`;
            // 添加时间戳参数，避免浏览器缓存
            const cacheBusterUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
            const response = await axiosClient.get(cacheBusterUrl);
            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch orders');
        } catch (error) {
            console.error('❌ [OrderService] Error fetching orders:', error);
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

        return result.data as OrderResponse;
    }

    // ✅ 用户取消订单
    async cancelOrder(orderNumber: string): Promise<boolean> {
        const url = `/api/V1/order/${orderNumber}/cancel`;
        const response = await axiosClient.post(url);

        if (response.data?.success) {
            return true;
        }

        throw new Error(response.data?.message || 'Failed to cancel order');
    }

    // ✅ 管理员获取订单详情
    async getAdminOrderDetail(orderNumber: string): Promise<OrderResponse> {
        const url = `/api/admin/V1/order/${orderNumber}`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Failed to fetch order detail');
    }

    // ✅ 获取订单状态历史
    async getOrderStatusLogs(orderNumber: string): Promise<OrderStatusLog[]> {
        const url = `/api/admin/V1/order/${orderNumber}/status-logs`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data || [];
        }

        throw new Error(response.data?.message || 'Failed to fetch order status logs');
    }

    // ✅ 获取订单佣金流水日志
    async getOrderCommissionLogs(orderNumber: string): Promise<AffiliateCommissionLog[]> {
        const url = `/api/admin/V1/order/${orderNumber}/commission-logs`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data || [];
        }

        throw new Error(response.data?.message || 'Failed to fetch order commission logs');
    }
}

export const orderService = new OrderService();