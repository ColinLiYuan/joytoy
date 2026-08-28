// services/collectionService.ts
// 商品集合前台服务（GET /api/V1/collections/{slug} 落地页 + GET /api/V1/home 首页聚合）。
// 客户端相对路径经 next.config rewrites 代理；SSR 时 axiosClient 直连后端。
import axiosClient from '@/lib/axios-client';
import { CollectionDetailResponse, HomeResponse } from '@/types/collection';

class CollectionService {

    /**
     * 集合落地页（按 slug）。
     * 失败/不存在返回 null，由页面决定回退（[slug] 页回退到分类渲染）。
     */
    async getBySlug(slug: string, page: number = 0, size: number = 12): Promise<CollectionDetailResponse | null> {
        try {
            const url = `/api/V1/collections/${encodeURIComponent(slug)}?page=${page}&size=${size}`;
            const response = await axiosClient.get(url);
            if (response.data?.success) {
                return response.data.data || null;
            }
            return null;
        } catch (error) {
            console.error('❌ [CollectionService] getBySlug error:', error);
            return null;
        }
    }

    /** 首页聚合：featuredProducts + show_on_home 集合卡片（含商品预览） */
    async getHome(): Promise<HomeResponse | null> {
        try {
            const response = await axiosClient.get('/api/V1/home');
            if (response.data?.success) {
                return response.data.data || null;
            }
            return null;
        } catch (error) {
            console.error('❌ [CollectionService] getHome error:', error);
            return null;
        }
    }
}

export const collectionService = new CollectionService();
