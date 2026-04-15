// services/servers/blog-service-server.ts

import { callBackendGet } from '@/lib/backend-utils';
import { BlogListResponse, BlogResponse } from '@/types/site/blog';


class BlogServiceServer {
    async list(
        page: number = 0,
        size: number = 12,
        status?: string
    ): Promise<BlogListResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (status && status !== 'ALL') {
                queryParams.append('status', status);
            }

            const url = `/api/V1/blog/list?${queryParams}`;

            const result = await callBackendGet<BlogListResponse>(url, {
                requiresAuth: false
            });

            return result.data || {
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

    async getBySlug(slug: string): Promise<BlogResponse> {
        try {
            const url = `/api/V1/blog?slug=${encodeURIComponent(slug)}`;

            const result = await callBackendGet<BlogResponse>(url, {
                requiresAuth: false
            });

            return result.data!;
        } catch (error) {
            console.error('Get blog failed:', error);
            throw error;
        }
    }
}

export const blogServiceServer = new BlogServiceServer();