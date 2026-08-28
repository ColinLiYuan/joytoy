// lib/constants/related-guides.ts
// Static mapping: category slug → related blog slugs (SEO internal linking)
// Only includes high-SEO-value blogs; brand/editorial content excluded.

const FEMALE_BASE = [
  'how-to-use-g-spot-vibrator-beginners-guide',
  'best-beginner-vibrators-guide',
];

const MALE_BASE = [
  'death-grip-syndrome-desensitization-fix',
  'beginners-guide-exploring-male-p-spot-safely',
  'science-of-stamina-training-for-men',
];

const UNIVERSAL = [
  'body-safe-materials-guide',
  'ultimate-cleaning-routine-toy-care',
];

export const CATEGORY_BLOG_MAP: Record<string, string[]> = {
  // ── Shop ──
  all: [
    'best-beginner-vibrators-guide',
    'body-safe-materials-guide',
    'ultimate-cleaning-routine-toy-care',
  ],
  'new-arrivals': UNIVERSAL,
  'best-sellers': UNIVERSAL,

  // ── For Her ──
  'female-sex-toys': [
    ...FEMALE_BASE,
    'decibel-test-quietest-vibrators',
    'sonic-waves-vs-vibration-technology',
    'best-wand-vibrators-complete-guide',
    'guide-to-luxury-lubrication-water-vs-silicone',
  ],
  'female-sex-toys/g-spot-vibrators': [
    'how-to-use-g-spot-vibrator-beginners-guide',
    'best-beginner-vibrators-guide',
  ],
  'female-sex-toys/clit-vibrators': [
    'sonic-waves-vs-vibration-technology',
    'best-beginner-vibrators-guide',
  ],
  'female-sex-toys/bullet-vibrators': [
    'packing-for-pleasure-travel-checklist',
    'decibel-test-quietest-vibrators',
    'best-beginner-vibrators-guide',
  ],
  'female-sex-toys/rabbit-vibrators': [
    'what-is-a-rabbit-vibrator',
    'how-to-use-g-spot-vibrator-beginners-guide',
    'best-beginner-vibrators-guide',
  ],
  'female-sex-toys/wand-vibrators': [
    'wand-vibrator-beginners-guide',
    'decibel-test-quietest-vibrators',
    'best-beginner-vibrators-guide',
  ],
  'female-sex-toys/nipple-toys': [
    'beginners-guide-to-sensory-play',
    'temperature-play-glass-metal-guide',
  ],

  // ── For Him ──
  'male-sex-toys': [
    ...MALE_BASE,
    'prostate-health-massage-benefits',
  ],
  'male-sex-toys/male-masturbators': [
    'male-masturbator-beginners-guide',
    'stamina-training-edging-guide',
    ...MALE_BASE,
  ],
  'male-sex-toys/manual-strokers': [
    'death-grip-syndrome-desensitization-fix',
    'male-masturbator-beginners-guide',
  ],
  'male-sex-toys/stamina-training': [
    'science-of-stamina-training-for-men',
    'death-grip-syndrome-desensitization-fix',
  ],
  'male-sex-toys/cock-rings': [
    'cock-ring-beginners-guide',
    'science-of-stamina-training-for-men',
  ],
  'male-sex-toys/prostate-toys': [
    'prostate-health-massage-benefits',
    'beginners-guide-exploring-male-p-spot-safely',
  ],

  // ── Anal Play ──
  'sex-toys': [
    'ultimate-cleaning-routine-toy-care',
    'body-safe-materials-guide',
    'guide-to-luxury-lubrication-water-vs-silicone',
    'temperature-play-glass-metal-guide',
  ],
  'sex-toys/butt-plugs': [
    'butt-plug-beginners-guide',
    'body-safe-materials-guide',
    'ultimate-cleaning-routine-toy-care',
    'temperature-play-glass-metal-guide',
  ],
  'sex-toys/anal-beads': [
    'body-safe-materials-guide',
    'ultimate-cleaning-routine-toy-care',
  ],

  // ── Lingerie ──
  lingerie: [
    'bridal-shower-gift-guide-classy-toys',
    'anniversary-gift-guide-luxury-intimacy',
    'gifts-for-him-upgrading-his-nightstand',
  ],
  'lingerie/bodystockings': [
    'bridal-shower-gift-guide-classy-toys',
  ],

  // ── Bondage / Kink ──
  'bondage-play': [
    'beginners-guide-to-sensory-play',
    'temperature-play-glass-metal-guide',
    'date-night-ideas-staying-in',
  ],
  'bondage-play/restraints': [
    'beginners-guide-to-sensory-play',
  ],
  'bondage-play/impact-play': [
    'beginners-guide-to-sensory-play',
  ],
};

/** Resolve related blog slugs for a category, falling back to parent category */
export function getRelatedBlogSlugs(categorySlug: string, parentSlug?: string): string[] {
  // Exact match first
  if (CATEGORY_BLOG_MAP[categorySlug]) {
    return CATEGORY_BLOG_MAP[categorySlug];
  }
  // Try parent
  if (parentSlug && CATEGORY_BLOG_MAP[parentSlug]) {
    return CATEGORY_BLOG_MAP[parentSlug];
  }
  // Universal fallback
  return UNIVERSAL;
}
