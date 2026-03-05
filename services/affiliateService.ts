// services/affiliateService.ts
import Cookies from 'js-cookie';

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
            // TODO 发送点击次数给后端做统计
            this.saveToCookie(affCode.trim());
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