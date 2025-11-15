// /lib/product-utils.ts
import { ProductResponse } from '@/types/product';

/**
 * 获取产品的颜色
 * 如果 product.color 存在且不为空，直接使用
 * 如果 colors 数组存在且有值，获取第一个颜色
 * 否则返回默认值 'Default'
 */
export const getProductColor = (product: ProductResponse): string => {
    // 如果 product.color 存在且不为空，直接使用
    if (product.color && product.color.trim() !== '') {
        return product.color;
    }

    // 如果 colors 数组存在且有值，获取第一个颜色
    if (product.colors && product.colors.length > 0) {
        return product.colors[0];
    }

    // 默认值
    return 'Default';
};

