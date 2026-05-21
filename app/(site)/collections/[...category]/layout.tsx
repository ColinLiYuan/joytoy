import { Metadata } from 'next';
import { categoryService } from '@/services/categoryService';

// Per-category SEO overrides — add more entries as needed
const CATEGORY_SEO: Record<string, {
    title: string;
    description: string;
    keywords?: string[];
}> = {
    'female-sex-toys/g-spot-vibrators': {
        title: 'Best G-Spot Vibrators — Premium G Spot Toys for Women | MythToy',
        description: 'Shop the best g spot vibrators designed for internal stimulation. Premium g spot toys with ergonomic curves for intense, deep orgasms. Free shipping on orders over $49.',
        keywords: [
            'g spot toy', 'g spot vibrators', 'best g spot vibrators',
            'g spot toys for women', 'g spot vibrator for female',
            'best g spot toys', 'ergonomic g spot vibrator', 'internal stimulation toy'
        ],
    },
    'all': {
        title: 'Shop All Products — Premium Body-Safe Adult Toys | MythToy',
        description: 'Browse our complete catalog of premium body-safe adult toys. Medical-grade silicone vibrators, air-pulse stimulators, and more. Discreet shipping, 1-year warranty.',
        keywords: ['adult toys', 'premium vibrators', 'body-safe products', 'discreet shipping', 'shop all', 'luxury adult toys'],
    },
    'male-sex-toys/stamina-training': {
        title: 'Stamina Training Devices & Delay Rings | MythToy',
        description: 'Explore premium stamina training units and premature ejaculation devices. Safe, body-safe tools to improve control, endurance, and intimacy. Shop discreetly at MythToy.',
        keywords: [
            'stamina training', 'premature ejaculation device', 'stamina training unit',
            'premature ejaculation ring', 'delay rings for men',
            'premature ejaculation stop start method', 'male endurance training',
        ],
    },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string[] }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.category.join('/');
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    const canonicalUrl = `${baseUrl}/collections/${slug}`;

    // Check for manual SEO override first
    const override = CATEGORY_SEO[slug];
    if (override) {
        return {
            title: override.title,
            description: override.description,
            keywords: override.keywords,
            alternates: { canonical: canonicalUrl },
            openGraph: {
                title: override.title,
                description: override.description,
                url: canonicalUrl,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: override.title,
                description: override.description,
            },
        };
    }

    // Auto-generate metadata from category name
    let categoryName = '';
    try {
        const categories = await categoryService.getCategories();
        const match = categories.find(cat => cat.slug === slug);
        if (match) {
            categoryName = match.name;
        } else {
            // Try matching by last segment
            const lastSegment = resolvedParams.category[resolvedParams.category.length - 1];
            categoryName = lastSegment
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ');
        }
    } catch {
        const lastSegment = resolvedParams.category[resolvedParams.category.length - 1];
        categoryName = lastSegment
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ');
    }

    const title = `${categoryName} — Premium Body-Safe Adult Toys | MythToy`;
    const description = `Shop ${categoryName.toLowerCase()} at MythToy. Premium body-safe materials, discreet shipping, and 1-year warranty. Browse our curated collection online.`;

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            siteName: 'MythToy',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
