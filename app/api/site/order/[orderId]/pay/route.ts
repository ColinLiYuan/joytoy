// app/api/order/[id]/pay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

// 修改这里的类型定义
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ orderId: string }> }  // params 应该是 Promise
) {
    try {
        // 等待 params 解析
        const params = await context.params;
        const orderId = params.orderId;

        if (!orderId) {
            return NextResponse.json(
                {
                    success: false,
                    error: '订单ID不能为空'
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        // 验证支付必需的字段
        if (!body.transactionId || !body.paymentMethod || !body.amount) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: transactionId, paymentMethod, amount'
                },
                { status: 400 }
            );
        }

        // 验证金额
        if (body.amount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: '支付金额必须大于0'
                },
                { status: 400 }
            );
        }

        // 获取 token
        const token = await getToken();
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: '用户未登录，无法进行支付'
                },
                { status: 401 }
            );
        }

        // 准备请求头
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 调用后端API进行支付
        const result = await apiPost(`/api/V1/order/${orderId}/pay`, body, requestOptions);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 PAYMENT Error:', error);
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