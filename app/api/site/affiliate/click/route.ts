// app/api/affiliate/click/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        // 核心：在服务端获取 IP 和 User-Agent，前端不用传
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            '127.0.0.1';

        // 拼凑出 Java 后端数据库需要的完整字段
        const fullData = {
            ...body,
            ipAddress, // 数据库对应的 ip_address
            userAgent  // 数据库对应的 user_agent
        };

        // 调用 Java Spring Boot 接口
        const result = await apiPost('/api/V1/affiliate/click', fullData);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Affiliate Click Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}