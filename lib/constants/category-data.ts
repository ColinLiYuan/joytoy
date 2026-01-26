// lib/constants/category-data.ts
import { CategoriesData } from '@/types/category';

export const CATEGORIES_DATA: CategoriesData = {
    category: {
        roots: [
            {
                slug: "all",
                name: "Shop",
                title: "Shop All | Curated Intimacy Collection",
                description: "Explore our complete range of premium pleasure objects. From air-pulse technology to designer aesthetic toys.",
                image: "cat-banner-for-all.png",
                priority: 0.8,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "new-arrivals",
                        name: "New In",
                        title: "New Arrivals | Latest Innovations",
                        description: "Discover the latest in pleasure technology. New designs, quieter motors, and premium materials.",
                        image: "cat-banner-new-in.png",
                        root: "shop",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "best-sellers",
                        name: "Best Sellers",
                        title: "Best Sellers | Most Loved by Our Community",
                        description: "Shop our most popular items. Verified reviews and proven satisfaction.",
                        image: "cat-banner-best-seller.png",
                        root: "shop",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "female-sex-toys",
                name: "For Her",
                title: "For Her | Premium Vibrators & Massagers",
                description: "Elegant pleasure products designed for her. Featuring liquid silicone and whisper-quiet technology.",
                image: "cat-banner-for-her.png",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "female-sex-toys/clit-vibrators",
                        name: "Air-Pulse & Clit",
                        title: "Clit Vibrators | Air-Pulse Technology",
                        description: "Experience contactless suction and focused vibration. Our most popular category.",
                        image: "cat-banner-clit-vibrator.png",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/g-spot-vibrators",
                        name: "G-Spot Vibrators",
                        title: "G-Spot Vibrators | Internal Massage",
                        description: "Ergonomically designed for precise internal stimulation. From flexible curves to targeted power, find your perfect angle.",
                        image: "cat-banner-g-spot.png?v=1",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/bullet-vibrators",
                        name: "Bullets & Lipsticks",
                        title: "Bullet Vibrators | Discreet & Travel Friendly",
                        description: "Pocket-sized power. Perfect for travel or discreet play.",
                        image: "cat-banner-bullet-vibe.png?v=1",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/rabbit-vibrators",
                        name: "Dual Action",
                        title: "Rabbit Vibrators | Blended Orgasms",
                        description: "The best of both worlds. Internal and external stimulation simultaneously.",
                        image: "cat-banner-rabbit-vibe.png?v=1",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/wand-vibrators",
                        name: "Power Wands",
                        title: "Wand Massagers | Deep Tissue Relaxation",
                        description: "For those who need more power. Deep rumbly vibrations for total body release.",
                        image: "cat-banner-wand-vibe.png?v=1",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/nipple-toys",
                        name: "Sensory Play",
                        title: "Sensory & Nipple Toys",
                        description: "Enhance sensitivity with clamps, suckers, and feather-soft touches.",
                        image: "cat-banner-nipple.png",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "male-sex-toys",
                name: "For Him",
                title: "For Him | Men's Wellness & Pleasure",
                description: "Advanced engineering for male pleasure. Strokers, rings, and training devices.",
                image: "cat-banner-for-him.png",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "male-sex-toys/male-masturbators",
                        name: "Electric Strokers",
                        title: "Electric Masturbators | Hands-Free Pleasure",
                        description: "High-tech devices featuring vibration, suction, and heating.",
                        image: "cat-banner-male-masturbators.png",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/manual-strokers", // 👈 修正了这里！
                        name: "Manual Sleeves",
                        title: "Manual Strokers | Realistic Texture",
                        description: "Textured sleeves and strokers for controlled stimulation.",
                        image: "",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/stamina-training", // 👈 新增：锻炼器分类
                        name: "Stamina Training",
                        title: "Endurance & Stamina Training Toys",
                        description: "Build confidence and control. Devices designed for desensitization and endurance.",
                        image: "",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/cock-rings",
                        name: "Performance Rings",
                        title: "Cock Rings | Performance Enhancers",
                        description: "Stay harder for longer. Vibrating and silicone rings for couples.",
                        image: "cat-banner-cock-ring.png",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/prostate-toys",
                        name: "Prostate Massagers",
                        title: "Prostate Massagers | P-Spot Tools",
                        description: "Ergonomically designed for P-spot exploration.",
                        image: "",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "sex-toys",
                name: "Anal Play", // 👈 保持原名，为了SEO
                title: "Anal Play | Plugs & Accessories",
                description: "Safe, comfortable, and elegant anal toys for beginners and experts.",
                image: "cat-banner-for-anal.png",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "sex-toys/butt-plugs",
                        name: "Butt Plugs",
                        title: "Butt Plugs | Comfort Fit Plugs",
                        description: "Silicone, glass, and metal plugs for extended wear.",
                        image: "",
                        root: "sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "sex-toys/anal-beads",
                        name: "Beads & Chains",
                        title: "Anal Beads | Progressive Play",
                        description: "Graduated sizes for training and sensation.",
                        image: "",
                        root: "sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "lingerie",
                name: "Lingerie",
                title: "Lingerie | Bodystockings & Intimates",
                description: "Confidence you can wear. Seductive styles for every body.",
                image: "cat-banner-lingerie.png?v=1",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "lingerie/bodystockings",
                        name: "Bodystockings",
                        title: "Bodystockings | Seamless Mesh Lingerie",
                        description: "Form-fitting designs that celebrate your curves.",
                        image: "",
                        root: "lingerie",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "bondage-play",
                name: "Kink & Play",
                title: "Bondage & Sensory Play | Soft Kink",
                description: "Explore new sensations with our beginner-friendly restraint and sensory collection.",
                image: "cat-banner-bondage-play.png",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "bondage-play/restraints",
                        name: "Soft Restraints",
                        title: "Handcuffs & Restraints",
                        description: "Comfortable silicone and fabric restraints.",
                        image: "",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "bondage-play/impact-play",
                        name: "Impact & Sensory",
                        title: "Whips, Paddles & Masks",
                        description: "Tools for sensation play, from tickle to thud.",
                        image: "",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            }
        ]
    }
};