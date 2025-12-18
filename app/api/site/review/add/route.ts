// app/api/review/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { ReviewCreateRequest } from '@/types/review';
import { getToken } from '@/lib/token-utils';

export async function POST(request: NextRequest) {
    try {
        const body: ReviewCreateRequest = await request.json();

        const reviewData: ReviewCreateRequest = {
            ...body,
        };
        // console.log('create review route: ', reviewData)

        // 获取 token
        const token = await getToken();
        // if (!token) {
        //     return NextResponse.json(
        //         {
        //             success: false,
        //             error: 'user not login, cant create review'
        //         },
        //         { status: 401 }
        //     );
        // }

        // 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 调用后端API创建订单
        const result = await apiPost('/api/V1/review', reviewData, requestOptions);
        // console.log('🟢 Backend API response:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 Review CREATE Error:', error);
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