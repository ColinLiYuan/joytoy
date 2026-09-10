// /lib/product-utils.ts
import { ProductResponse } from '@/types/product';

/** 尺码规格行识别的固定顺序（specKey 为 S/M/L/XL/XXL/XXXL 的规格行视为尺寸选项） */
export const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

/** 某个规格键是否为尺寸行（大小写不敏感） */
export const isSizeKey = (key: string | null | undefined): boolean =>
    SIZE_ORDER.includes(String(key || '').trim().toUpperCase());

/** 物理测量类规格键关键词（长/宽/直径/周长等；大小写不敏感，中英文键都识别） */
const MEASURE_KEYWORDS = [
    'length', 'width', 'diameter', 'circumference', 'girth', 'height', 'depth', 'insertable',
    '长', '宽', '直径', '周长', '插入', '高', '深',
];

/** 某个规格键是否为物理测量行（长/宽/周长等） */
export const isMeasureKey = (key: string | null | undefined): boolean => {
    const k = String(key || '').trim().toLowerCase();
    if (!k) return false;
    return MEASURE_KEYWORDS.some(w => k.includes(w));
};

export interface MeasureSpec {
    key: string;
    label: string;
    value: string;
}

/**
 * 提取物理测量规格（长/宽/周长/直径等），供购买区显眼展示。
 * 空值行剔除；标签 = 规格键美化（下划线/连字符转空格并首字母大写，中文原样）。
 */
export function getMeasureSpecs(specifications: Array<{ specKey: string; specValue: string }> | null | undefined): MeasureSpec[] {
    if (!specifications || specifications.length === 0) return [];
    return specifications
        .filter(s => isMeasureKey(s.specKey) && !isSizeKey(s.specKey))
        .filter(s => String(s.specValue || '').trim() !== '')
        .map(s => {
            const key = String(s.specKey).trim();
            const label = key
                .split(/[\s_-]+/)
                .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
                .join(' ');
            return { key, label, value: String(s.specValue).trim() };
        });
}

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

