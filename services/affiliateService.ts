// services/affiliateService.ts
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
        const result = await apiGet<AffDashboardResponse>(`${SERVER_CONFIG.apiRoutes.affiliate}/dashboard`);
        
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch dashboard');
        }

        return result.data;
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

        return result.data;
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

        return result.data;
    }
}

export const affiliateService = new AffiliateService();