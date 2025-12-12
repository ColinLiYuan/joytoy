import { LoginResponse } from '@/types/auth';
import { cookies } from 'next/headers';

export async function getServerUserInfo(): Promise<LoginResponse | null> {
    try {
        const cookieStore = await cookies();

        // const allCookies = cookieStore.getAll();
        // console.log('🔍 ALL COOKIES:', allCookies);
        // console.log('🔍 Cookie names:', allCookies.map(cookie => cookie.name));

        const userInfoCookie = cookieStore.get('userInfo')?.value;

        // console.log('🔍 getServerUserInfo - userInfoCookie exists:', !!userInfoCookie);

        if (!userInfoCookie) {
            return null;
        }
        // console.log('🔍 getServerUserInfo - userInfoCookie value:', userInfoCookie);

        const userInfo = JSON.parse(userInfoCookie);
        return userInfo;
    } catch (error) {
        console.error('Failed to get server user info:', error);
        return null;
    }
}

/**
 * 服务端：获取用户ID
 */
export async function getServerUserId(): Promise<number | null> {
    const userInfo = await getServerUserInfo();
    return userInfo?.id || null;
}

export async function getToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies();

        const accessToken = cookieStore.get('accessToken')?.value;

        return accessToken || null;
    } catch (error) {
        console.error('Failed to get token from cookies:', error);
        return null;
    }
}