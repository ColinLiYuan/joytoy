// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { OrderCreateRequest } from '@/types/order';
import { getToken } from '@/lib/cookie-utils';

export async function POST(request: NextRequest) {
    try {
        const body: OrderCreateRequest = await request.json();

        // 验证必需字段
        if (!body.items || !body.shippingAddress || !body.paymentMethod || !body.shippingMethod) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: items, shippingAddress, paymentMethod, shippingMethod'
                },
                { status: 400 }
            );
        }

        // 验证商品列表
        if (body.items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order must contain at least one item'
                },
                { status: 400 }
            );
        }

        // 验证每个商品项的必需字段
        for (let i = 0; i < body.items.length; i++) {
            const item = body.items[i];
            if (!item.productId || !item.quantity || !item.productTitle || item.unitPrice === undefined) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Item ${i + 1} is missing required fields: productId, quantity, productTitle, or unitPrice`
                    },
                    { status: 400 }
                );
            }

            // 验证数值有效性
            if (item.quantity <= 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Item ${i + 1} quantity must be greater than 0`
                    },
                    { status: 400 }
                );
            }

            if (item.unitPrice < 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Item ${i + 1} unitPrice cannot be negative`
                    },
                    { status: 400 }
                );
            }
        }

        // 设置默认值（如果未提供）
        const orderData: OrderCreateRequest = {
            ...body,
            shippingFee: body.shippingFee ?? 0,
            discountAmount: body.discountAmount ?? 0,
            customerNote: body.customerNote ?? ''
        };

        // 获取 token
        const token = await getToken();
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: '用户未登录，无法创建订单'
                },
                { status: 401 }
            );
        }

        // 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 调用后端API创建订单
        const result = await apiPost('/api/V1/order', orderData, requestOptions);
        // console.log('🟢 Backend API response:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 ORDER CREATE Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            {
                success: false,
                errorMessage
            },
            { status: 500 }
        );
    }
}