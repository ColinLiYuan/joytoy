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

export interface AffDashboardResponse {
    summary: DashboardSummary;
    sourceStats: PathStat[];
    campaignStats: PathStat[];
    dailyTrends: DailyTrend[];
}

/**
 * 单条路径统计数据（如 source=tiktok 或 campaign=summer_sale）
 */
export interface PathStat {
    name: string;        // 路径标识符 (例如: 'tiktok', 'instagram_bio')
    clicks: number;      // 该路径的总点击数
    conversions: number; // 该路径带来的订单数
    revenue: number;     // 该路径产生的总佣金金额
}

/**
 * 每日点击趋势数据（用于未来对接折线图）
 */
export interface DailyTrend {
    date: string;        // 日期，建议格式 'YYYY-MM-DD'
    clicks: number;
}

/**
 * Dashboard 核心概览指标
 */
export interface DashboardSummary {
    totalClicks: number;
    totalEarnings: number;
    conversionRate: number; // 百分比，如 3.2
    activeLinks: number;
}

/**
 * 后端 API 返回的完整数据结构
 */
export interface AffiliateDashboardData {
    summary: DashboardSummary;
    sourceStats: PathStat[];   // 按 source 参数统计
    campaignStats: PathStat[]; // 按 campaign 参数统计
    dailyTrends: DailyTrend[];
}