// services/blog-service.ts

import axiosClient from '@/lib/axios-client';
import { AdminBlogResponse, AdminBlogListResponse } from '@/types/blog';
import { BlogListResponse, BlogResponse } from '@/types/site/blog';
import { BACKEND_API_ROUTES } from '@/lib/api-config';

class BlogService {
    /**
     * 获取博客列表 (用户端 - 查询)
     */
    async list(
        page: number = 0,
        size: number = 12
    ): Promise<BlogListResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            const url = `/api/V1/blog/list?${queryParams}`;
            console.log('[BlogService] Fetching blogs from:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data || {
                    content: [],
                    currentPage: page,
                    pageSize: size,
                    totalElements: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrevious: false
                };
            }

            throw new Error(response.data?.message || 'Failed to fetch blogs');
        } catch (error) {
            console.error('❌ [BlogService] Error fetching blogs:', error);
            throw error;
        }
    }

    /**
     * 根据 slug 获取博客详情 (用户端 - 查询)
     */
    async getBySlug(slug: string): Promise<BlogResponse> {
        try {
            const url = `/api/V1/blog?slug=${encodeURIComponent(slug)}`;
            console.log('[BlogService] Fetching blog by slug:', url);
            
            const response = await axiosClient.get(url);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Blog not found');
        } catch (error) {
            console.error('❌ [BlogService] Get blog failed:', error);
            throw error;
        }
    }

    /**
     * 获取管理端博客列表 (查询 - 使用 Axios 直连后端)
     */
    async adminList(
        page: number = 0,
        size: number = 12,
        status?: string,
        sortBy?: string,
        keyword?: string
    ): Promise<AdminBlogListResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (status && status !== 'ALL') {
                queryParams.append('status', status);
            }
            
            if (sortBy) {
                queryParams.append('sortBy', sortBy);
            }

            if (keyword) {
                queryParams.append('keyword', keyword);
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

    /**
     * 上传图片 (写操作 - 使用 Axios 直连后端)
     */
    async uploadImage(file: File): Promise<{ url: string }> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const url = `${BACKEND_API_ROUTES.admin.blog.upload}`;
            console.log('[BlogService] Uploading image to:', url);
            
            const response = await axiosClient.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('[BlogService] Upload image response:', response.data);

            if (response.data?.success) {
                return response.data.data;
            }

            throw new Error(response.data?.message || 'Failed to upload image');
        } catch (error) {
            console.error('❌ [BlogService] Upload image failed:', error);
            throw error;
        }
    }
}

export const blogService = new BlogService();