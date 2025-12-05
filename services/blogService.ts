// services/blog-service.ts

import { ADMIN_CONFIG } from '@/lib/api-config';
import { AdminBlogResponse, AdminBlogListResponse } from '@/types/admin/adminBlog';
import {ReleaseBlogRequest} from "../types/admin/adminBlog";

export interface UploadResult {
    url: string;
    fileName: string;
    originalName: string;
    size: number;
    finalSlug: string;
}


class BlogService {
    async adminList(
        page: number = 0,
        size: number = 12,
        status?: string
    ): Promise<AdminBlogListResponse> {
        try {
            console.log('BlogService adminList')
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (status && status !== 'ALL') {
                queryParams.append('status', status);
            }

            const url = `${ADMIN_CONFIG.apiRoutes.blog}/list?${queryParams}`;
            console.log('BlogService adminList url: ', url)
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.error || 'Failed to fetch blogs');
            }

            return apiResponse.data || {
                content: [],
                currentPage: page,
                pageSize: size,
                totalElements: 0,
                totalPages: 0,
                hasNext: false,
                hasPrevious: false
            };
        } catch (error) {
            console.error('Error fetching blogs:', error);
            throw error;
        }
    }

    async getById(id: number): Promise<AdminBlogResponse> {
        try {
            const url = `${ADMIN_CONFIG.apiRoutes.blog}/fetch?id=${id}`;
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blog');
            }

            const apiResponse = await response.json();

            return apiResponse.data;
        } catch (error) {
            console.error('Get blog failed:', error);
            throw error;
        }
    }

    async release(request: ReleaseBlogRequest): Promise<AdminBlogResponse> {
        try {
            const url = `${ADMIN_CONFIG.apiRoutes.blog}/release`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Failed to create blog: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;
        } catch (error) {
            console.error('Create blog failed:', error);
            throw error;
        }
    }

    async uploadImage(
        file: File
    ): Promise<UploadResult> {
        try {
            // console.log('blog service uploadImage')

            const formData = new FormData();
            formData.append('file', file);

            const url = `${ADMIN_CONFIG.apiRoutes.blog}/upload`;
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `上传失败: ${response.status}`);
            }

            const apiResponse = await response.json();
            return apiResponse.data;

        } catch (error) {
            console.error('Upload image failed:', error);
            throw error;
        }
    }

    private getFileExtension(filename: string): string {
        if (!filename || filename.lastIndexOf('.') === -1) {
            return '.jpg';
        }
        return filename.slice(filename.lastIndexOf('.'));
    }

}

export const blogService = new BlogService();