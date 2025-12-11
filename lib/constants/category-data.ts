// lib/constants/category-data.ts
import { CategoriesData } from '@/types/category';

export const CATEGORIES_DATA: CategoriesData = {
    category: {
        roots: [
            {
                slug: "all",
                name: "Shop",
                title: "Shop | Sex Toys & Adult Products",
                description: "Browse our complete collection of sex toys, lingerie and adult products. New arrivals, best sellers and more.",
                priority: 0.8,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "new-arrivals",
                        name: "New In",
                        title: "New Arrivals | Latest Sex Toys & Adult Products",
                        description: "Discover the newest sex toys and intimate products. Latest releases and innovative designs for ultimate pleasure.",
                        root: "shop",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "best-sellers",
                        name: "Best Sellers",
                        title: "Best Selling Sex Toys | Top Rated Adult Products",
                        description: "Shop best selling sex toys and top rated adult products. Premium quality discreet shipping.",
                        root: "shop",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "female-sex-toys",
                name: "For Her",
                title: "Female Sex Toys | Women's Vibrators & Pleasure Products",
                description: "Premium sex toys for women. Clit vibrators, rabbit toys, dildos and intimate massagers.",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "female-sex-toys/clit-vibrators",
                        name: "Clit Vibrators",
                        title: "Clit Vibrators | Clitoral Stimulation Toys",
                        description: "Best clit vibrators for intense orgasms. External stimulation toys for women.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/nipple-toys",
                        name: "Nipple Stimulator",
                        title: "Nipple Toys | Nipple Stimulators & Clamps",
                        description: "Nipple stimulators and clamps for sensual play. Gentle to intense stimulation.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/g-spot-vibrators",
                        name: "G-Spot Vibrators",
                        title: "G-Spot Vibrators | Internal Stimulation Toys",
                        description: "G-spot vibrators for deep orgasms. Curved toys for internal stimulation.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/bullet-vibrators",
                        name: "Bullet Vibrators",
                        title: "Bullet Vibrators | Small Discreet Massagers",
                        description: "Compact bullet vibrators for targeted stimulation. Quiet and powerful.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/rabbit-vibrators",
                        name: "Rabbit Vibrators",
                        title: "Rabbit Vibrators | Dual Stimulation Toys",
                        description: "Rabbit vibrators for dual stimulation. Internal and clitoral pleasure.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/wand-vibrators",
                        name: "Wand Vibrators",
                        title: "Wand Massagers | Powerful Body Vibrators",
                        description: "Powerful wand massagers for deep vibrations. Full body stimulation toys.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "female-sex-toys/dildos",
                        name: "Dildos",
                        title: "Dildos | Realistic Sex Toys for Women",
                        description: "Premium dildos in various sizes. Realistic and non-vibrating toys.",
                        root: "female-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "male-sex-toys",
                name: "For Him",
                title: "Male Sex Toys | Men's Pleasure Products",
                description: "Advanced sex toys for men. Masturbators, prostate massagers and strokers.",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "male-sex-toys/male-masturbators",
                        name: "Male Masturbators",
                        title: "Male Masturbators | Handheld Sex Toys",
                        description: "Realistic male masturbators and strokers. Textured sleeves for men.",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/cock-rings",
                        name: "Cock Rings",
                        title: "Cock Rings | Performance & Vibrating Rings",
                        description: "Enhance stamina and pleasure with premium cock rings. Vibrating and stretchy options for couples.",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/pussy-masturbators",
                        name: "Pussy & Ass Masturbators",
                        title: "Pussy & Anal Masturbators | Realistic Strokers",
                        description: "Realistic pussy and anal masturbators. Lifelike textures for men.",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/prostate-toys",
                        name: "Prostate Massagers",
                        title: "Prostate Massagers | P-Spot Toys for Men",
                        description: "Prostate massagers for P-spot stimulation. Anal toys for male orgasms.",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "male-sex-toys/sex-dolls",
                        name: "Sex Dolls",
                        title: "Sex Dolls | Realistic Love Dolls",
                        description: "High-quality sex dolls and love dolls. Lifelike companions for men.",
                        root: "male-sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "sex-toys",
                name: "Sex Toys",
                title: "Adult Sex Toys | Vibrators, Dildos & More",
                description: "Complete collection of adult sex toys. Anal toys, BDSM gear and accessories.",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "sex-toys/anal-beads",
                        name: "Anal Beads",
                        title: "Anal Beads | Progressive Anal Play Toys",
                        description: "Graduated anal beads for beginners and experts. Unique sensations.",
                        root: "sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "sex-toys/butt-plugs",
                        name: "Butt Plugs",
                        title: "Butt Plugs | Anal Plugs for Extended Wear",
                        description: "Comfortable butt plugs in various sizes. Safe anal play products.",
                        root: "sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "sex-toys/tail-plugs",
                        name: "Tail Toys",
                        title: "Tail Plugs | Animal Tail Butt Plugs",
                        description: "Playful tail plugs for fantasy play. Fox, cat and bunny tails.",
                        root: "sex-toys",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "lingerie",
                name: "Lingerie",
                title: "Sexy Lingerie | Intimate Apparel & Costumes",
                description: "Seductive lingerie for intimate moments. Babydolls, corsets and sexy wear.",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "lingerie/schoolgirl-lingerie",
                        name: "Schoolgirl Lingerie",
                        title: "Schoolgirl Lingerie | Roleplay Costumes",
                        description: "Schoolgirl lingerie for fantasy roleplay. Plaid skirts and outfits.",
                        root: "lingerie",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            },
            {
                slug: "bondage-play",
                name: "Bondage & Play",
                title: "Bondage & SM Toys | Kink, Fetish & BDSM Gear",
                description: "Explore your kinky side with our collection of bondage gear. Handcuffs, whips, blindfolds and sensory play toys.",
                priority: 0.7,
                changefreq: "weekly",
                categories: [
                    {
                        slug: "bondage-play/impact-play",
                        name: "Whips & Crops", // 👈 这里放鞭子
                        title: "Impact Play | Sex Whips, Paddles & Crops",
                        description: "Spankers, whips, and riding crops for impact play. Experience the thrill of sensation.",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "bondage-play/restraints",
                        name: "Handcuffs & Restraints",
                        title: "Sex Handcuffs & Restraints | Bondage Gear",
                        description: "Beginner-friendly handcuffs, ankle cuffs, and soft restraints for bedroom submission.",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "bondage-play/sensory-play",
                        name: "Blindfolds & Masks",
                        title: "Sensory Deprivation | Blindfolds & Eye Masks",
                        description: "Enhance sensitivity by removing sight. Satin blindfolds and masks for sensory play.",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    },
                    {
                        slug: "bondage-play/bdsm-kits",
                        name: "Bondage Kits",
                        title: "BDSM Starter Kits | Beginner Bondage Sets",
                        description: "All-in-one bondage sets for beginners. Includes cuffs, blindfolds, and teasers.",
                        root: "bondage-play",
                        priority: 0.7,
                        changefreq: "weekly"
                    }
                ]
            }
        ]
    }
};