// services/affiliateService.ts
import Cookies from 'js-cookie';
import { AffiliateClickLog, AffDashboardResponse, AffiliateTracking } from '@/types/affiliate';
import { OrderListResponse } from '@/types/order';
import { SERVER_CONFIG } from '@/lib/api-config';

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
        // console.log('233333333333')
        try {
            // 这里的 API 路径根据你的后端配置调整
            const url = `${SERVER_CONFIG.apiRoutes.affiliate}/click`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.warn('Failed to log affiliate click');
            }
        } catch (error) {
            // 仅仅是记录点击，即使报错也不要干扰用户正常访问
            console.error('Affiliate click logging error:', error);
        }
    }

    /**
     * 获取 Dashboard 统计数据 (Java API: /api/V1/affiliate/dashboard)
     */
    async getDashboardData(): Promise<AffDashboardResponse> {
        try {
            const url = `${SERVER_CONFIG.apiRoutes.affiliate}/dashboard`;
            const response = await fetch(url, { cache: 'no-store' });

            if (!response.ok) throw new Error('Failed to fetch dashboard');
            const apiResponse = await response.json();
            if (!apiResponse.success) throw new Error(apiResponse.error);

            return apiResponse.data;
        } catch (error) {
            console.error('Dashboard Fetch Error:', error);
            throw error;
        }
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

            const url = `${SERVER_CONFIG.apiRoutes.affiliate}/orderList?${queryParams.toString()}`;
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
}

export const affiliateService = new AffiliateService();