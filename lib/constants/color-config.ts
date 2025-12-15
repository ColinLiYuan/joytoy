// lib/constants/color-config.ts

/**
 * 全局颜色配置系统
 * 用于前端 SKU 选择器显示颜色圆点 (Hex)，以及后台分类筛选。
 */

export const COLOR_SYSTEM = {
    // --- 基础色系 ---
    "Black": {
        display: "Black",
        hex: "#000000",
        variants: {
            "Black": "#000000",
            "Midnight Black": "#121212", // 深邃午夜黑
            "Obsidian Black": "#1C1C1C", // 黑曜石
            "Matte Black": "#28282B",    // 哑光黑 (稍微灰一点，显质感)
            "Jet Black": "#0A0A0A",
            "Charcoal": "#36454F",
            "Carbon": "#1A1A1A",
            "Cyber Black": "#0F0F0F"     // 科技黑
        }
    },
    "White": {
        display: "White",
        hex: "#FFFFFF",
        variants: {
            "White": "#FFFFFF",
            "Pearl White": "#F3F4F6",    // 珍珠白 (带一点灰，防白底看不见)
            "Cloud White": "#F8F9FA",    // 云朵白
            "Arctic White": "#F0FFFF",   // 极地白 (冷色调)
            "Ivory": "#FFFFF0",
            "Cream": "#FFFDD0",
            "Off White": "#F5F5F5",
            "Frost White": "#F8F8FF"     // 霜白
        }
    },
    "Gray": {
        display: "Gray",
        hex: "#808080",
        variants: {
            "Gray": "#808080",
            "Grey": "#808080",
            "Silver": "#C0C0C0",
            "Satin Silver": "#D3D3D3",   // 缎面银
            "Matte Grey": "#A9A9A9",     // 哑光灰
            "Concrete Grey": "#808080",  // 水泥灰
            "Slate": "#708090",          // 板岩灰
            "Gunmetal": "#2A3439"        // 枪灰色
        }
    },

    // --- 彩色系 ---
    "Red": {
        display: "Red",
        hex: "#FF0000",
        variants: {
            "Red": "#FF0000",
            "Crimson": "#DC143C",        // 猩红
            "Crimson Red": "#DC143C",
            "Scarlet": "#FF2400",        // 绯红
            "Scarlet Red": "#FF2400",
            "Burgundy": "#800020",       // 酒红
            "Wine": "#722F37",
            "Ruby": "#E0115F",
            "Rose Red": "#C21E56"        // 玫瑰红
        }
    },
    "Pink": {
        display: "Pink",
        hex: "#FFC0CB",
        variants: {
            "Pink": "#FFC0CB",
            "Soft Pink": "#FFB6C1",      // 柔粉
            "Baby Pink": "#F4C2C2",
            "Hot Pink": "#FF69B4",       // 亮粉
            "Fuchsia": "#FF00FF",        // 紫红
            "Magenta": "#FF00FF",
            "Blush": "#DE5D83",
            "Coral": "#FF7F50",
            "Matte Pink": "#Eeb7b4"      // 哑光粉
        }
    },
    "Purple": {
        display: "Purple",
        hex: "#800080",
        variants: {
            "Purple": "#800080",
            "Violet": "#EE82EE",
            "Lavender": "#E6E6FA",       // 薰衣草
            "Lilac": "#C8A2C8",          // 丁香紫
            "Soft Lilac": "#D8B2D1",
            "Royal Purple": "#7851A9",   // 皇室紫
            "Amethyst": "#9966CC",       // 紫水晶
            "Amethyst Purple": "#9966CC",
            "Deep Purple": "#36013F",
            "Plum": "#DDA0DD"
        }
    },
    "Blue": {
        display: "Blue",
        hex: "#0000FF",
        variants: {
            "Blue": "#0000FF",
            "Navy": "#000080",
            "Royal Blue": "#4169E1",
            "Sky Blue": "#87CEEB",
            "Baby Blue": "#89CFF0",
            "Electric Blue": "#7DF9FF",  // 闪电蓝 (科技感)
            "Midnight Blue": "#191970",
            "Teal": "#008080",
            "Turquoise": "#40E0D0",
            "Cyan": "#00FFFF"
        }
    },
    "Green": {
        display: "Green",
        hex: "#008000",
        variants: {
            "Green": "#008000",
            "Emerald": "#50C878",        // 祖母绿 (我们的品牌色)
            "Emerald Green": "#50C878",
            "Sage": "#9DC183",           // 鼠尾草绿
            "Sage Green": "#9DC183",
            "Mint": "#98FB98",           // 薄荷绿
            "Mint Green": "#98FB98",
            "Olive": "#808000",
            "Forest Green": "#228B22",
            "Lime": "#00FF00"
        }
    },
    "Yellow": {
        display: "Yellow/Orange",
        hex: "#FFD700",
        variants: {
            "Yellow": "#FFFF00",
            "Orange": "#FFA500",
            "Amber": "#FFBF00",
            "Lemon": "#FFF700"
        }
    },

    // --- 特殊材质系 ---
    "Metallic": {
        display: "Metallic",
        hex: "#D4AF37", // 默认显示金色
        variants: {
            "Gold": "#FFD700",
            "Rose Gold": "#B76E79",      // 玫瑰金 (非常常用)
            "Champagne Gold": "#F7E7CE", // 香槟金
            "Silver": "#C0C0C0",
            "Sterling Silver": "#C0C0C0",
            "Chrome": "#D3D3D3",         // 镀铬银
            "Copper": "#B87333",
            "Bronze": "#CD7F32",
            "Gold Accent": "#FFD700"     // 金色点缀
        }
    },
    "Skin": {
        display: "Skin Tone",
        hex: "#FFE9D1",
        variants: {
            "Skin": "#FFE9D1",
            "Flesh": "#FFE9D1",
            "Nude": "#F3E5AB",
            "Beige": "#F5F5DC",
            "Tan": "#D2B48C",
            "Honey": "#A98307",
            "Mocha": "#967969",
            "Chocolate": "#D2691E",
            "Dark Skin": "#5C4033",
            "Light Skin": "#FFE0BD"
        }
    },
    "Transparent": {
        display: "Clear",
        hex: "transparent",
        variants: {
            "Clear": "transparent",
            "Transparent": "transparent",
            "Crystal": "#E0FFFF",        // 水晶 (稍微带点淡蓝以便显示)
            "Crystal Clear": "#F0F8FF",
            "Frosted": "#F5F5F5",        // 磨砂
            "Smoke": "#708090",          // 烟熏透
            "Glass": "#E0FFFF"
        }
    }
};

