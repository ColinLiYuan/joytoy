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
    },
    {
        title: "G-Spot Vibrator Guide", // 针对 g-spot-vibrators 页面的专属FAQ
        items: [
            {
                id: "what-is-g-spot-toy",
                question: "What is a G-spot toy and how does it work?",
                answer: "A **G-spot toy** is specifically designed to stimulate the Grafenberg spot (G-spot), an erogenous zone located on the anterior wall of the vagina. Our **g spot vibrators** feature curved or angled designs that target this sensitive area precisely.\n\nUnlike straight vibrators, **g spot toys** have ergonomic curves that naturally align with your body's anatomy, making it easier to find and stimulate the G-spot effectively. The best **g spot vibrators** combine targeted pressure with powerful vibrations for intense, deep orgasms.",
                tags: ["female-sex-toys/g-spot-vibrators", "g-spot-vibrators"]
            },
            {
                id: "how-to-use-g-spot-vibrator",
                question: "How do I use a G-spot vibrator for best results?",
                answer: "Using a **g spot vibrator** effectively requires proper technique:\n\n**Preparation**: Apply water-based lubricant generously to both the toy and yourself for comfortable insertion.\n\n**Positioning**: Insert the curved end facing upward toward your belly button. The curve should press against the front vaginal wall where the G-spot is located (about 2-3 inches inside).\n\n**Finding Your Spot**: Move the toy in a 'come hither' motion or apply gentle pressure against the front wall. You'll know you've found it when you feel increased sensitivity or fullness.\n\n**Start Slow**: Begin with lower vibration settings and gradually increase intensity. Many women find that combining internal G-spot stimulation with external clitoral play creates the most powerful orgasms.\n\n**Experiment**: Try different angles, pressures, and vibration patterns to discover what works best for your body.",
                tags: ["female-sex-toys/g-spot-vibrators", "g-spot-vibrators"]
            },
            {
                id: "best-g-spot-vibrators-features",
                question: "What makes the best G-spot vibrators stand out?",
                answer: "The **best g spot vibrators** share several key features:\n\n**Ergonomic Curve**: A pronounced curve or angle (typically 30-45 degrees) that naturally targets the G-spot without awkward positioning.\n\n**Firm Yet Flexible**: Medical-grade silicone that's firm enough to provide targeted pressure but flexible enough for comfortable insertion.\n\n**Powerful Motor**: Strong, rumbly vibrations rather than buzzy ones. Look for multiple speed settings and pattern options.\n\n**Size Matters**: Medium-sized toys (6-8 inches total length, 1-1.5 inches diameter) work well for most users. Beginners may prefer slimmer profiles.\n\n**Waterproof Design**: IPX7 waterproof rating allows for bath or shower use and easy cleaning.\n\n**Quiet Operation**: Whisper-quiet motors ensure discretion during use.\n\nOur collection features only premium **g spot toys** that meet these criteria, ensuring you get the best possible experience.",
                tags: ["female-sex-toys/g-spot-vibrators", "g-spot-vibrators"]
            },
            {
                id: "g-spot-toy-vs-regular-vibrator",
                question: "What's the difference between a G-spot toy and a regular vibrator?",
                answer: "The main differences between **g spot toys** and regular vibrators:\n\n**Shape & Design**: **G spot vibrators** have distinctive curved or angled tips specifically designed to reach the anterior vaginal wall. Regular vibrators are typically straight.\n\n**Targeted Stimulation**: **G spot toys** focus on internal G-spot stimulation, while standard vibrators often target external areas like the clitoris.\n\n**Firmness**: **G spot vibrators** tend to be firmer to provide the pressure needed for G-spot activation. Regular vibrators may be softer and more flexible.\n\n**Purpose-Built**: Every aspect of a **g spot toy** — from the curve angle to the motor placement — is optimized for G-spot pleasure. Regular vibrators are more general-purpose.\n\nFor many women, having both types creates the most versatile pleasure toolkit. Consider pairing a **g spot vibrator** with one of our clitoral stimulators for blended orgasms.",
                tags: ["female-sex-toys/g-spot-vibrators", "g-spot-vibrators"]
            },
            {
                id: "g-spot-vibrator-beginner-tips",
                question: "I'm new to G-spot toys. Any beginner tips?",
                answer: "Starting with **g spot vibrators** is exciting! Here are essential beginner tips:\n\n**Choose Beginner-Friendly**: Start with a slim, moderately curved **g spot toy** rather than an advanced model. Our smaller diameter options are perfect for first-timers.\n\n**Use Plenty of Lube**: Water-based lubricant is essential for comfortable insertion and enhanced sensation.\n\n**Relax First**: Take time to relax and become aroused before insertion. This makes finding the G-spot much easier.\n\n**Don't Rush**: Spend time exploring different angles and pressures. The G-spot isn't always immediately obvious — it may take a few sessions to locate.\n\n**Combine with Clitoral Play**: Many beginners find that simultaneous clitoral stimulation helps them identify G-spot sensations more easily.\n\n**Be Patient**: It's normal if you don't experience intense G-spot orgasms right away. With practice and exploration, most women discover powerful G-spot pleasure.\n\n**Clean Properly**: Always clean your **g spot vibrator** before and after use with warm water and mild soap or toy cleaner.",
                tags: ["female-sex-toys/g-spot-vibrators", "g-spot-vibrators"]
            }
        ]
    }
];