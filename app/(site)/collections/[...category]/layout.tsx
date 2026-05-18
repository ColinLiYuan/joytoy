import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.category.join('/');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
  const canonicalUrl = `${baseUrl}/collections/${slug}`;

  // 针对 stamina-training 分类的专属 SEO 配置
  if (slug === 'male-sex-toys/stamina-training') {
    return {
      title: 'Stamina Training Devices & Delay Rings | MythToy',
      description: 'Explore premium stamina training units and premature ejaculation devices. Safe, body-safe tools to improve control, endurance, and intimacy. Shop discreetly at MythToy.',
      keywords: [
        'stamina training',
        'premature ejaculation device',
        'stamina training unit',
        'premature ejaculation ring',
        'delay rings for men',
        'premature ejaculation stop start method',
        'male endurance training',
        'sensory toys for adults'
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: 'Stamina Training Devices & Delay Rings | MythToy',
        description: 'Explore premium stamina training units and premature ejaculation devices. Safe, body-safe tools to improve control, endurance, and intimacy.',
        url: canonicalUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Stamina Training Devices & Delay Rings | MythToy',
        description: 'Explore premium stamina training units and premature ejaculation devices. Safe, body-safe tools to improve control.',
      },
    };
  }

  // 其他分类的默认 SEO 配置
  return {
    title: 'Shop Collections | MythToy',
    description: 'Browse our curated collections of premium adult toys and lifestyle products.',
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
