// lib/image-utils.ts
import { envData } from '@/lib/constants/env-data';

/**
 * 安全地获取图片URL
 * @param url 图片URL
 * @returns 安全的图片URL
 */
export const getSafeImageUrl = (url: string | undefined): string => {
    if (!url) return '/images/placeholder.jpg';

    // 处理相对路径
    if (url.startsWith('/')) {
        return url;
    }

    // 处理完整URL
    try {
        new URL(url);
        return url;
    } catch {
        // 如果是无效URL，返回占位图
        return '/images/placeholder.jpg';
    }
};

/**
 * 构建产品图片URL
 * @param baseUrl 基础URL
 * @param imagePath 图片路径
 * @returns 完整的产品图片URL
 */
export const getProductImageUrl = (baseUrl: string | undefined, imagePath: string | undefined): string => {
    if (!imagePath) return '/images/placeholder.jpg';

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http')) {
        return getSafeImageUrl(imagePath);
    }

    // 使用环境变量中的配置
    // 如果提供了 baseUrl 且不为空字符串，使用它；否则使用环境变量中的 CDN URL
    const effectiveBaseUrl = (baseUrl && baseUrl !== '') ? baseUrl : envData.imageUploadPath;

    // 清理路径中的多余斜杠
    const cleanBaseUrl = effectiveBaseUrl.replace(/\/+$/, '');
    const cleanImagePath = imagePath.replace(/^\/+/, '');

    // 构建完整URL
    const fullUrl = `${cleanBaseUrl}/${cleanImagePath}`;
    const url = getSafeImageUrl(fullUrl);

    return url;
};
