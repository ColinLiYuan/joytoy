// lib/constants/color-config.ts

// 1. 定义颜色组和变体 (这是核心数据源)
export const COLOR_SYSTEM = {
    "Red": {
        display: "Red",
        hex: "#FF0000",
        variants: {
            "Red": "#FF0000",
            "Crimson": "#DC143C",
            "Crimson Red": "#DC143C", // ✅ 新增
            "Scarlet": "#FF2400",
            "Scarlet Red": "#FF2400", // ✅ 新增
            "Burgundy": "#800020",
            "Maroon": "#800000",
            "Coral": "#FF7F50",
            "Rose": "#FF007F",
            "Rose Red": "#FF007F"
        }
    },
    "Pink": {
        display: "Pink",
        hex: "#FFC0CB",
        variants: {
            "Pink": "#FFC0CB",
            "Soft Pink": "#FFB6C1",
            "Hot Pink": "#FF69B4",
            "Fuchsia": "#FF00FF"
        }
    },
    "Blue": {
        display: "Blue",
        hex: "#0000FF",
        variants: {
            "Blue": "#0000FF",
            "Electric Blue": "#7DF9FF", // ✅ 新增
            "Navy": "#000080",
            "Sky Blue": "#87CEEB",
            "Royal Blue": "#4169E1",
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
            "Lime": "#00FF00",
            "Forest": "#228B22",
            "Olive": "#808000",
            "Emerald": "#50C878",
            "Mint": "#98FB98"
        }
    },
    "Purple": {
        display: "Purple",
        hex: "#800080",
        variants: {
            "Purple": "#800080",
            "Violet": "#EE82EE",
            "Lavender": "#E6E6FA",
            "Lilac": "#C8A2C8",
            "Soft Lilac": "#D8B2D1", // ✅ 新增
            "Royal Purple": "#7851A9"
        }
    },
    "Black": {
        display: "Black",
        hex: "#000000",
        variants: {
            "Black": "#000000",
            "Midnight Black": "#191970",
            "Obsidian Black": "#1C1C1C", // ✅ 新增 (黑曜石色)
            "Charcoal": "#36454F"
        }
    },
    "White": {
        display: "White",
        hex: "#FFFFFF",
        variants: {
            "White": "#FFFFFF",
            "Arctic White": "#F0FFFF", // ✅ 新增 (极地白)
            "Ivory": "#FFFFF0",
            "Cream": "#FFFDD0"
        }
    },
    "Skin": {
        display: "Skin Tone",
        hex: "#FFE9D1",
        variants: {
            "Flesh": "#FFE9D1",
            "Skin": "#FFE9D1",
            "Nude": "#F3E5AB",
            "Beige": "#F5F5DC",
            "Tan": "#D2B48C"
        }
    },
    "Brown": {
        display: "Brown",
        hex: "#A52A2A",
        variants: {
            "Brown": "#A52A2A",
            "Chocolate": "#D2691E",
            "Coffee": "#6F4E37",
            "Coffee Light": "#6F4E37",
            "Coffee Dark": "#3B2A1A"
        }
    },
    "Yellow": {
        display: "Yellow",
        hex: "#FFFF00",
        variants: {
            "Yellow": "#FFFF00",
            "Orange": "#FFA500",
            "Gold": "#FFD700",
            "Amber": "#FFBF00"
        }
    },
    "Metal": {
        display: "Metallic",
        hex: "#C0C0C0",
        variants: {
            "Silver": "#C0C0C0",
            "Sterling Silver": "#C0C0C0", // ✅ 新增 (925银色)
            "Bronze": "#CD7F32",
            "Copper": "#B87333"
        }
    }
};

// 2. 辅助函数：根据具体颜色名获取 HEX 值 (用于前端展示圆点)
// 输入 "Crimson" -> 输出 "#DC143C"
export function getHexColor(colorName: string): string {
    if (!colorName) return '#CCCCCC';
    const normalized = colorName.trim(); // 保持原始大小写查找，或者统一转小写

    // 遍历所有组查找
    for (const group of Object.values(COLOR_SYSTEM)) {
        // 不区分大小写查找
        const variantKey = Object.keys(group.variants).find(k => k.toLowerCase() === normalized.toLowerCase());
        if (variantKey) {
            return group.variants[variantKey as keyof typeof group.variants];
        }
    }
    return '#CCCCCC'; // 默认灰
}

// 3. 辅助函数：获取所有大类名称 (用于 Admin 下拉和 Filter 列表)
// 输出 ["Red", "Blue", "Green", ...]
export function getColorGroups(): string[] {
    return Object.keys(COLOR_SYSTEM);
}

// 4. 辅助函数：获取某大类下的所有变体 (用于 Admin 二级选择)
// 输入 "Red" -> 输出 ["Red", "Crimson", "Scarlet"...]
export function getColorVariants(groupName: string): string[] {
    const group = COLOR_SYSTEM[groupName as keyof typeof COLOR_SYSTEM];
    return group ? Object.keys(group.variants) : [];
}

// 5. 辅助函数：获取所有变体的大平铺列表 (用于旧代码兼容)
export function getAllColorVariants(): string[] {
    let all: string[] = [];
    Object.values(COLOR_SYSTEM).forEach(group => {
        all = [...all, ...Object.keys(group.variants)];
    });
    return all.sort();
}