// components/product/product-badge.tsx
import { ProductSku } from "@/types/product";

interface ProductBadgeProps {
    stockStatus?: boolean; // 是否有货
    originalPrice: number;
    currentPrice: number;
    badge?: string; // 数据库里的 'HOT', 'NEW' 等
    className?: string; // 允许微调位置
}

// 统一的徽章配置 (单源真理)
const BADGE_CONFIG: Record<string, { label: string; className: string }> = {
    'NEW': { label: 'New Arrival', className: 'bg-blue-600' },
    // 策略：数据库存 HOT，前端统一显示 Best Seller，显得更稳重
    'HOT': { label: 'Best Seller', className: 'bg-amber-500' },
    'BEST_SELLER': { label: 'Best Seller', className: 'bg-amber-500' },
    'STAFF_PICK': { label: 'Staff Pick', className: 'bg-purple-600' },
    'LIMITED': { label: 'Limited', className: 'bg-gray-900' },
};

export default function ProductBadge({
                                         stockStatus = true,
                                         // originalPrice, // 既然不显示 Sale 标签了，这两个参数其实在这个组件里暂时没用了，但保留接口定义无妨
                                         // currentPrice,
                                         badge,
                                         className = "absolute top-3 left-3 z-10" // 默认定位
                                     }: ProductBadgeProps) {

    // 1. 优先级最高：缺货 (Sold Out) - 黑色半透明背景，最醒目
    if (!stockStatus) {
        return (
            <div className={className}>
                {/* ✅ 修复：添加 whitespace-nowrap 防止换行 */}
                <span className="bg-black/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm whitespace-nowrap">
                    Sold Out
                </span>
            </div>
        );
    }

    // 2. 优先级第二：运营标签 (Badge) - HOT / NEW 等
    // ❌ 已删除 "Sale" 标签逻辑，打折信息只通过价格颜色体现
    if (badge) {
        const config = BADGE_CONFIG[badge.toUpperCase()];
        if (config) {
            return (
                <div className={className}>
                    {/* ✅ 修复：添加 whitespace-nowrap 防止换行 */}
                    <span className={`${config.className} text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm whitespace-nowrap`}>
                        {config.label}
                    </span>
                </div>
            );
        }
    }

    return null;
}