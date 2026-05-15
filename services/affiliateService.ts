// services/affiliateService.ts
import axiosClient from '@/lib/axios-client';
import Cookies from 'js-cookie';
import { AffiliateClickLog, AffDashboardResponse, AffiliateTracking, PayoutRequest, PayoutResponse } from '@/types/affiliate';
import { OrderListResponse } from '@/types/order';
import { PageResponse } from '@/types/api';
import { SERVER_CONFIG } from '@/lib/api-config';
import { apiGet, apiPost } from '@/lib/api-utils';



export class AffiliateService {
    private static COOKIE_NAME = 'affiliate_tracking';
    private static COOKIE_EXPIRY_DAYS = 30;

    /**
     * 初始化：从 URL 获取参数并存入 Cookie
     * 逻辑：访问 ?aff=xxx&source=tiktok&campaign=sale 时触发
     */
    initFromUrl(): void {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const affCode = urlParams.get('aff');

        if (affCode) {
            // 1. 提取所有追踪参数
            const trackingData: AffiliateTracking = {
                affiliateCode: affCode.trim().toUpperCase(),
                source: urlParams.get('source') || 'direct',
                campaign: urlParams.get('campaign') || 'default',
                content: urlParams.get('content') || 'default'
            };

            // 2. 持久化到 Cookie（30天有效期）
            this.saveToCookie(trackingData);

            // 3. 构造上报数据记录点击 (Clicks 统计)
            const clickData: AffiliateClickLog = {
                affiliateCode: trackingData.affiliateCode!,
                source: trackingData.source,
                campaign: trackingData.campaign,
                content: trackingData.content,
                landingPage: window.location.pathname,
                referrer: document.referrer
            };

            this.logClick(clickData);
        }
    }

    /**
     * 将追踪对象序列化为 JSON 存入 Cookie
     */
    private saveToCookie(data: AffiliateTracking): void {
        Cookies.set(AffiliateService.COOKIE_NAME, JSON.stringify(data), {
            expires: AffiliateService.COOKIE_EXPIRY_DAYS,
            path: '/',
            sameSite: 'lax'
        });
    }

    /**
     * 获取存储的联盟追踪数据
     * 用于：下单时读取并发送给后端，确保订单记录 source/campaign
     */
    getTrackingData(): AffiliateTracking | null {
        const data = Cookies.get(AffiliateService.COOKIE_NAME);
        if (!data) return null;
        try {
            return JSON.parse(data) as AffiliateTracking;
        } catch (e) {
            console.error('Failed to parse affiliate cookie', e);
            return null;
        }
    }

    private async logClick(data: AffiliateClickLog): Promise<void> {
        try {
            console.log('[AffiliateService] Logging click:', data);
            await apiPost(`${SERVER_CONFIG.apiRoutes.affiliate}/click`, data);
        } catch (error) {
            // 仅仅是记录点击，即使报错也不要干扰用户正常访问
            console.error('Affiliate click logging error:', error);
        }
    }

    /**
     * 获取 Dashboard 统计数据 (Java API: /api/V1/affiliate/dashboard)
     */
    async getDashboardData(): Promise<AffDashboardResponse> {
        console.log('[Affiliate Service] Calling getDashboardData...');
        const result = await apiGet<AffDashboardResponse>(`${SERVER_CONFIG.apiRoutes.affiliate}/dashboard`);
        
        console.log('[Affiliate Service] getDashboardData result:', {
            success: result.success,
            status: result.status,
            message: result.message,
            hasData: !!result.data
        });
        
        if (!result.success) {
            console.error('[Affiliate Service] getDashboardData failed:', result);
            throw new Error(result.message || 'Failed to fetch dashboard');
        }

        return result.data as AffDashboardResponse;
    }

    /**
     * 清除追踪信息 (通常在订单成交后调用)
     */
    clearTrackingData(): void {
        Cookies.remove(AffiliateService.COOKIE_NAME, { path: '/' });
    }

    async orderList(params: {
        page?: number;
        size?: number;
        keyword?: string;
        status?: string;
        orderNumber?: string;
        guestEmail?: string;
    } = {}): Promise<OrderListResponse> {
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

        const result = await apiGet<OrderListResponse>(`${SERVER_CONFIG.apiRoutes.affiliate}/orderList?${queryParams.toString()}`);

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch orders');
        }

