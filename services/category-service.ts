// services/category-service.ts
import {RootResponse} from "@/types/category";
import { ADMIN_CONFIG } from '@/lib/api-config';

class CategoryService {

    async getRoots(): Promise<RootResponse[]> {
        try {
            const url = `${ADMIN_CONFIG.apiRoutes.category}/root`;
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API response error:', errorText);
                throw new Error(`API route fetch failed: ${response.status}`);
            }

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.error || 'API route returned error');
            }

            const roots = apiResponse.data || [];
            return roots;
        } catch (error) {
            console.error('❌ Error fetching category roots:', error);
            return [];
        }
    }

}

export const categoryService = new CategoryService();