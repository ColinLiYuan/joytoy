export interface AffiliateTracking {
    affiliateCode?: string;
    affiliateId?: string;
    commissionAmount?: number;
    commissionRate?: number;
    affiliatePayoutStatus?: 'pending' | 'paid';
}