        return result.data as OrderListResponse;
    }

    /**
     * 获取我的提现记录
     */
    async getMyPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });

        const result = await apiGet<PageResponse<PayoutResponse>>(`${SERVER_CONFIG.apiRoutes.affiliate}/payout/my-payouts?${queryParams.toString()}`);
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch payouts');
        }

        return result.data as PageResponse<PayoutResponse>;
    }

    // ==================== 管理端查询方法 ====================

    /**
     * 获取联盟统计数据（管理端）
     */
    async getAdminStats(): Promise<{
        totalAffiliates: number;
        activeAffiliates: number;
        totalClicks: number;
        totalConversions: number;
        totalCommission: number;
        conversionRate: number;
        totalShipments: number;        // ✅ 新增：发货数
        totalVideoReviews: number;     // ✅ 新增：视频评测数
        totalBlogReviews: number;      // ✅ 新增：博客评测数
        settledAmount: number;
        pendingAmount: number;
        currentBalance: number;
        totalPaid: number;
    }> {
        try {
            const url = '/api/admin/V1/affiliate/stats';
            console.log('[AffiliateService] Fetching admin stats:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch admin stats');
        } catch (error) {
            console.error('❌ [AffiliateService] Get admin stats failed:', error);
            // 返回默认值
            return {
                totalAffiliates: 0,
                activeAffiliates: 0,
                totalClicks: 0,
                totalConversions: 0,
                totalCommission: 0,
                conversionRate: 0,
                totalShipments: 0,        // ✅ 新增默认值
                totalVideoReviews: 0,     // ✅ 新增默认值
                totalBlogReviews: 0,      // ✅ 新增默认值
                settledAmount: 0,
                pendingAmount: 0,
                currentBalance: 0,
                totalPaid: 0
            };
        }
    }

    /**
     * 获取联盟成员列表（管理端）
     */
    async getAdminList(params: {
        page?: number;
        size?: number;
    } = {}): Promise<{
        content: any[];
        totalPages: number;
        totalElements: number;
    }> {
        try {
            const { page = 0, size = 20 } = params;
            const url = `/api/admin/V1/affiliate/list?page=${page}&size=${size}`;
            
            console.log('[AffiliateService] Fetching admin affiliate list:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch admin affiliate list');
        } catch (error) {
            console.error('❌ [AffiliateService] Get admin affiliate list failed:', error);
            return { content: [], totalPages: 0, totalElements: 0 };
        }
    }

    /**
     * 获取联盟成员佣金日志（管理端）
     */
    async getAdminCommissionLogs(
        affiliateId: string,
        page: number = 0,
        size: number = 20
    ): Promise<{
        content: any[];
        currentPage: number;
        pageSize: number;
        totalElements: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }> {
        try {
            const url = `/api/admin/V1/affiliate/${affiliateId}/commission-logs?page=${page}&size=${size}`;
            
            console.log('[AffiliateService] Fetching admin commission logs:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data || {
                    content: [],
                    currentPage: page,
                    pageSize: size,
                    totalElements: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrevious: false
                };
            }

            throw new Error(response.data?.message || 'Failed to fetch commission logs');
        } catch (error) {
            console.error('❌ [AffiliateService] Get admin commission logs failed:', error);
            return {
                content: [],
                currentPage: page,
                pageSize: size,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        }
    }

    /**
     * 获取所有提现记录（管理端）
     */
    async getAllPayouts(page: number = 0, size: number = 20): Promise<PageResponse<PayoutResponse>> {
        try {
            const url = `/api/admin/V1/affiliate/payouts?page=${page}&size=${size}`;
            
            console.log('[AffiliateService] Fetching all payouts:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch payouts');
        } catch (error) {
            console.error('❌ [AffiliateService] Get all payouts failed:', error);
            throw error;
        }
    }

    /**
     * 获取联盟客活动列表（管理端）
     */
    async getAdminActivities(
        affiliateId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<any>> {
        try {
            // 首先获取详情，详情中包含活动列表
            const url = `/api/admin/V1/affiliate/${affiliateId}/detail`;
            
            console.log('[AffiliateService] Fetching admin affiliate detail:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                // 从详情中提取活动列表，并手动分页
                const activities = response.data.data.activities || [];
                const start = page * size;
                const end = start + size;
                const paginatedActivities = activities.slice(start, end);

                return {
                    content: paginatedActivities,
                    currentPage: page,
                    pageSize: size,
                    totalElements: activities.length,
                    totalPages: Math.ceil(activities.length / size),
                    hasNext: end < activities.length,
                    hasPrevious: page > 0
                };
            }

            throw new Error(response.data?.message || 'Failed to fetch affiliate detail');
        } catch (error) {
            console.error('[AffiliateService] Get admin activities failed:', error);
            return {
                content: [],
                currentPage: page,
                pageSize: size,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        }
    }

    /**
     * 获取联盟趋势数据（管理端）
     * @param days 天数（3/7/30/90）
     */
    async getTrendData(days: number = 7): Promise<{
        dates: string[];
        clicks: number[];
        orders: number[];
        commissions: number[];
        conversionRates: number[];
    }> {
        try {
            const url = `/api/admin/V1/affiliate/trend?days=${days}`;
            
            console.log('[AffiliateService] Fetching trend data:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch trend data');
        } catch (error) {
            console.error('❌ [AffiliateService] Get trend data failed:', error);
            // 返回空数据
            return {
                dates: [],
                clicks: [],
                orders: [],
                commissions: [],
                conversionRates: []
            };
        }
    }

    /**
     * 获取按来源分组的统计数据（管理端）
     */
    async getSourceStats(): Promise<{
        source: string;
        clicks: number;
        conversions: number;
        revenue: number;
        conversionRate: number;
    }[]> {
        try {
            const url = `/api/admin/V1/affiliate/stats/by-source`;
                
            console.log('[AffiliateService] Fetching source stats:', url);
                
            const response = await axiosClient.get(url);
    
            if (response.data?.success) {
                // 将后端的 name 字段转换为 source
                return (response.data.data || []).map((item: any) => ({
                    source: item.name,
                    clicks: item.clicks || 0,
                    conversions: item.conversions || 0,
                    revenue: parseFloat(item.revenue) || 0,
                    conversionRate: item.conversionRate || 0
                }));
            }
    
            throw new Error(response.data?.message || 'Failed to fetch source stats');
        } catch (error) {
            console.error('❌ [AffiliateService] Get source stats failed:', error);
            return [];
        }
    }
    
    /**
     * 获取按着陆页分组的统计数据（管理端）
     */
    async getLandingPageStats(): Promise<{
        landingPage: string;
        clicks: number;
        conversions: number;
        revenue: number;
        conversionRate: number;
    }[]> {
        try {
            const url = `/api/admin/V1/affiliate/stats/by-landing-page`;
                
            console.log('[AffiliateService] Fetching landing page stats:', url);
                
            const response = await axiosClient.get(url);
    
            if (response.data?.success) {
                // 将后端的 name 字段转换为 landingPage
                return (response.data.data || []).map((item: any) => ({
                    landingPage: item.name,
                    clicks: item.clicks || 0,
                    conversions: item.conversions || 0,
                    revenue: parseFloat(item.revenue) || 0,
                    conversionRate: item.conversionRate || 0
                }));
            }
    
            throw new Error(response.data?.message || 'Failed to fetch landing page stats');
        } catch (error) {
            console.error('❌ [AffiliateService] Get landing page stats failed:', error);
            return [];
        }
    }

    /**
     * 获取单个联盟客的统计数据（管理端）
     * @param affiliateId 联盟客ID
     * @param days 天数（3/7/30/90）
     */
    async getAffiliateDetailStats(affiliateId: string, days: number = 7): Promise<{
        totalClicks: number;
        totalConversions: number;
        totalCommission: number;
        conversionRate: number;
        sourceStats: {
            source: string;
            clicks: number;
            conversions: number;
            revenue: number;
            conversionRate: number;
        }[];
        landingPageStats: {
            landingPage: string;
            clicks: number;
            conversions: number;
            revenue: number;
            conversionRate: number;
        }[];
        trendData: {
            dates: string[];
            clicks: number[];
            orders: number[];
            commissions: number[];
            conversionRates: number[];
        };
    }> {
        try {
            const url = `/api/admin/V1/affiliate/${affiliateId}/stats?days=${days}`;
            
            console.log('[AffiliateService] Fetching affiliate detail stats:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch affiliate detail stats');
        } catch (error) {
            console.error('❌ [AffiliateService] Get affiliate detail stats failed:', error);
            // 返回默认值
            return {
                totalClicks: 0,
                totalConversions: 0,
                totalCommission: 0,
                conversionRate: 0,
                sourceStats: [],
                landingPageStats: [],
                trendData: {
                    dates: [],
                    clicks: [],
                    orders: [],
                    commissions: [],
                    conversionRates: []
                }
            };
        }
    }
}

export const affiliateService = new AffiliateService();