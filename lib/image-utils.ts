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
    if (!baseUrl || !imagePath) return '/images/placeholder.jpg';

    const fullUrl = `${baseUrl}/${imagePath}`;
    const url = getSafeImageUrl(fullUrl);

    if (process.env.NODE_ENV === 'development') {
        console.log('getProductImageUrl called with:', { baseUrl, imagePath, result: url });
    }
    return url;
};