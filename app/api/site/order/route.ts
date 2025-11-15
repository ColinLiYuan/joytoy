// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { OrderCreateRequest, OrderItemRequest, AddressRequest } from '@/types/order';

export async function POST(request: NextRequest) {
    // console.log('🟢 ORDER CREATE route HIT!');
    try {
        const body: OrderCreateRequest = await request.json();
        // console.log('🟢 Order create request body:', body);

        // 验证必需字段
        if (!body.userId || !body.items || !body.shippingAddress || !body.paymentMethod || !body.shippingMethod) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: userId, items, shippingAddress, paymentMethod, shippingMethod'
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

        // console.log('111111111');
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

        // console.log('222222222222222222*****');
        // 验证配送地址
        // const address = body.shippingAddress;
        // const requiredAddressFields = ['firstName', 'lastName', 'email', 'phone', 'country', 'province', 'city', 'addressLine1', 'zipCode'] as const;
        //
        // for (const field of requiredAddressFields) {
        //     const value = address[field as keyof AddressRequest];
        //     if (!value) {
        //         return NextResponse.json(
        //             {
        //                 success: false,
        //                 error: `Missing required shipping address field: ${field}`
        //             },
        //             { status: 400 }
        //         );
        //     }
        // }

        // console.log('33333333333333333');
        // 验证邮箱格式
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(address.email)) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             error: 'Invalid email format in shipping address'
        //         },
        //         { status: 400 }
        //     );
        // }
        //
        // console.log('444444444444444');
        // // 验证电话号码格式（基础验证）
        // const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        // if (!phoneRegex.test(address.phone.replace(/[\s\-\(\)]/g, ''))) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             error: 'Invalid phone number format in shipping address'
        //         },
        //         { status: 400 }
        //     );
        // }

        // console.log('55555555555');
        // 设置默认值（如果未提供）
        const orderData: OrderCreateRequest = {
            ...body,
            shippingFee: body.shippingFee ?? 0,
            discountAmount: body.discountAmount ?? 0,
            customerNote: body.customerNote ?? ''
        };


        // 调用后端API创建订单
        // console.log('🟢 Order create API before:');
        const result = await apiPost('/api/V1/order', orderData);
        // console.log('🟢 Order create API result:', result);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to create order'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('🔴 ORDER CREATE Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}