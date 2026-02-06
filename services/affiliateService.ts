// services/affiliateService.ts
import Cookies from 'js-cookie';
import { AFFILIATE_MAP } from '@/lib/constants/affiliate-data';

export interface AffiliateClickData {
    affiliateId: string;
    affiliateCode: string;
    campaignId?: string;
    landingPage: string;
    referrer: string;
    userAgent: string;
    ipAddress?: string;
}

export interface AffiliateCookieData {
    affiliateId?: string;
    affiliateCode?: string;
    campaignId?: string;
    clickTime?: string;
}

export class AffiliateService {
    private static COOKIE_NAME = 'affiliate_tracking';
    private static COOKIE_EXPIRY_DAYS = 30;

    async getAffiliateByCode(code: string) {
        return AFFILIATE_MAP[code] || null;
    }

    /**
     * 处理推广链接点击
     */
    async trackAffiliateClick(data: AffiliateClickData): Promise<boolean> {
        try {
            // 1. 存到Cookie（前端）
            this.saveToCookie(data);

            // 2. 发送到后端记录点击
            // const response = await fetch('/api/affiliate/clicks', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            // return response.ok;
            return true;
        } catch (error) {
            console.error('Track affiliate click error:', error);
            // 即使后端失败，Cookie也要存，保证基础功能
            this.saveToCookie(data);
            return false;
        }
    }

    /**
     * 保存到Cookie
     */
    private saveToCookie(data: AffiliateClickData): void {
        const cookieData = {
            affiliateId: data.affiliateId,
            affiliateCode: data.affiliateCode,
            campaignId: data.campaignId,
            clickTime: new Date().toISOString()
        };

        Cookies.set(AffiliateService.COOKIE_NAME, JSON.stringify(cookieData), {
            expires: AffiliateService.COOKIE_EXPIRY_DAYS,
            path: '/',
            sameSite: 'lax'
        });
    }

    /**
     * 从Cookie获取联盟数据
     */
    getAffiliateFromCookie(): AffiliateCookieData {
        try {
            const cookie = Cookies.get(AffiliateService.COOKIE_NAME);
            if (!cookie) return {};

            return JSON.parse(cookie);
        } catch (error) {
            console.error('Parse affiliate cookie error:', error);
            return {};
        }
    }

    /**
     * 清除Cookie（用于测试或手动清除）
     */
    clearAffiliateCookie(): void {
        Cookies.remove(AffiliateService.COOKIE_NAME, { path: '/' });
    }

    /**
     * 检查是否应该覆盖现有推广者
     * 策略：最后一次点击覆盖
     */
    shouldOverrideAffiliate(newAffiliateId: string): boolean {
        const existing = this.getAffiliateFromCookie();
        if (!existing.affiliateId) return true;

        // 简单策略：总是覆盖（最后一次点击获胜）
        return true;
    }

    /**
     * 生成推广链接
     */
    generateAffiliateLink(baseUrl: string, affiliateCode: string, campaignId?: string): string {
        const url = new URL(baseUrl);
        url.searchParams.set('ref', affiliateCode);
        if (campaignId) {
            url.searchParams.set('campaign', campaignId);
        }

        // 可以添加签名防篡改
        const timestamp = Date.now();
        const signature = this.generateSignature(affiliateCode, timestamp);
        url.searchParams.set('t', timestamp.toString());
        url.searchParams.set('sig', signature);

        return url.toString();
    }

    generateSignature(affiliateCode: string, timestamp: number): string {
        // 简单的签名实现，实际应该用更安全的算法
        const secret = process.env.NEXT_PUBLIC_AFFILIATE_SECRET || 'default-secret';
        return btoa(`${affiliateCode}:${timestamp}:${secret}`).slice(0, 32);
    }

    /**
     * 简化的：从URL参数设置Cookie（直接调用）
     */
    initFromUrl(): void {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const affiliateCode = urlParams.get('ref');
        const campaignId = urlParams.get('campaign');

        if (affiliateCode) {
            const existing = this.getAffiliateFromCookie();

            // 如果已经有联盟信息，检查是否覆盖
            if (!existing.affiliateId || this.shouldOverrideAffiliate(affiliateCode)) {
                this.trackAffiliateClick({
                    affiliateId: affiliateCode,
                    affiliateCode,
                    campaignId: campaignId || undefined,
                    landingPage: window.location.pathname,
                    referrer: document.referrer,
                    userAgent: navigator.userAgent
                });
            }
        }
    }

    /**
     * 直接获取联盟信息（供结账使用）
     */
    getAffiliateData(): AffiliateCookieData {
        return this.getAffiliateFromCookie();
    }
}

// ✅ 导出实例
export const affiliateService = new AffiliateService();

// ✅ 或者保持静态方法，导出实例
export default affiliateService;