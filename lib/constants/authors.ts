// lib/constants/site-config.ts (假设文件名)

export interface AuthorProfile {
    name: string;
    role: string;
    avatar: string | null; // 头像图片的路径，没有就填 null
    bio: string;
}

// 这里配置所有的作者信息 (Brand Persona Matrix)
export const AUTHORS_DATA: Record<string, AuthorProfile> = {
    // 1. 核心人物 (Authority / 信任背书)
    "Colin Li": {
        name: "Colin Li",
        role: "Founder & Product Architect",
        avatar: null, // 将来可以放 "/images/authors/colin-bw.jpg"
        bio: "Founder of MythToy. Obsessed with industrial design and material science. Bridging the gap between source factories and your bedroom."
    },

    // 2. 实验室/科普/材质 (Science / 硬核知识)
    "MythToy Lab": {
        name: "Dr. Ari Chen",
        role: "Materials Scientist & Research Lead",
        avatar: null,
        bio: "Deep diving into the chemistry of silicone, the physics of vibration, and the biology of pleasure. Where safety meets science."
    },

    // 3. 生活方式/女性视角 (Lifestyle / 柔性内容)
    "MythToy Lifestyle": {
        name: "Elena R.",
        role: "Wellness Curator",
        avatar: null,
        bio: "Exploring the intersection of self-care, interior design, and intimacy. Helping you curate a bedroom sanctuary that sparks joy."
    },

    // 4. 男性健康/前列腺 (Men's Health / 阳刚内容)
    "MythToy Men": {
        name: "James K.",
        role: "Men's Wellness Consultant",
        avatar: null,
        bio: "Breaking stigmas around male pleasure. Expert advice on stamina training, prostate health, and ergonomic design."
    },

    // 5. 科技/极客 (Tech / 极客内容)
    "MythToy Tech": {
        name: "Sam Rivera",
        role: "Hardware Engineer",
        avatar: null,
        bio: "From Bluetooth protocols to whisper-quiet motors. Engineering the hardware that powers your connection."
    },

    // 6. 官方/新闻 (Editorial / 通用)
    "MythToy Editorial": {
        name: "MythToy Editorial",
        role: "Staff Writers",
        avatar: null,
        bio: "News, updates, and curated collections from the MythToy HQ."
    },

    // 7. 旧数据兼容 (Mark Li)
    "Mark Li": {
        name: "Mark Li",
        role: "Senior Product Manager",
        avatar: null,
        bio: "Veteran in supply chain management, ensuring every MythToy product meets global safety standards."
    }
};

// 营销配置
export const MARKETING_CONFIG = {
    defaultDiscountCode: 'MYTH15',
    newsletterTitle: 'Unlock 15% Off',
    newsletterSubtitle: 'Join our discreet community for exclusive offers and wellness tips.',
};

// 获取作者的工具函数
export function getAuthor(name: string | null | undefined): AuthorProfile {
    // 1. 尝试精确匹配
    if (name && AUTHORS_DATA[name]) {
        return AUTHORS_DATA[name];
    }

    // 2. 尝试模糊匹配 (比如数据库存的是 "MythToy Wellness" 但配置的是 "MythToy Lifestyle")
    if (name && (name.includes("Wellness") || name.includes("Lifestyle"))) {
        return AUTHORS_DATA["MythToy Lifestyle"];
    }

    // 3. 如果数据库有名字但没配置，返回通用信息
    if (name) {
        return {
            name: name,
            role: "Guest Contributor",
            avatar: null,
            bio: "Sharing insights on modern intimacy and wellness."
        };
    }

    // 4. 兜底返回 Founder
    return AUTHORS_DATA["Colin Li"];
}