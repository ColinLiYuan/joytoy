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
                answer: "100% Discreet. We ship in **unmarked reinforced cartons**. There are **NO** logos, **NO** product images, and **NO** sensitive words on the label. Your secret is safe with us.",
                tags: ["general", "home"] // 首页展示：核心隐私痛点
            },
            {
                id: "billing-name",
                question: "What appears on my bank statement?",
                answer: "For your privacy, transactions appear as '**TIANHEQUSIL**'. There is no mention of 'MythToy' or adult products on your statement.",
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
                id: "waterproof-check",
                question: "Are the products waterproof?",
                answer: "Ratings vary. **The Onyx** is **IPX7 Submersible** (bath-safe). Models like **The Eclipse** are **IPX6 Splash-proof**—perfect for cleaning under a tap but not for soaking.",
                tags: ["product"]
            }
        ]
    }
];