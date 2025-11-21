// lib/constants/filter-data.ts
export interface FilterOption {
    keyWord: string;
    marketingWords?: string[]; // 只有features有这个字段
}

export interface FilterData {
    colors: string[];
    materials: string[];
    features: FilterOption[];
}

export const filterData: FilterData = {
    colors: [
        "Flesh",
        "Red",
        "Pink",
        "Rose",
        "Blue",
        "Sky Blue",
        "Green",
        "Purple",
        "Brown",
        "Chocolate",
        "Coffee Light",
        "Coffee Dark",
        "Black",
        "White",
        "Grey",
        "Gold",
        "Silver"
    ],

    materials: [
        "Body-Safe Silicone",
        "TPE",
        "ABS Plastic",
        "Stainless Steel",
        "Glass"
    ],

    features: [
        {
            keyWord: "Quiet",
            marketingWords: [
                "Whisper-Quiet Operation",
                "Discreet & Silent Pleasure",
                "Undisturbed Privacy",
                "Library-Quiet Technology"
            ]
        },
        {
            keyWord: "Vibrating",
            marketingWords: [
                "Powerful Rumbling Vibration",
                "Multiple Vibration Modes",
                "Sonic-Pulse Technology",
                "Deep, Rippling Waves"
            ]
        },
        {
            keyWord: "Waterproof",
            marketingWords: [
                "Fully Waterproof Design",
                "Enjoy in the Shower or Bath",
                "Easy-Clean & Waterproof",
                "Unleash Wet & Wild Adventures"
            ]
        },
        {
            keyWord: "Thrusting",
            marketingWords: [
                "Realistic Thrusting Motion",
                "Deep, Penetrating Pulsations",
                "Come-Hither Thrusting",
                "Rhythmic Thrusting Patterns"
            ]
        },
        {
            keyWord: "Suction",
            marketingWords: [
                "Award-Winning Suction Sensation",
                "Pleasure Air Pulse Technology",
                "Gentle yet Intense Suction",
                "Wave-Like Sucking Motions"
            ]
        },
        {
            keyWord: "Licking",
            marketingWords: [
                "Tongue-Like Flickering Licks",
                "Teasing & Tantalizing Flicks",
                "Soothing Licking Sensation",
                "Rapid-Fire Licking Motions"
            ]
        },
        {
            keyWord: "Tapping",
            marketingWords: [
                "Rhythmic Tapping Pleasure",
                "Gentle Pulsating Taps",
                "Targeted Percussion Therapy",
                "Stimulating Patting Motions"
            ]
        },
        {
            keyWord: "Body-Safe",
            marketingWords: [
                "Premium Body-Safe Silicone",
                "Hypoallergenic & Safe",
                "Your Safety, Our Priority",
                "Certified Skin-Safe Material"
            ]
        },
        {
            keyWord: "Hands-Free",
            marketingWords: [
                "Explore Hands-Free Ecstasy",
                "True Hands-Free Freedom",
                "Wearable & Hands-Free Design",
                "Let the Toy Do All the Work"
            ]
        },
        {
            keyWord: "Realistic",
            marketingWords: [
                "Incredibly Realistic Feel",
                "Life-Like Textured Design",
                "Ergonomic & Realistic Shape",
                "Authentic Skin-Like Material"
            ]
        }
    ]
};

// 辅助函数：获取特定类型的过滤器
export function getFiltersByType(type: string): any[] {
    const data = filterData[type as keyof FilterData];
    if (!data) return [];

    if (type === 'features') {
        return data;
    } else {
        // 对于colors和materials，返回字符串数组格式
        return data;
    }
}

// 辅助函数：获取所有过滤器关键词
export function getFilterKeywordsByType(type: string): string[] {
    const data = filterData[type as keyof FilterData];
    if (!data) return [];

    if (type === 'features') {
        return (data as FilterOption[]).map(filter => filter.keyWord);
    } else {
        return data as string[];
    }
}