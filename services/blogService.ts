// services/blog-service.ts

import axiosClient from '@/lib/axios-client';
import { AdminBlogResponse, AdminBlogListResponse } from '@/types/admin/adminBlog';
import { BACKEND_API_ROUTES } from '@/lib/api-config';

class BlogService {
    /**
     * 获取管理端博客列表 (查询 - 使用 Axios 直连后端)
     */
    async adminList(
        page: number = 0,
        size: number = 12,
        status?: string
    ): Promise<AdminBlogListResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (status && status !== 'ALL') {
                queryParams.append('status', status);
            }

            const url = `${BACKEND_API_ROUTES.admin.blog.list}?${queryParams}`;
            console.log('[BlogService] Fetching admin blogs from:', url);
            
            const response = await axiosClient.get(url);
            console.log('[BlogService] Admin blogs response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch blogs');
        } catch (error) {
            console.error('❌ [BlogService] Error fetching blogs:', error);
            throw error;
        }
    }

    /**
     * 根据ID获取博客详情 (查询 - 使用 Axios 直连后端)
     */
    async getById(id: number): Promise<AdminBlogResponse> {
        try {
            const url = `${BACKEND_API_ROUTES.admin.blog.detail}/${id}`;
            console.log('[BlogService] Fetching blog by ID:', url);
            
            const response = await axiosClient.get(url);
            console.log('[BlogService] Blog detail response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to fetch blog');
        } catch (error) {
            console.error('❌ [BlogService] Get blog failed:', error);
            throw error;
        }
    }
}

export const blogService = new BlogService();