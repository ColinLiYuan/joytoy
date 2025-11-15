import { NextResponse } from 'next/server';
import { BACKEND_CONFIG } from '@/lib/api-config';

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.text();

        if (!response.ok) {
            return NextResponse.json(
                { error: data || 'Password reset request failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: data });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}