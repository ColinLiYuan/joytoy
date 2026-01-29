// lib/constants/coupons.ts

export type CouponType = 'PERCENTAGE' | 'FIXED';

export interface Coupon {
    code: string;       // 折扣码 (如 MYTH10)
    type: CouponType;   // 类型: 百分比 或 固定金额
    value: number;      // 值: 0.1 代表 10%, 20 代表减 $20
    description: string; // 成功后的提示文案
}

// ✅ 这里定义你的折扣码列表
export const AVAILABLE_COUPONS: Coupon[] = [
    {
        code: 'MYTH10',
        type: 'PERCENTAGE',
        value: 0.10, // 10% off
        description: '10% discount applied!'
    },
    {
        code: 'MYTHR15',
        type: 'PERCENTAGE',
        value: 0.15, // 15% off
        description: 'REDDIT 15% discount applied!'
    },
    {
        code: 'THANKYOU20',
        type: 'PERCENTAGE',
        value: 0.20, // 20% off
        description: 'VIP Support Discount: 20% OFF Applied. Thank You!'
    }

];

/**
 * 验证并返回折扣码对象
 */
export const validateCoupon = (code: string): Coupon | undefined => {
    if (!code) return undefined;
    return AVAILABLE_COUPONS.find(
        c => c.code.toUpperCase() === code.toUpperCase().trim()
    );
};