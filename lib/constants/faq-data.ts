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
                answer: "We ship worldwide via dedicated priority lines. \n\n🇺🇸 **USA:** 5-12 Business Days\n🇪🇺" +
                    " **EU/UK:** 5-14 Business Days\n\n*Processing time: 1-3 days.*",
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
                tags: ["product", "home"]
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
                tags: ["product", "home"]
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
    },
    {
        title: "Sensory Play Guide", // 针对当前前台 Sensory Play页面的专属FAQ
        items: [
            {
                id: "what-are-adult-sensory-toys",
                question: "What exactly are sensory toys for adults in intimacy?",
                answer: "In adult wellness, **sensory toys for adults** are items designed to stimulate your five senses—touch, sight, and sound—to enhance pleasure and reduce stress. Unlike traditional devices, tools in our *[Sensory Play](/collections/female-sex-toys/nipple-toys)* collection (like *[The Brush](/toys/female-sex-toys/bullet-vibrators/the-brush)*) focus on unique textures, whisper-quiet motors, and variable frequencies to create a more mindful, immersive intimate experience.",
                tags: ["sensory-play", "female-sex-toys/nipple-toys"]
            },
            {
                id: "clit-vibrator-during-sex-guide",
                question: "How do I choose a clit vibrator during sex for solo or couple play?",
                answer: "When selecting a **clit vibrator during sex**, look for ergonomics and versatility. For solo exploration, wand stimulators provide targeted fulfillment. For couples, lightweight or wearable designs are perfect as they easily fit between partners during intercourse without getting in the way. Always start on the lowest setting to explore your sensitivity baseline.",
                tags: ["sensory-play", "female-sex-toys/nipple-toys"]
            }
        ]
    },
    {
        title: "Stamina Training Guide", // 针对 stamina-training 页面的专属FAQ
        items: [
            {
                id: "what-is-stamina-training",
                question: "What is stamina training for men and how does it work?",
                answer: "**Stamina training** is a specialized practice designed to help men improve their sexual endurance and control. Through gradual exercises using dedicated **sensation control tools** and **training devices**, you can learn to better manage arousal levels. Our **male stamina training** collection focuses on safe, body-safe materials and scientifically-backed methods to enhance your intimate experiences.\n\nThe key principle is **progressive training** - starting with basic sensation awareness and gradually building control over time, much like any other physical training program.",
                tags: ["male-sex-toys/stamina-training", "stamina-training", "premature-ejaculation"]
            },
            {
                id: "premature-ejaculation-devices",
                question: "What devices help with premature ejaculation control?",
                answer: "Several **premature ejaculation devices** can help with control:\n\n**Sensation Training Tools**: Specialized devices that help you practice the **stop-start method** and **squeeze technique** in a controlled environment, building arousal awareness over time.\n\n**Desensitizing Products**: Specialized lubricants and creams designed to slightly reduce sensation without numbing completely, allowing you to extend intimacy duration.\n\n**Control Enhancement Devices**: Tools designed to help you identify and manage your arousal levels, enabling gradual improvement in ejaculatory control.\n\nAll our **stamina training** products are made from body-safe materials and designed for gradual, safe training.",
                tags: ["male-sex-toys/stamina-training", "stamina-training", "premature-ejaculation"]
            },
            {
                id: "stop-start-method-training",
                question: "How do I practice the stop-start method for better control?",
                answer: "The **stop-start method** (also known as the **semans technique**) is one of the most effective **premature ejaculation** training techniques:\n\n1. **Begin stimulation** - Use your **stamina training device** or manual stimulation\n2. **Monitor arousal** - Pay attention to your arousal level on a scale of 1-10\n3. **Stop at 7-8** - When you reach high arousal (7-8 out of 10), pause all stimulation\n4. **Wait for recovery** - Let arousal decrease to 4-5 level\n5. **Resume training** - Start again, repeating the cycle 3-4 times\n\nRegular practice with our **stamina training** tools helps you develop better **arousal awareness** and **ejaculatory control** over time. Many men see improvement within 4-6 weeks of consistent practice.",
                tags: ["male-sex-toys/stamina-training", "stamina-training", "premature-ejaculation"]
            },
            {
                id: "safety-stamina-training",
                question: "Is stamina training safe? What should I know?",
                answer: "Yes, **stamina training** is completely safe when done correctly. Here are key safety guidelines:\n\n**Session Duration**: Start with short sessions (10-15 minutes) and gradually increase as you build control and comfort. Never push beyond your comfort zone.\n\n**Gradual Progression**: Begin with basic exercises and advance slowly. Consistent, moderate practice is more effective than intense, irregular sessions.\n\n**Body-Safe Materials**: All our **stamina training products** use medical-grade silicone, body-safe TPE, and phthalate-free materials.\n\n**Listen to Your Body**: If you feel pain or discomfort, stop immediately. Training should never be painful.\n\n**Consult Professionals**: If you have underlying health conditions, consult a healthcare provider before starting any training program.",
                tags: ["male-sex-toys/stamina-training", "stamina-training"]
            }
        ]
    }
];