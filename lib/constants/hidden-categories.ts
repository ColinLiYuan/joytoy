// lib/constants/hidden-categories.ts
// 隐藏分类名单：命中分类的商品从 sitemap / Google Merchant feed 中剔除，
// 商品页与分类页加 noindex，站外直链仍可正常访问下单。
// 商城导航/首页是硬编码分类树，隐藏分类本就不展示，无需处理。
// 匹配规则：精确、前缀（子分类）、后缀均算命中；新增隐藏分类在此加一行。
export const HIDDEN_CATEGORIES = ['realistic', 'torso'];

export function isHiddenCategory(categories?: string[] | null): boolean {
    if (!categories || categories.length === 0) return false;
    return categories.some((cat) =>
        HIDDEN_CATEGORIES.some(
            (hidden) =>
                cat === hidden ||
                cat.startsWith(hidden + '/') ||
                cat.endsWith('/' + hidden)
        )
    );
}
