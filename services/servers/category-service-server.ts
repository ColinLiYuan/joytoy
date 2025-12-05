// services/servers/category-service-server.ts
import { CategoryResponse } from '@/types/category';
import {RootResponse} from "@/types/category";
import { categoryCache } from '@/lib/server-cache';
import { SERVER_CONFIG } from '@/lib/api-config';

class CategoryServiceServer {
    private readonly ROOTS_CACHE_KEY = 'category_roots';
    private readonly ALL_CATEGORIES_CACHE_KEY = 'all_categories';

    // async getRoots(): Promise<RootResponse[]> {
    //     // process.stderr.write('CategoryServiceServer getRoots start:')
    //     categoryCache.clear();
    //     return categoryCache.getOrSet(
    //         this.ROOTS_CACHE_KEY,
    //         async () => {
    //             try {
    //                 // process.stderr.write('CategoryServiceServer getRoots url before: \n')
    //                 const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.category}/root`;
    //                 // process.stderr.write(`🚨 调用API URL: ${url}\n`);
    //                 const response = await fetch(url, {
    //                     cache: 'no-store',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //
    //                 // process.stderr.write(`after api response : ${response.ok}\n`);
    //
    //                 if (!response.ok) {
    //                     const errorText = await response.text();
    //                     console.error('❌ API response error:', errorText);
    //                     throw new Error(`API route fetch failed: ${response.status}`);
    //                 }
    //
    //                 const apiResponse = await response.json();
    //
    //                 if (!apiResponse.success) {
    //                     throw new Error(apiResponse.error || 'API route returned error');
    //                 }
    //
    //                 const roots = apiResponse.data || [];
    //                 // process.stderr.write('✅ Roots loaded from API:${roots.length}items');
    //                 return roots;
    //             } catch (error) {
    //                 console.error('❌ Error fetching category roots:', error);
    //                 return [];
    //             }
    //         },
    //         // 24 * 60 * 60 * 1000
    //         0
    //     );
    // }
    //
    // async getCategories(): Promise<CategoryResponse[]> {
    //     // process.stderr.write('CategoryServiceServer getCategories start:')
    //     return categoryCache.getOrSet(
    //         this.ALL_CATEGORIES_CACHE_KEY,
    //         async () => {
    //             try {
    //                 const url = `${SERVER_CONFIG.baseURL}${SERVER_CONFIG.apiRoutes.category}`;
    //                 // process.stderr.write(`🚨 调用URL: ${url}\n`);
    //                 const response = await fetch(url, {
    //                     cache: 'no-store',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                 });
    //
    //                 if (!response.ok) {
    //                     const errorText = await response.text();
    //                     console.error('❌ API response error:', errorText);
    //                     throw new Error(`API route fetch failed: ${response.status}`);
    //                 }
    //
    //                 const apiResponse = await response.json();
    //
    //                 if (!apiResponse.success) {
    //                     throw new Error(apiResponse.error || 'API route returned error');
    //                 }
    //
    //                 const categories = apiResponse.data || [];
    //                 // console.log('✅ Categories loaded from API:', categories.length, 'items');
    //                 return categories;
    //             } catch (error) {
    //                 console.error('❌ Error fetching categories:', error);
    //                 return [];
    //             }
    //         },
    //         24 * 60 * 60 * 1000
    //     );
    // }
    //
    // async getCategoryBySlug(slug: string): Promise<CategoryResponse | null> {
    //     try {
    //         const categories = await this.getCategories();
    //         // console.log('getCategoryBySlug categories:' + categories);
    //         return categories.find(cat => cat.slug === slug) || null;
    //     } catch (error) {
    //         console.error('Error finding category by slug:', error);
    //         return null;
    //     }
    // }
}

export const categoryServiceServer = new CategoryServiceServer();