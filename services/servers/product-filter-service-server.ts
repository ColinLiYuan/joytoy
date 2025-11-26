// services/servers/product-filter-service-server.ts
import { FilterResponse } from '@/types/filters';
import { filterData, getFiltersByType } from '@/lib/constants/filter-data';

class ProductFilterServiceServer {
    async getFilters(type?: string): Promise<FilterResponse[]> {
        try {
            if (type) {
                const filters = getFiltersByType(type);
                // console.log('getFiltersByType : ', filters)

                if (type === 'features') {
                    // features返回完整对象
                    return filters.map((filter: any) => ({
                        keyWord: filter.keyWord,
                        marketingWords: filter.marketingWords
                    }));
                } else {
                    // colors和materials返回只有keyWord的对象
                    return filters.map((keyWord: string) => ({
                        keyWord: keyWord
                    }));
                }
            } else {
                // 返回所有过滤器（扁平化）
                const allFilters: FilterResponse[] = [];

                // 处理colors
                filterData.colors.forEach(keyWord => {
                    allFilters.push({ keyWord });
                });

                // 处理materials
                filterData.materials.forEach(keyWord => {
                    allFilters.push({ keyWord });
                });

                // 处理features
                filterData.features.forEach(filter => {
                    allFilters.push({
                        keyWord: filter.keyWord,
                        marketingWords: filter.marketingWords
                    });
                });

                return allFilters;
            }
        } catch (error) {
            console.error('Error getting filters:', error);
            return [];
        }
    }
}

export const filterServiceServer = new ProductFilterServiceServer();