import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // ✅ 关键修改：直接获取所有查询参数字符串
        // 这样前端传 keyword, page, size, sort 等任何参数，都会自动转发给后端
        const queryString = searchParams.toString();

        // 拼接后端真实地址
        const url = `/api/V1/product/list?${queryString}`;

        // console.log('Proxying to backend:', url);

        const result = await apiGet(url);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 PRODUCT LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}