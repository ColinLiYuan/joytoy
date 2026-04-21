import { NextRequest, NextResponse } from 'next/server';
import { affiliateFetch } from '@/lib/affiliate-fetch';

export async function GET(request: NextRequest) {
    return affiliateFetch(request, '/api/V1/affiliate/dashboard');
}