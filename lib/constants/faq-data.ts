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
        title: "Shipping & Delivery",
        items: [
            {
                id: "shipping-time",
                question: "How long will it take to receive my order?",
                answer: "We ship worldwide via dedicated priority lines. \n\n🇺🇸 **USA:** 7-12 Business Days\n🇪🇺 **EU/UK:** 8-14 Business Days\n\n*Processing time: 1-3 days.*",
                tags: ["general", "product", "contact"]
            },
            {
                id: "tracking-stuck",
                question: "Why hasn't my tracking updated in a few days?",
                answer: "Don't panic! It's normal for priority shipping. Status may stay on 'Label Created' for 3-5 days while traveling internationally. It will update rapidly once handed to USPS/Royal Mail.",
                tags: ["general", "contact"]
            }
        ]
    },
    {
        title: "Privacy & Packaging",
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
                answer: "Transactions appear as 'TIANHEQUSIL'. Your privacy is guaranteed.",
                tags: ["general", "product"]
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
                tags: ["general", "contact"]
            },
            {
                id: "warranty",
                question: "Is there a warranty?",
                answer: "Yes! 1-Year Limited Warranty on all electric devices.",
                tags: ["general", "product"]
            }
        ]
    },
    {
        title: "Vibrator Guide",
        items: [
            {
                id: "first-toy-guide",
                question: "How do I choose my first vibrator?",
                answer: "For external play, we recommend a **Mini Wand** over a standard bullet. Mini Wands have a larger head and offer **low-frequency (rumbly)** vibrations, which feel deeper and more satisfying than the high-pitched 'buzz' of tiny bullets.\n\nIf you prefer internal sensation, try a G-Spot toy.",
                tags: ["female-sex-toys", "female-sex-toys/bullet-vibrators", "female-sex-toys/wand-vibrators"]
            },
            {
                id: "g-spot-vs-clit",
                question: "Internal vs External: What's the difference?",
                answer: "**Clitoral toys** focus on the sensitive external nub. **G-Spot toys** target the internal front wall.\n\nWhile many G-spot toys are curved, we also use **Straight Vibrators** for this category. Straight vibes are excellent for applying broad, consistent pressure against the G-spot area without needing a specific angle.",
                tags: ["female-sex-toys", "female-sex-toys/g-spot-vibrators", "female-sex-toys/rabbit-vibrators"]
            },
            {
                id: "air-pulse-tech",
                question: "What is Air-Pulse technology?",
                answer: "Air-Pulse technology (often called 'suction') uses rapid waves of air pressure to stimulate the clitoris without direct contact. It mimics the sensation of oral sex.",
                tags: ["female-sex-toys", "female-sex-toys/clit-vibrators", "female-sex-toys/rabbit-vibrators"]
            }
        ]
    },
    {
        title: "Men's Pleasure Guide",
        items: [
            {
                id: "electric-vs-manual",
                question: "Electric vs Manual Stroker: Which is better?",
                answer: "**Electric:** Best for hands-free convenience, stamina training, and intense consistency. \n\n**Manual:** Best for portability, silence, and total control over pressure.",
                tags: ["male-sex-toys", "male-sex-toys/male-masturbators", "male-sex-toys/manual-strokers"]
            },
            {
                id: "stamina-training-faq",
                question: "How do stamina training toys work?",
                answer: "They use vibration or textured sleeves to help you practice 'edging'—bringing yourself to the brink and stopping. Over time, this builds control and endurance.",
                tags: ["male-sex-toys", "male-sex-toys/stamina-training", "male-sex-toys/cock-rings"]
            },
            {
                id: "prostate-health",
                question: "Is prostate massage healthy?",
                answer: "Yes. Many urologists suggest that regular prostate massage can improve blood flow and potentially reduce symptoms of BPH. It is also intensely pleasurable.",
                tags: ["male-sex-toys", "male-sex-toys/prostate-toys"]
            }
        ]
    },
    {
        title: "Anal Play Essentials",
        items: [
            {
                id: "anal-safety",
                question: "Is it safe? Do I need a flared base?",
                answer: "Safety is #1. **ALWAYS** use a toy with a flared base (a wide bottom) to prevent it from getting lost inside. All MythToy plugs have this safety feature.",
                tags: ["sex-toys", "sex-toys/butt-plugs", "sex-toys/anal-beads"]
            },
            {
                id: "lube-recommendation",
                question: "Do I need lubricant?",
                answer: "Yes! The anus does not self-lubricate. Always use plenty of high-quality lubricant. Water-based is safest for silicone toys.",
                tags: ["sex-toys", "sex-toys/butt-plugs", "sex-toys/anal-beads"]
            }
        ]
    },
    {
        title: "Lingerie Care & Fit",
        items: [
            {
                id: "one-size-fit",
                question: "Will 'One Size' fit me?",
                answer: "Our bodystockings use High-Stretch Nylon Spandex that adapts to your curves. It comfortably fits US sizes 2-14 (XS to XL) and heights up to 5'9\".",
                tags: ["lingerie", "lingerie/bodystockings"]
            },
            {
                id: "fabric-care",
                question: "How to wash delicate mesh?",
                answer: "Hand wash only in cold water. Do not tumble dry. The mesh is durable but hates heat.",
                tags: ["lingerie", "lingerie/bodystockings"]
            }
        ]
    },
    {
        title: "Beginner's Kink",
        items: [
            {
                id: "sensory-play-intro",
                question: "What is Sensory Play?",
                answer: "It involves heightening awareness by removing one sense (like sight with a blindfold) or intensifying touch (using feathers or ice). It builds trust and anticipation.",
                tags: ["bondage-play", "bondage-play/sensory-play"]
            },
            {
                id: "safe-word",
                question: "Are these restraints beginner friendly?",
                answer: "Yes. We focus on 'Soft Bondage' using silicone and fabric. They are comfortable, non-chafing, and easy to escape from if needed.",
                tags: ["bondage-play", "bondage-play/restraints"]
            }
        ]
    }
];