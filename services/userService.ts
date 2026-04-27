// services/userService.ts
import axiosClient from '@/lib/axios-client';
import { BACKEND_API_ROUTES } from '@/lib/api-config';
import { UserListResponse } from '@/types/auth';

class UserService {
    /**
     * 获取管理端用户列表 (查询 - 使用 Axios 直连后端)
     */
    async adminList(
        page: number = 0,
        size: number = 10,
        keyword?: string,
        status?: string,
        sortBy?: string
    ): Promise<UserListResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sortBy: sortBy || 'lastLoginAt'  // 默认按登录时间排序（后端默认降序）
            });

            if (keyword) {
                queryParams.append('keyword', keyword);
            }
            
            if (status) {
                queryParams.append('status', status);
            }

            const url = `${BACKEND_API_ROUTES.admin.user.list}?${queryParams}`;
            console.log('[UserService] Fetching admin users from:', url);
            
            const response = await axiosClient.get(url);
            console.log('[UserService] Admin users response status:', response.status);
            console.log('[UserService] Admin users response data:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch users');
        } catch (error) {
            console.error('❌ [UserService] Error fetching users:', error);
            throw error;
        }
    }
}

export const userService = new UserService();
