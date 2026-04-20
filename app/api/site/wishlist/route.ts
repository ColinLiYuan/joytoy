import { NextRequest, NextResponse } from 'next/server';
import { apiGet, apiPost, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

// GET: 获取心愿单列表
export async function GET(request: NextRequest) {
    try {
        // 1. 获取 token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: '用户未登录，无法获取心愿列表'
                },
                { status: 401 }
            );
        }

        // 2. 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 3. 调用后端 API 获取心愿单列表
        const result = await apiGet(`/api/V1/wishlist`, requestOptions);

        // 确保返回标准 JSON 格式
        return NextResponse.json({
            success: result.success,
            message: result.message,
            data: result.data
        });

    } catch (error) {
        console.error('Wishlist GET Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { 
                success: false, 
                message: errorMessage || '获取心愿单失败' 
            },
            { status: 500 }
        );
    }
}

// POST: 添加到心愿单
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 1. 获取 token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: '用户未登录，无法添加心愿单'
                },
                { status: 401 }
            );
        }

        // 2. 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 3. 调用后端 API 添加到心愿单
        console.log('[Wishlist POST] Calling backend API with body:', body);
        const result = await apiPost(`/api/V1/wishlist`, body, requestOptions);
        console.log('[Wishlist POST] Backend API result:', result);

        // 确保返回标准 JSON 格式
        return NextResponse.json({
            success: result.success,
            message: result.message,
            data: result.data
        });

    } catch (error) {
        console.error('Wishlist POST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            {
                success: false,
                message: errorMessage || '添加到心愿单失败'
            },
            { status: 500 }
        );
    }
}
