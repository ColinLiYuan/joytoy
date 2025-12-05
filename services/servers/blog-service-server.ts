// services/servers/blog-service-server.ts

import { BackendApiResponse } from '@/types/api';
import { SERVER_CONFIG } from '@/lib/api-config';
import { BlogListResponse, BlogResponse } from '@/types/site/blog';


class BlogServiceServer {
    async list(
        page: number = 0,
        size: number = 12,
        status?: string
    ): Promise<BlogListResponse> {
        try {
            // console.log('BlogServiceServer list')
            const queryParams = new URLSearchParams({
                page: page.toString(),
                size: size.toString()
            });

            if (status && status !== 'ALL') {
                queryParams.append('status', status);
            }

            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.blog}/list?${queryParams}`;
            console.log('BlogServiceServer list url: ', url)
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

            // console.log('BlogServiceServer list apiResponse.data: ', apiResponse.data)

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

    async getBySlug(slug: string): Promise<BlogResponse> {
        try {
            const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.blog}/detail?slug=${slug}`;
            console.log('BlogServiceServer getBySlug url:', url);
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch blog');
            }

            const apiResponse: BackendApiResponse = await response.json();

            return apiResponse;
        } catch (error) {
            console.error('Get blog failed:', error);
            throw error;
        }
    }


}

export const blogServiceServer = new BlogServiceServer();