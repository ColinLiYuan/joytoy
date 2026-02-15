// lib/constants/affiliate-data.ts

/**
 * 推广码对应的推广员信息
 * key: 推广码
 * value: { affiliateId: 推广员ID, commissionRate: 佣金率 }
 */

// 1. 先定义值的类型
interface AffiliateInfo {
    affiliateId: string;
    commissionRate: number;
}

// 2. 定义对象的类型，包含索引签名
interface AffiliateMap {
    [key: string]: AffiliateInfo | undefined;  // 这行是关键！允许用任何字符串访问
    test10: AffiliateInfo;
    test15: AffiliateInfo;
    test20: AffiliateInfo;
    '76600769': AffiliateInfo;
}

// 3. 使用定义的类型
export const AFFILIATE_MAP: AffiliateMap = {
    'test10': { affiliateId: 'test10', commissionRate: 0.10 },
    'test15': { affiliateId: 'test15', commissionRate: 0.15 },
    'test20': { affiliateId: 'test20', commissionRate: 0.20 },
    '76600769': { affiliateId: 'elia', commissionRate: 0.10 },
};