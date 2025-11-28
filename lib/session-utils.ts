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
     * 为会话购物车准备请求头
     */
    static prepareSessionHeaders(cartId: string, sessionId: string): any {
        if (cartId === '0') {
            return {
                headers: {
                    'X-Session-Id': sessionId
                }
            };
        }
        return {};
    }
}