// types/auth.ts

import {OrderResponse} from "./order";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    affiliateId: string;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
    status: string;
    emailVerified: boolean;
    cartId: number;
    lastLoginAt?: string;
    
    // ✅ 新增权限字段
    role?: 'CUSTOMER' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isAffiliate?: boolean;

    // 用户消费数据 (用于复购优惠)
    orderCount?: number;
    totalSpent?: number;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    newsletterSubscribed?: boolean;
    marketingEmails?: boolean;
}

export interface RegisterResponse {
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    emailVerified: boolean;
}

export interface UserListResponse {
    content: UserResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface UserResponse {
    id: number;
    uuid: string;
    email: string;
    affiliateId: string; // 联盟 ID
    firstName: string;
    lastName: string;
    displayName: string;
    phone?: string;
    status: 'PENDING' | 'ACTIVE' | 'BANNED' | 'DELETED'; // 用户状态枚举
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}