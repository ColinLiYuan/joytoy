// services/cartService.ts
import axiosClient from '@/lib/axios-client';
import { CartResponse } from '@/types/cart';

export type { CartResponse }; // 重新导出 CartResponse

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

export interface CartStatistics {
    totalCarts: number;
    activeCarts: number;
    convertedCarts: number;
    abandonedCarts: number;
    totalItems: number;
    avgItemsPerCart: number;
}

// 购物车操作日志接口（与后端 CartOperationLogResponse 对齐）
export interface CartOperationLog {
    id: number;
    cartId: number;
    userId: number | null;
    sessionId: string;
    userEmail: string | null;
    userName: string;
    operationType: string;
    operationTypeDesc: string;
    // 商品信息
    productId: number | null;
    productName: string | null;
    productTitle: string | null;
    productSku: string | null;
    skuId: number | null;
    skuColor: string | null;
    bundleId: number | null;
    bundleName: string | null;
    productImage: string | null;
    // 数量和价格
    quantityBefore: number | null;
    quantityAfter: number | null;
    quantityChange: number | null;
    unitPrice: number | null;
    totalPrice: number | null;
    // 购物车状态
    cartItemsCount: number;
    cartTotalQuantity: number;
    cartSubtotal: number;
    // 其他
    reason: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

// 操作日志统计接口（与后端 CartAnalyticsResponse 对齐）
export interface CartOperationStatistics {
    totalOperations: number;
    todayOperations: number;
    createOperations: number;
    addOperations: number;
    removeOperations: number;
    abandonOperations: number;
    avgOperationsPerCart: number;
    addToCartConversionRate: number;
    last7Days: {
        cartsCreated: number;
        itemsAdded: number;
        itemsRemoved: number;
        cartsAbandoned: number;
        avgCartSubtotal: number;
    } | null;
    last30Days: {
        cartsCreated: number;
        itemsAdded: number;
        itemsRemoved: number;
        cartsAbandoned: number;
        avgCartSubtotal: number;
    } | null;
    topAddedProducts: Array<{
        productId: number;
        productName: string;
        productTitle: string;
        count: number;
        totalAmount: number;
    }>;
    topRemovedProducts: Array<{
        productId: number;
        productName: string;
        productTitle: string;
        count: number;
        totalAmount: number;
    }>;
}

class CartService {
    /**
     * 获取用户购物车（查询 - 使用 Axios 直连后端）
     */
    async getCart(): Promise<CartResponse> {
        try {
            const response = await axiosClient.get('/api/V1/cart');

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart');
        } catch (error) {
            console.error('❌ Get cart failed:', error);
            throw error;
        }
    }

    // ✅ 管理员获取购物车列表
    async adminList(params: {
        page?: number;
        size?: number;
        status?: string;
        userId?: number;
        isGuest?: boolean;
        sortBy?: string;
    } = {}): Promise<{ content: CartResponse[]; totalPages: number; totalElements: number }> {
        try {
            const {
                page = 0,
                size = 20,
                status = '',
                userId,
                isGuest,
                sortBy = 'createdAt'
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            queryParams.append('sortBy', sortBy);

            if (status) queryParams.append('status', status);
            if (userId) queryParams.append('userId', userId.toString());
            if (isGuest !== undefined) queryParams.append('isGuest', isGuest.toString());

            const url = `/api/admin/V1/cart/list?page=${page}&size=${size}&sortBy=${sortBy}${status ? `&status=${status}` : ''}${userId ? `&userId=${userId}` : ''}${isGuest !== undefined ? `&isGuest=${isGuest}` : ''}`;
            
            // 添加时间戳参数，避免浏览器缓存
            const cacheBusterUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
            const response = await axiosClient.get(cacheBusterUrl);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart list');
        } catch (error: any) {
            console.error('❌ [CartService] Error fetching admin cart list:', error);
            
            // 提供更详细的错误信息
            if (error.response) {
                console.error('[CartService] Error response status:', error.response.status);
                console.error('[CartService] Error response data:', error.response.data);
                
                // 如果是 401，提示用户重新登录
                if (error.response.status === 401) {
                    throw new Error('认证失败，请重新登录');
                }
                
                // 如果是 500，提示服务器错误
                if (error.response.status === 500) {
                    throw new Error('服务器内部错误，请稍后重试');
                }
            } else if (error.request) {
                console.error('[CartService] No response received:', error.request);
                throw new Error('无法连接到服务器，请检查网络连接');
            } else {
                console.error('[CartService] Error setting up request:', error.message);
            }
            
            throw error;
        }
    }

    // ✅ 管理员获取购物车详情
    async getAdminCartDetail(cartId: number): Promise<CartResponse> {
        const url = `/api/admin/V1/cart/${cartId}`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Failed to fetch cart detail');
    }

    // ✅ 管理员获取购物车统计
    async getAdminCartStatistics(): Promise<CartStatistics> {
        const url = `/api/admin/V1/cart/statistics`;
        const response = await axiosClient.get(url);

        if (response.data?.success) {
            return response.data.data;
        }

        throw new Error(response.data?.message || 'Failed to fetch cart statistics');
    }

    // ✅ 获取购物车操作日志列表
    async getCartOperationLogs(params: {
        page?: number;
        size?: number;
        operationType?: string;
        isGuest?: boolean;
        search?: string;
    } = {}): Promise<{ content: CartOperationLog[]; totalPages: number; totalElements: number }> {
        try {
            const {
                page = 0,
                size = 20,
                operationType = '',
                isGuest,
                search = ''
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());

            if (operationType) queryParams.append('operationType', operationType);
            if (search) {
                queryParams.append('userName', search);
                queryParams.append('userEmail', search);
            }

            const queryString = queryParams.toString();
            const url = `/api/admin/V1/cart/operation-logs${queryString ? '?' + queryString : ''}`;

const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch cart operation logs');
        } catch (error) {
            console.error('❌ [CartService] Error fetching cart operation logs:', error);
            throw error;
        }
    }

    // ✅ 获取购物车操作日志统计
    async getCartOperationStatistics(): Promise<CartOperationStatistics> {
        try {
            const url = `/api/admin/V1/cart/operation-logs/statistics`;
const response = await axiosClient.get(url);

            if (response.data?.success) {
                const d = response.data.data;
                return {
                    totalOperations: d.totalOperations || 0,
                    todayOperations: d.todayOperations || 0,
                    createOperations: d.totalCartsCreated || 0,
                    addOperations: d.totalItemsAdded || 0,
                    removeOperations: d.totalItemsRemoved || 0,
                    abandonOperations: d.totalCartsAbandoned || 0,
                    avgOperationsPerCart: d.avgItemsPerCart || 0,
                    addToCartConversionRate: d.addToCartConversionRate || 0,
                    last7Days: d.last7Days || null,
                    last30Days: d.last30Days || null,
                    topAddedProducts: d.topAddedProducts || [],
                    topRemovedProducts: d.topRemovedProducts || [],
                };
            }

            throw new Error(response.data?.message || 'Failed to fetch cart operation logs statistics');
        } catch (error) {
            console.error('[CartService] Error fetching cart operation logs statistics:', error);
            return {
                totalOperations: 0,
                todayOperations: 0,
                createOperations: 0,
                addOperations: 0,
                removeOperations: 0,
                abandonOperations: 0,
                avgOperationsPerCart: 0,
                addToCartConversionRate: 0,
                last7Days: null,
                last30Days: null,
                topAddedProducts: [],
                topRemovedProducts: [],
            };
        }
    }
}

export const cartService = new CartService();