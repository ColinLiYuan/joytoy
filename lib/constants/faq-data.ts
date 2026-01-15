// lib/constants/faq-data.ts

export type FAQItem = {
    id: string;
    question: string;
    answer: string;
    tags: string[]; // 👈 核心修改：加上这个标签系统
};

export type FAQCategory = {
    title: string;
    items: FAQItem[];
};

export const FAQ_DATA: FAQCategory[] = [
    {
        title: "Shipping & Delivery",
        items: [
            {
                id: "shipping-time",
                question: "How long will it take to receive my order?",
                answer: "We ship worldwide via dedicated priority lines. \n\n🇺🇸 **USA:** 7-12 Business Days\n🇪🇺 **EU/UK:** 8-14 Business Days\n\n*Processing time: 1-3 days.*",
                tags: ["general", "product", "contact"] // 产品页要看时效，客服页要挡催单
            },
            {
                id: "tracking-stuck",
                question: "Why hasn't my tracking updated in a few days?",
                answer: "Don't panic! It's normal for priority shipping. Status may stay on 'Label Created' for 3-5 days while traveling internationally. It will update rapidly once handed to USPS/Royal Mail.",
                tags: ["general", "contact"] // 只有客服页和FAQ页需要，产品页别放这个负面信息
            }
        ]
    },
    {
        title: "Privacy & Packaging",
        items: [
            {
                id: "discreet-packaging",
                question: "Is the packaging discreet?",
                answer: "100% Discreet. Depending on the order size, we ship in either **plain matte black mailers**" +
                    " or **unmarked reinforced cartons**. \n\nThere are **NO** logos, **NO** product images, and" +
                    " **NO** sensitive words on the label. The sender name appears as 'MYTH-TECH'. It looks exactly like a generic tech shipment.",
                tags: ["general", "product"] // 产品页核心痛点
            },
            {
                id: "billing-name",
                question: "What appears on my bank statement?",
                answer: "Transactions appear as 'MYTH-TECH'. Your privacy is guaranteed.",
                tags: ["general", "product"] // 产品页核心痛点
            }
        ]
    },
    {
        title: "Warranty & Returns",
        items: [
            {
                id: "return-policy",
                question: "Do you accept returns?",
                answer: "Due to hygiene reasons, we cannot accept returns on opened items. However, we offer free replacements for defective units.",
                tags: ["general", "contact"] // 客服页挡退货
            },
            {
                id: "warranty",
                question: "Is there a warranty?",
                answer: "Yes! 1-Year Limited Warranty on all electric devices.",
                tags: ["general", "product"] // 产品页增加信心
            }
        ]
    }
];