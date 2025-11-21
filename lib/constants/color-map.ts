// /lib/constants/color-map.ts
export const colorMap: { [key: string]: string } = {
    // 肤色系列
    'flesh': '#FFE9D1',
    'skin': '#FFE9D1',
    'nude': '#F3E5AB',
    'beige': '#F5F5DC',
    'tan': '#D2B48C',
    'ivory': '#FFFFF0',
    'cream': '#FFFDD0',

    // 红色系列
    'red': '#FF0000',
    'crimson': '#DC143C',
    'scarlet': '#FF2400',
    'burgundy': '#800020',
    'maroon': '#800000',
    'pink': '#FFC0CB',
    'rose': '#FF007F',
    'coral': '#FF7F50',

    // 蓝色系列
    'blue': '#0000FF',
    'navy': '#000080',
    'skyblue': '#87CEEB',
    'royalblue': '#4169E1',
    'teal': '#008080',
    'turquoise': '#40E0D0',
    'aqua': '#00FFFF',
    'cyan': '#00FFFF',

    // 绿色系列
    'green': '#008000',
    'lime': '#00FF00',
    'forest': '#228B22',
    'olive': '#808000',
    'emerald': '#50C878',
    'mint': '#98FB98',
    'seagreen': '#2E8B57',

    // 黄色/橙色系列
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'amber': '#FFBF00',
    'mustard': '#FFDB58',

    // 紫色系列
    'purple': '#800080',
    'violet': '#EE82EE',
    'lavender': '#E6E6FA',
    'lilac': '#C8A2C8',
    'plum': '#DDA0DD',

    // 棕色系列
    'brown': '#A52A2A',
    'chocolate': '#D2691E',
    'coffee': '#6F4E37',
    'caramel': '#AF6E4D',
    'coffee light': '#6F4E37',
    'coffee dark': '#3B2A1A',
    'espresso': '#3B2A1A',
    'mocha': '#8B7355',
    'latte': '#C4A484',
    'cappuccino': '#A68B6F',

    // 灰色/黑色系列
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'charcoal': '#36454F',

    // 金属色
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'bronze': '#CD7F32',
    'copper': '#B87333'
};

// 获取映射后的颜色值
export function getMappedColor(color: string): string {
    const normalizedColor = color.toLowerCase().trim();
    return colorMap[normalizedColor] || color;
}

// 检查是否为有效的十六进制颜色
export function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// 检查是否为有效的颜色名称（在映射表中）
export function isValidColorName(color: string): boolean {
    const normalizedColor = color.toLowerCase().trim();
    return normalizedColor in colorMap;
}

// 获取颜色显示文本
export function getColorDisplayText(color: string): string {
    const normalizedColor = color.toLowerCase().trim();
    if (isValidHexColor(color)) {
        return color.toUpperCase();
    }
    return color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
}