// lib/constants/category-data.ts
// ⚠️ 本文件由 scripts/generate-category-data.mjs 自动生成（构建时从后端 /api/V1/categories 拉取），
//    请勿手改；要改分类请到 admin「分类管理」，改完触发一次构建发布。
import { CategoriesData } from '@/types/category';

export const CATEGORIES_DATA: CategoriesData = {
    "category": {
        "roots": [
            {
                "slug": "all",
                "name": "Shop",
                "title": "Shop All | Curated Intimacy Collection",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-for-all.png",
                "description": "Explore our complete range of premium pleasure objects. From air-pulse technology to designer aesthetic toys.",
                "priority": 0.8,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "all/new-arrivals",
                        "name": "New In",
                        "title": "New Arrivals | Latest Innovations",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-new-in.png",
                        "description": "Discover the latest in pleasure technology. New designs, quieter motors, and premium materials.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "all"
                    },
                    {
                        "slug": "all/best-sellers",
                        "name": "Best Sellers",
                        "title": "Best Sellers | Most Loved by Our Community",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-best-seller.png",
                        "description": "Shop our most popular items. Verified reviews and proven satisfaction.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "all"
                    }
                ]
            },
            {
                "slug": "female-sex-toys",
                "name": "For Her",
                "title": "For Her | Premium Vibrators & Massagers",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-for-her.png",
                "description": "Elegant pleasure products designed for her. Featuring liquid silicone and whisper-quiet technology.",
                "priority": 0.7,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "female-sex-toys/clit-vibrators",
                        "name": "Air-Pulse & Clit",
                        "title": "Clit Vibrators | Air-Pulse Technology",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-clit-vibrator.png?v=3",
                        "description": "Experience contactless suction and focused vibration. Our most popular category.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    },
                    {
                        "slug": "female-sex-toys/g-spot-vibrators",
                        "name": "G-Spot Vibrators",
                        "title": "Best G-Spot Vibrators | Premium G Spot Toys for Women",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-g-spot.png?v=1",
                        "description": "Discover the best g spot vibrators designed for precise internal stimulation. Our premium g spot toys feature ergonomic curves and powerful vibrations to find your perfect angle. Shop quality g spot vibrators for intense, deep orgasms.",
                        "priority": 0.8,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    },
                    {
                        "slug": "female-sex-toys/bullet-vibrators",
                        "name": "Bullets & Lipsticks",
                        "title": "Bullet Vibrators | Discreet & Travel Friendly",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-bullet-vibe.png?v=1",
                        "description": "Pocket-sized power. Perfect for travel or discreet play.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    },
                    {
                        "slug": "female-sex-toys/rabbit-vibrators",
                        "name": "Dual Action",
                        "title": "Rabbit Vibrators | Blended Orgasms",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-rabbit-vibe.png?v=1",
                        "description": "The best of both worlds. Internal and external stimulation simultaneously.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    },
                    {
                        "slug": "female-sex-toys/wand-vibrators",
                        "name": "Power Wands",
                        "title": "Wand Massagers | Deep Tissue Relaxation",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-wand-vibe.png?v=1",
                        "description": "For those who need more power. Deep rumbly vibrations for total body release.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    },
                    {
                        "slug": "female-sex-toys/nipple-toys",
                        "name": "Sensory Play",
                        "title": "Sensory & Nipple Toys",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-nipple.png",
                        "description": "Elevate your wellness routine with our Sensory Play collection, featuring premium sensory toys for adults designed for high-tactile pleasure and mindful relaxation.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "female-sex-toys"
                    }
                ]
            },
            {
                "slug": "male-sex-toys",
                "name": "For Him",
                "title": "For Him | Men's Wellness & Pleasure",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-for-him.png",
                "description": "Advanced engineering for male pleasure. Strokers, rings, and training devices.",
                "priority": 0.7,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "male-sex-toys/male-masturbators",
                        "name": "Electric Strokers",
                        "title": "Electric Masturbators | Hands-Free Pleasure",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-male-masturbators.png",
                        "description": "High-tech devices featuring vibration, suction, and heating.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "male-sex-toys"
                    },
                    {
                        "slug": "male-sex-toys/manual-strokers",
                        "name": "Manual Sleeves",
                        "title": "Manual Strokers | Realistic Texture",
                        "description": "Textured sleeves and strokers for controlled stimulation.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "male-sex-toys"
                    },
                    {
                        "slug": "male-sex-toys/stamina-training",
                        "name": "Stamina Training",
                        "title": "Endurance & Stamina Training Toys",
                        "description": "Build confidence and control. Devices designed for desensitization and endurance.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "male-sex-toys"
                    },
                    {
                        "slug": "male-sex-toys/cock-rings",
                        "name": "Performance Rings",
                        "title": "Cock Rings | Performance Enhancers",
                        "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-cock-ring.png",
                        "description": "Stay harder for longer. Vibrating and silicone rings for couples.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "male-sex-toys"
                    },
                    {
                        "slug": "male-sex-toys/prostate-toys",
                        "name": "Prostate Massagers",
                        "title": "Prostate Massagers | P-Spot Tools",
                        "description": "Ergonomically designed for P-spot exploration.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "male-sex-toys"
                    }
                ]
            },
            {
                "slug": "sex-toys",
                "name": "Anal Play",
                "title": "Anal Play | Plugs & Accessories",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-for-anal.png",
                "description": "Safe, comfortable, and elegant anal toys for beginners and experts.",
                "priority": 0.7,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "sex-toys/butt-plugs",
                        "name": "Butt Plugs",
                        "title": "Butt Plugs | Comfort Fit Plugs",
                        "description": "Silicone, glass, and metal plugs for extended wear.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "sex-toys"
                    },
                    {
                        "slug": "sex-toys/anal-beads",
                        "name": "Beads & Chains",
                        "title": "Anal Beads | Progressive Play",
                        "description": "Graduated sizes for training and sensation.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "sex-toys"
                    }
                ]
            },
            {
                "slug": "lingerie",
                "name": "Lingerie",
                "title": "Lingerie | Bodystockings & Intimates",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-lingerie.png?v=1",
                "description": "Confidence you can wear. Seductive styles for every body.",
                "priority": 0.7,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "lingerie/bodystockings",
                        "name": "Bodystockings",
                        "title": "Bodystockings | Seamless Mesh Lingerie",
                        "description": "Form-fitting designs that celebrate your curves.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "lingerie"
                    }
                ]
            },
            {
                "slug": "bondage-play",
                "name": "Kink & Play",
                "title": "Bondage & Sensory Play | Soft Kink",
                "image": "https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/cat-banner-bondage-play.png",
                "description": "Explore new sensations with our beginner-friendly restraint and sensory collection.",
                "priority": 0.7,
                "changefreq": "weekly",
                "categories": [
                    {
                        "slug": "bondage-play/restraints",
                        "name": "Soft Restraints",
                        "title": "Handcuffs & Restraints",
                        "description": "Comfortable silicone and fabric restraints.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "bondage-play"
                    },
                    {
                        "slug": "bondage-play/impact-play",
                        "name": "Impact & Sensory",
                        "title": "Whips, Paddles & Masks",
                        "description": "Tools for sensation play, from tickle to thud.",
                        "priority": 0.7,
                        "changefreq": "weekly",
                        "root": "bondage-play"
                    }
                ]
            }
        ]
    }
};
