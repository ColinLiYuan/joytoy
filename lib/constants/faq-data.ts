// lib/constants/faq-data.ts

export type FAQItem = {
    id: string;
    question: string;
    answer: string;
    tags: string[];
    images?: {
        url: string;
        alt: string;
    }[];
};

export type FAQCategory = {
    title: string;
    items: FAQItem[];
};

export const FAQ_DATA: FAQCategory[] = [
    {
        title: "The Journey", // 原 Shipping & Delivery
        items: [
            {
                id: "shipping-time",
                question: "How long will it take to receive my order?",
                answer: "We ship worldwide via dedicated priority lines. \n\n🇺🇸 **USA:** 7-12 Business Days\n🇪🇺 **EU/UK:** 8-14 Business Days\n\n*Processing time: 1-3 days.*",
                tags: ["general", "home"] // 首页展示：解决时效焦虑
            },
            {
                id: "tracking-stuck",
                question: "Why hasn't my tracking updated in a few days?",
                answer: "Don't panic! It's normal for priority shipping. Status may stay on 'Label Created' for 3-5 days while traveling internationally. It will update rapidly once handed to local couriers like USPS/Royal Mail.",
                tags: ["general"]
            }
        ]
    },
    {
        title: "Discrete & Confident", // 原 Privacy & Packaging
        items: [
            {
                id: "discreet-packaging",
                question: "Is the packaging discreet?",
                answer: "100% Discreet. We ship in **unmarked reinforced cartons**. \n\nThere are **NO** logos," +
                    " **NO** product images, and **NO** sensitive words on the label. \n\n---\n\n**What your neighbors see:**\nPlain black packaging. No logos, no 'adult' words on the label. 100% Confidential.\n\n[IMAGE:packaging-external]\n\n**What you see:**\nA premium matte black gift box inside. Protected and elegant.\n\n[IMAGE:packaging-internal]",
                tags: ["general", "product"],
                images: [
                    {
                        url: "plain_packing.png",
                        alt: "Discreet plain black external packaging"
                    },
                    {
                        url: "gift_box.png",
                        alt: "Premium matte black gift box inside"
                    }
                ]
            },
            {
                id: "billing-name",
                question: "What appears on my bank statement?",
                answer: "For your privacy, transactions appear as '**MT TECH**'. There is no mention of 'MythToy' or adult products on your statement.",
                tags: ["general", "home"] // 首页展示：账单隐私
            }
        ]
    },
    {
        title: "Material & Integrity", // 原材质标准
        items: [
            {
                id: "material-safety",
                question: "What materials do you use?",
                answer: "We select materials based on the best tactile experience. Our **vibrators and air-pulse tools** are 100% non-porous medical-grade silicone for hygiene. Our **strokers (male masturbators)** use high-grade, skin-like TPE to ensure the softest and most realistic texture possible. All are Phthalate-free.",
                tags: ["product", "home"] // 首页展示：解释硅胶与TPE的专业区分
            }
        ]
    },
    {
        title: "Quality Assurance", // 原 Warranty & Returns
        items: [
            {
                id: "warranty",
                question: "Is there a warranty?",
                answer: "Yes! We stand by our engineering. We offer a **1-Year Limited Warranty** on all electronic devices. If it fails, we replace it.",
                tags: ["general", "home"] // 首页展示：建立品牌信任
            },
            {
                id: "return-policy",
                question: "Do you accept returns?",
                answer: "Due to hygiene reasons, we cannot accept returns on opened items. However, we offer free replacements for any defective units. Please contact support with your order number.",
                tags: ["general"]
            }
        ]
    },
    {
        title: "Tech & Sensations", // 原 Vibrator Guide / Air-Pulse
        items: [
            {
                id: "air-pulse-tech",
                question: "What is Air-Pulse technology?",
                answer: "Air-Pulse technology uses rapid waves of air pressure to stimulate the clitoris without direct contact. It mimics the sensation of oral sex and is the core tech behind our Onyx series.",
                tags: ["product", "home"] // 首页展示：推销旗舰机技术
            },
            {
                id: "waterproof-technology",
                question: "Are your products waterproof? What charging technology do you use?",
                answer: "Yes, all our products are designed to be waterproof, though the technology varies by model:\n\n" +
                    "**Magnetic Charging:** These offer the highest level of waterproof integrity. With no physical openings, they are 100% airtight and the easiest to maintain.\n\n" +
                    "**Pin-port / DC Charging:** These are also waterproof (typically IPX7). These ports are engineered with internal water-sealing technology or tight-fit silicone sleeves. While safe for bath use, they require more care—you must ensure the port is completely free of water and debris before charging to prevent corrosion.\n\n" +
                    "In short: All our devices are shower and bath-friendly, but for the best long-term performance, we recommend patting the charging area dry immediately after use.",
                tags: ["product", "general", "home"]
            }
        ]
    }
];