/**
 * 辅助函数：根据颜色名获取 HEX 值
 * @param colorName 后端数据库里的颜色名称
 * @returns 对应的 HEX 码，如果找不到则返回灰色
 */
export function getHexColor(colorName: string): string {
    if (!colorName) return '#CCCCCC';
    const normalized = colorName.trim().toLowerCase();

    // 1. 特殊处理透明色
    if (normalized.includes('clear') || normalized.includes('transparent')) {
        return 'transparent';
    }

    // 2. 遍历查找
    for (const group of Object.values(COLOR_SYSTEM)) {
        // 先精确查找 variants Key
        for (const [variantKey, hexValue] of Object.entries(group.variants)) {
            if (variantKey.toLowerCase() === normalized) {
                return hexValue;
            }
        }
    }

    // 3. 模糊查找 (如果数据库写了 "Dark Blue" 但配置里没有，尝试找 "Blue")
    // 简单的回退机制
    if (normalized.includes('blue')) return COLOR_SYSTEM.Blue.hex;
    if (normalized.includes('red')) return COLOR_SYSTEM.Red.hex;
    if (normalized.includes('green')) return COLOR_SYSTEM.Green.hex;
    if (normalized.includes('pink')) return COLOR_SYSTEM.Pink.hex;
    if (normalized.includes('purple')) return COLOR_SYSTEM.Purple.hex;
    if (normalized.includes('black')) return COLOR_SYSTEM.Black.hex;
    if (normalized.includes('white')) return COLOR_SYSTEM.White.hex;
    if (normalized.includes('gray') || normalized.includes('grey')) return COLOR_SYSTEM.Gray.hex;
    if (normalized.includes('gold')) return COLOR_SYSTEM.Metallic.variants['Gold'];

    return '#CCCCCC'; // 实在找不到，返回灰色
}

/**
 * 获取所有颜色大类 (用于 Filter)
 */
export function getColorGroups(): string[] {
    return Object.keys(COLOR_SYSTEM);
}

/**
 * 获取某个大类下的所有变体 (用于 Admin)
 */
export function getColorVariants(groupName: string): string[] {
    const group = COLOR_SYSTEM[groupName as keyof typeof COLOR_SYSTEM];
    return group ? Object.keys(group.variants) : [];
}

/**
 * 获取系统支持的所有颜色名称列表 (用于自动补全或验证)
 */
export function getAllColorVariants(): string[] {
    let all: string[] = [];
    Object.values(COLOR_SYSTEM).forEach(group => {
        all = [...all, ...Object.keys(group.variants)];
    });
    // 去重并按字母排序
    return [...new Set(all)].sort();
}