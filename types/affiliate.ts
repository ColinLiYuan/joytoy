// types/affiliate.ts

export interface AffiliateTracking {
    affiliateCode?: string;
    affiliateId?: string;
    commissionAmount?: number;
    commissionRate?: number;
    affiliatePayoutStatus?: 'pending' | 'paid';
}

export interface AffiliateClickLog {
    affiliateCode: string;
    source?: string;    // 对应 utm_source
    campaign?: string;  // 对应 utm_campaign
    content?: string;   // 对应 utm_content
    landingPage: string;
    referrer: string;
}