// lib/constants/color-map.ts
import { COLOR_SYSTEM } from './color-config';

// ✅ 1. 动态生成扁平化的 colorMap 对象，以兼容旧代码
// 结构: { 'red': '#FF0000', 'crimson': '#DC143C', ... }
export const colorMap: { [key: string]: string } = {};

// 遍历新的配置系统，填充 map
Object.values(COLOR_SYSTEM).forEach(group => {
    // 1. 添加具体变体 (Variant)
    Object.entries(group.variants).forEach(([name, hex]) => {
        colorMap[name.toLowerCase()] = hex;
    });

    // 2. 添加组名本身 (Group Name) 作为兜底，例如 "Blue"
    // 注意：有些 group.display 是 "Skin Tone"，处理一下 key
    const groupKey = group.display.toLowerCase();
    if (!colorMap[groupKey]) {
        colorMap[groupKey] = group.hex;
    }
});

// ✅ 2. 辅助函数：获取映射后的颜色值 (推荐使用这个，而不是直接查对象)
export function getMappedColor(color: string): string {
    if (!color) return '#CCCCCC';
    const normalizedColor = color.toLowerCase().trim();

    // 如果已经在 map 里，直接返回 HEX
    if (colorMap[normalizedColor]) {
        return colorMap[normalizedColor];
    }

    // 如果本身就是 HEX 格式，直接返回
    if (isValidHexColor(color)) {
        return color;
    }

    return '#CCCCCC'; // 默认灰
}

// 检查是否为有效的十六进制颜色
export function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// 获取颜色显示文本 (首字母大写)
export function getColorDisplayText(color: string): string {
    if (!color) return '';
    // 如果是 hex，直接大写
    if (isValidHexColor(color)) return color.toUpperCase();

    return color.charAt(0).toUpperCase() + color.slice(1);
}