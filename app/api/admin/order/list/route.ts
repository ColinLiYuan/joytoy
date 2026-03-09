// /app/api/admin/order/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const keyword = searchParams.get('keyword');
        const orderNumber = searchParams.get('orderNumber');
        const guestEmail = searchParams.get('guestEmail');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';
        const token = await getToken();

        console.log('token ', token)

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    errorMessage: '用户未登录，无法获取订单列表'
                },
                { status: 401 }
            );
        }

        let url = `/api/admin/V1/order/list?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;
        if (category) url += `&category=${category}`;
        if (keyword) url += `&keyword=${keyword}`;
        if (guestEmail) url += `&guestEmail=${guestEmail}`;
        if (orderNumber) url += `&orderNumber=${orderNumber}`;
        // console.log('query list url ' + url)

        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        const result = await apiGet(url, requestOptions);
        // console.log('admin product list route:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Order LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}