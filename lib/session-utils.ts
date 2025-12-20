// lib/session-utils.ts

import { NextRequest, NextResponse } from 'next/server';

export class SessionManager {
    /**
     * 获取或创建 sessionId
     */
    static getOrCreateSessionId(request: NextRequest): { sessionId: string; isNew: boolean } {
        let sessionId = request.cookies.get('CART_SESSION_ID')?.value;
        let isNew = false;

        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            isNew = true;
        }

        return { sessionId, isNew };
    }

    /**
     * 设置 sessionId 到 Cookie
     */
    static setSessionCookie(response: NextResponse, sessionId: string): void {
        response.cookies.set('CART_SESSION_ID', sessionId, {
            maxAge: 30 * 24 * 60 * 60, // 30天
            path: '/',
            httpOnly: true,
            sameSite: 'lax'
        });
    }


    /**
     * ✅ 新增：删除 Session Cookie
     * 这会让浏览器在收到响应后立刻丢弃该 Cookie
     */
    static deleteSessionCookie(response: NextResponse): void {
        response.cookies.delete('CART_SESSION_ID');
    }

    /**
     * 为会话购物车准备请求头
     */
    static prepareSessionHeaders(sessionId: string): any {
        return {
            headers: {
                'X-Session-Id': sessionId
            }
        };
    }
}