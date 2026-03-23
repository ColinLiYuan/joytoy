import { NextResponse } from 'next/server';
import { BACKEND_CONFIG } from '@/lib/api-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9356';

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/users/verify-email?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.text();

        if (!response.ok) {
            return NextResponse.json(
                { error: data || 'Email verification failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({ message: data });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}