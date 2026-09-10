// /lib/product-utils.ts
import { ProductResponse } from '@/types/product';

/** 尺码规格行识别的固定顺序（specKey 为 S/M/L/XL/XXL/XXXL 的规格行视为尺寸选项） */
export const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export interface SizeOption {
    size: string;
    value: string;
}

/**
 * 从规格表提取尺寸选项（每尺寸一行规格：specKey=S/M/L/...，specValue=该尺寸实测数据）。
 * 与 nitto 的 "Sizes" 单行约定不同：myth 用每尺寸一行，value 即「S 对应多少」的答案。
 * 解析不出尺寸行返回 []（商品不展示尺寸选择区）。
 */
export function getSizeOptions(specifications: Array<{ specKey: string; specValue: string }> | null | undefined): SizeOption[] {
    if (!specifications || specifications.length === 0) return [];
    const rows = specifications
        .filter(s => SIZE_ORDER.includes(String(s.specKey || '').trim().toUpperCase()))
        .map(s => ({ size: String(s.specKey).trim().toUpperCase(), value: String(s.specValue || '').trim() }))
        .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size));
    return rows;
}

/** 从定制 JSON 快照里取尺寸（购物车展示用；解析失败返回 null） */
export function getSizeFromCustomization(customization: string | null | undefined): string | null {
    if (!customization) return null;
    try {
        const parsed = JSON.parse(customization);
        const size = parsed?.optionSnapshot?.size;
        return typeof size === 'string' && size ? size : null;
    } catch {
        return null;
    }
}

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

