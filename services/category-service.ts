// services/category-service.ts
import { CategoryResponse, RootResponse } from '@/types/category';
import { CATEGORIES_DATA } from '@/lib/constants/category-data';

class CategoryService {

    private readonly DATA_VERSION = 'v1.0.6'; // 每次数据更新就改这个版本号
    private readonly ROOTS_STORAGE_KEY = `category_roots_${this.DATA_VERSION}`;
    private readonly ALL_CATEGORIES_STORAGE_KEY = `all_categories_${this.DATA_VERSION}`;

    // 从常量数据生成roots数据
    private generateRoots(): RootResponse[] {
        return CATEGORIES_DATA.category.roots.map(root => ({
            slug: root.slug,
            name: root.name,
            title: root.title,
            description: root.description,
            priority: root.priority,
            changefreq: root.changefreq,
            categories: root.categories || []
        }));
    }

    // 从常量数据生成所有分类数据
    private generateAllCategories(): CategoryResponse[] {
        const allCategories: CategoryResponse[] = [];

        CATEGORIES_DATA.category.roots.forEach(root => {
            // 添加根分类
            allCategories.push({
                slug: root.slug,
                name: root.name,
                title: root.title,
                description: root.description,
                root: root.slug,
                priority: root.priority,
                changefreq: root.changefreq
            });

            // 添加子分类
            if (root.categories) {
                root.categories.forEach(subCategory => {
                    allCategories.push({
                        slug: subCategory.slug,
                        name: subCategory.name,
                        title: subCategory.title,
                        description: subCategory.description,
                        root: subCategory.root,
                        priority: subCategory.priority,
                        changefreq: subCategory.changefreq
                    });
                });
            }
        });

        return allCategories;
    }

    private cleanupOldCache() {
        if (typeof window === 'undefined') return;

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('category_roots_v') &&
                key !== this.ROOTS_STORAGE_KEY) {
                localStorage.removeItem(key);
            }
            if (key.startsWith('all_categories_v') &&
                key !== this.ALL_CATEGORIES_STORAGE_KEY) {
                localStorage.removeItem(key);
            }
        });
    }

    async getRoots(): Promise<RootResponse[]> {
        this.cleanupOldCache();

        if (typeof window === 'undefined') {
            return this.generateRoots();
        }

        try {
            const cached = localStorage.getItem(this.ROOTS_STORAGE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }

            const roots = this.generateRoots();
            localStorage.setItem(this.ROOTS_STORAGE_KEY, JSON.stringify(roots));
            return roots;
        } catch (error) {
            console.error('Error getting roots:', error);
            return this.generateRoots();
        }
    }

    async getCategories(): Promise<CategoryResponse[]> {
        // // 如果是服务端渲染，直接返回生成的数据
        if (typeof window === 'undefined') {
            return this.generateAllCategories();
        }

        try {
            // 检查localStorage中是否有缓存
            const cached = localStorage.getItem(this.ALL_CATEGORIES_STORAGE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }

            // 生成新数据并永久缓存
            const categories = this.generateAllCategories();
            localStorage.setItem(this.ALL_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));

            return categories;
        } catch (error) {
            console.error('Error getting categories from cache, using generated data:', error);
            return this.generateAllCategories();
        }
    }

    async getCategoryBySlug(slug: string): Promise<CategoryResponse | null> {
        try {
            const categories = await this.getCategories();
            return categories.find(cat => cat.slug === slug) || null;
        } catch (error) {
            console.error('Error finding category by slug:', error);
            return null;
        }
    }

}

export const categoryService = new CategoryService();