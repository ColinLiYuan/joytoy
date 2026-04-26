// services/filterService.ts
import { getFiltersByType } from '@/lib/constants/filter-data';

class FilterService {
    async getFilters(type?: string): Promise<any[]> {
        try {
            // 从本地常量获取过滤器数据
            if (type) {
                return getFiltersByType(type);
            }
            // 返回所有类型
            return [
                ...getFiltersByType('colors'),
                ...getFiltersByType('features'),
                ...getFiltersByType('materials')
            ];
        } catch (error) {
            console.error('❌ [FilterService] Error fetching filters:', error);
            return [];
        }
    }
}

export const filterService = new FilterService();
