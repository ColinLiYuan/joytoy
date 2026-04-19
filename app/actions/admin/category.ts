'use server'

import { RootResponse } from '@/types/category'
import { categoryService } from '@/services/category-service'

// 获取根分类（包含子分类）- 使用本地数据
export async function getAdminRootCategories(): Promise<RootResponse[]> {
    try {
        // 直接使用本地的 categoryService，它会从常量数据生成
        const roots = await categoryService.getRoots()
        return roots
    } catch (error) {
        console.error('Server Action: Error fetching categories:', error)
        return []
    }
}
