// types/checkout.ts


export interface CheckoutValidateRequest {
    code?: string;
    email?: string;
}


export interface CouponResponse {
    code: string;           // 优惠码，如 'SENSAVITE10'
    type: 'PERCENTAGE' | 'FIXED_AMOUNT'; // 折扣类型：百分比或固定金额
    value: number;          // 折扣数值：0.10 (10%) 或 10.00 ($10)
    description: string;    // 描述文案，如 'Community Exclusive 10% Off'

    // 可选：如果该券关联了联盟成员，前端可以据此显示“推客推荐”等标识
    affiliateId?: string;   // 关联的联盟 ID
}