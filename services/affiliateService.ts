// services/affiliateService.ts
import Cookies from 'js-cookie';
import { AffiliateClickLog } from '@/types/affiliate';

export interface AffiliateCookieData {
    affiliateCode?: string;
    clickTime?: string;
}


export class AffiliateService {
    private static COOKIE_NAME = 'affiliate_tracking';
    private static COOKIE_EXPIRY_DAYS = 30;

    /**
     * 初始化：从URL获取ref参数并存入Cookie
     * 建议在根布局 (Layout) 或 关键页面调用
     */
    initFromUrl(): void {
        if (typeof window === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const affCode = urlParams.get('aff');

        if (affCode) {
            this.saveToCookie(affCode.trim());

            const clickData: AffiliateClickLog = {
                affiliateCode: affCode,
                source: urlParams.get('source') || 'direct',
                campaign: urlParams.get('campaign') || 'none',
                content: urlParams.get('content') || '',
                landingPage: window.location.pathname,
                referrer: document.referrer
            };

            this.logClick(clickData);
        }
    }

    /**
     * 存入 Cookie
     */
    private saveToCookie(code: string): void {
        const data: AffiliateCookieData = {
            affiliateCode: code,
            clickTime: new Date().toISOString()
        };

        Cookies.set(AffiliateService.COOKIE_NAME, JSON.stringify(data), {
            expires: AffiliateService.COOKIE_EXPIRY_DAYS,
            path: '/' // 确保全站可用
        });
    }

    private async logClick(data: AffiliateClickLog): Promise<void> {
        // console.log('233333333333')
        try {
            // 这里的 API 路径根据你的后端配置调整
            const url = `/api/site/affiliate/click`;
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
     * 获取存储的推广码（供结算时读取）
     */
    getAffiliateCode(): string | undefined {
        const cookie = Cookies.get(AffiliateService.COOKIE_NAME);
        if (!cookie) return undefined;
        try {
            const data: AffiliateCookieData = JSON.parse(cookie);
            return data.affiliateCode;
        } catch (e) {
            return undefined;
        }
    }

    clearAffiliateData(): void {
        Cookies.remove(AffiliateService.COOKIE_NAME);
    }
}

export const affiliateService = new AffiliateService();