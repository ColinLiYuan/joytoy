// utils/userUtils.ts
import { LoginResponse } from '@/types/auth';

// 获取用户信息
export const getUserInfo = (): LoginResponse | null => {
    try {
        if (typeof window === 'undefined') return null;

        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const savedUserInfo = JSON.parse(userInfoString) as LoginResponse;
            return savedUserInfo;
        }
        return null;
    } catch {
        return null;
    }
};

// 获取用户完整姓名
export const getUserFullName = (): string => {
    const userInfo = getUserInfo();
    return userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : '';
};

// 获取用户邮箱
export const getUserEmail = (): string => {
    const userInfo = getUserInfo();
    return userInfo?.email || '';
};

// 获取用户ID
export const getUserId = (): number | null => {
    const userInfo = getUserInfo();
    return userInfo?.id || null;
};

// 获取购物车ID
export const getCartId = (): number | null => {
    const cartIdString = localStorage.getItem('cartId');
    if (cartIdString) {
        return Number(cartIdString);
    }
    return null;
};

// 获取认证token
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

// 检查用户是否已登录
export const isUserLoggedIn = (): boolean => {
    return !!(getUserInfo() && getAuthToken());
};