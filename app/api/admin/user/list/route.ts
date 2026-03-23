// /app/api/admin/user/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // 1. 获取分页与筛选参数
        const keyword = searchParams.get('keyword');
        const status = searchParams.get('status');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';
        const sortBy = searchParams.get('sortBy') || 'createdAt';

        // 2. 获取管理员 Token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    errorMessage: 'Authentication required. Please log in as administrator.'
                },
                { status: 401 }
            );
        }

        // 3. 构建后端 Java 接口请求路径
        // 这里的路径应对应你后端 AdminUserInterface 定义的 @RequestMapping("/api/admin/V1/users")
        let url = `/api/admin/V1/users/list?page=${page}&size=${size}&sortBy=${sortBy}`;

        if (status) url += `&status=${status}`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        // 4. 发起请求并返回结果
        const result = await apiGet(url, requestOptions);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 Admin User List Route Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}