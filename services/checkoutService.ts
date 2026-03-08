// services/checkoutService.ts

import { CheckoutValidateRequest, CouponResponse } from '@/types/checkout';
import { SERVER_CONFIG } from '@/lib/api-config';

class CheckoutService {

    async validateCoupon(checkoutValidateRequest: CheckoutValidateRequest): Promise<CouponResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.checkout}/validateCoupon`;
        // console.log('🟢 Creating order, URL:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutValidateRequest),
        });

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'coupon validated failed, please contact support@mythtoy.com');
        }

        // console.log('createOrder service: ', apiResponse)
        return apiResponse.data;
    }
}

export const checkoutService = new CheckoutService();