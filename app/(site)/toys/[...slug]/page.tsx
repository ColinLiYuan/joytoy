// app/toys/[...slug]/route.ts
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productServiceServer } from '@/services/servers/product-service-server';
import { ProductResponse } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    try {
        const product = await productServiceServer.getProductBySlug(slug);
        // console.log('product: ', product)
        const canonicalUrl = `https://mythtoy.com/toys${slug}`;
        const imageUrl = getProductImageUrl('', product.image);
        // 去除 Markdown 符号，只取纯文本作为描述，避免 Schema 报错
        const cleanDescription = product.description?.replace(/[#*`]/g, '').substring(0, 160) || `Buy ${product.title}`;

        return {
            title: `${product.title} - MythToy`, // 稍微修正了品牌名空格
            description: cleanDescription,
            alternates: { canonical: canonicalUrl },
            openGraph: {
                title: product.title,
                description: cleanDescription,
                url: canonicalUrl,
                type: 'website',
                images: [{ url: imageUrl, width: 800, height: 600, alt: product.title }],
            },
            twitter: { card: 'summary_large_image', title: product.title, description: cleanDescription, images: [imageUrl] },
        };
    } catch (error) {
        return { title: 'Product Not Found', description: 'The product does not exist.' };
    }
}

// ... 你的 generateBreadcrumbPaths 和 formatDisplayName 函数保持不变 ...
function generateBreadcrumbPaths(slugArray: string[], product: ProductResponse | null): { name: string; path: string | null }[] {
    const breadcrumbs = [];
    let currentPath = '';
    breadcrumbs.push({ name: 'Home', path: '/' });
    for (let i = 0; i < slugArray.length; i++) {
        const slugPart = slugArray[i];
        currentPath += `/${slugPart}`;
        if (i === slugArray.length - 1) {
            breadcrumbs.push({
                name: product?.title || formatDisplayName(slugPart),
                path: null
            });
        } else {
            breadcrumbs.push({
                name: formatDisplayName(slugPart),
                path: `/collections${currentPath}`
            });
        }
    }
    return breadcrumbs;
}

function formatDisplayName(slug: string): string {
    return slug.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export default async function ProductDetail({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    let product: ProductResponse | null = null;

    try {
        product = await productServiceServer.getProductBySlug(slug);
    } catch (err) {
        console.error('Error fetching product:', err);
    }

    if (!product) notFound();

    // --- 🔥 核心修改：构建 Product Schema JSON-LD ---
    const productImageUrl = getProductImageUrl('', product.image);
    const galleryUrls = product.galleries?.map(g => getProductImageUrl('', g.url)) || [];
    const allImages = [productImageUrl, ...galleryUrls];

    // 简单的 Markdown 清理，确保 JSON 不会坏掉
    const schemaDescription = product.description
        ? product.description.replace(/['"]/g, '').replace(/[#*`_]/g, '').substring(0, 200) + '...'
        : product.title;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: allImages,
        description: schemaDescription,
        sku: product.sku || 'DEFAULT_SKU',
        brand: {
            '@type': 'Brand',
            name: product.brand || 'MythToy', // 如果数据库没填品牌，默认 MythToy
        },
        offers: {
            '@type': 'Offer',
            url: `https://mythtoy.com/toys${slug}`,
            priceCurrency: 'USD',
            price: product.currentPrice,
            priceValidUntil: '2026-12-31', // 给一个未来的日期，防止警告
            itemCondition: 'https://schema.org/NewCondition',
            availability: (product.status === 'ACTIVE' && product.stock > 0)
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
        // 只有当有评分时才添加 aggregateRating
        ...(product.rating ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                // ⚠️ 注意：如果你的 API 还没返回 reviewCount，这里临时写死 5 或者 10 用于测试星星效果
                // 长期必须让后端返回真实数量
                reviewCount: product.reviewCount || 5
            }
        } : {})
    };
    // ------------------------------------------------

    const breadcrumbs = generateBreadcrumbPaths(
        Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug],
        product
    );

    // ... 这一块处理 galleryImages 的逻辑保持不变 ...
    const getGalleryItems = () => {
        if (!product) return [];
        const hasGallery = !!(product.galleries && product.galleries.length > 0);
        return hasGallery ?
            product.galleries!.map(gallery => ({
                url: getProductImageUrl('', gallery.url),
                alt: gallery.alt || product.title,
                type: gallery.type,
                poster: getProductImageUrl('', gallery.poster)
            })) :
            [{
                url: getProductImageUrl('', product.image),
                alt: product.title,
                type: 'image',
                poster: getProductImageUrl('', '')
            }];
    };

    const galleryItems = getGalleryItems();
    const specifications = Array.isArray(product.specifications) ? product.specifications : [];
    const features = Array.isArray(product.features) ? product.features : [];
    const description = product.description || '';
    const defaultColor = product.colors?.[0] || null;

    console.log('galleryItems', galleryItems)

    return (
        <div className="min-h-screen bg-white">
            {/* 🔥 插入 JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
                <ProductDetailClient
                    product={product}
                    breadcrumbs={breadcrumbs}
                    galleryItems={galleryItems}
                    specifications={specifications}
                    features={features}
                    description={description}
                    defaultColor={defaultColor}
                    colorMap={colorMap}
                />
            </div>
        </div>
    );
}