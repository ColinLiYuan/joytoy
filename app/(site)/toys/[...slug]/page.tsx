// app/toys/[...slug]/route.ts
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { productService } from '@/services/productService';
import { ProductResponse } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';
import { BACKEND_CONFIG } from '@/lib/api-config';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    try {
        // ✅ 从 Cookie 读取 Token（服务端）
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        
        // ✅ 手动构建请求，带上 Token
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/product?slug=${encodeURIComponent(slug)}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const response = await fetch(url, { headers });
        const result = await response.json();
        
        if (!result?.success) {
            return { title: 'Product Not Found', description: 'The product does not exist.' };
        }
        
        const product = result.data;
        const canonicalUrl = `https://mythtoy.com/toys${slug}`;
        const imageUrl = getProductImageUrl(undefined, product.image);
        // 去除 Markdown 符号，只取纯文本作为描述，避免 Schema 报错
        const cleanDescription = product.description?.replace(/[#*`]/g, '').substring(0, 160) || `Buy ${product.title}`;

        return {
            title: `${product.title} - MythToy`,
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
        // ✅ 从 Cookie 读取 Token（服务端）
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        
        // ✅ 手动构建请求，带上 Token
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/product?slug=${encodeURIComponent(slug)}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const response = await fetch(url, { headers });
        const result = await response.json();
        
        if (result?.success) {
            product = result.data;
        }
    } catch (err) {
        console.error('Error fetching product:', err);
    }

    if (!product) notFound();

    // --- 🔥 核心修改：构建 Product Schema JSON-LD ---
    const productImageUrl = getProductImageUrl(undefined, product.image);
    const galleryUrls = product.galleries?.map(g => getProductImageUrl(undefined, g.url)) || [];
    const allImages = [productImageUrl, ...galleryUrls];

    // 简单的 Markdown 清理，确保 JSON 不会坏掉
    const schemaDescription = product.description
        ? product.description.replace(/['"]/g, '').replace(/[#*`_]/g, '').substring(0, 200) + '...'
        : product.title;

    const breadcrumbs = generateBreadcrumbPaths(
        Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug],
        product
    );

    // ------------------------------------------------
    // JSON-LD Structured Data
    // ------------------------------------------------
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                name: product.title,
                image: allImages,
                description: schemaDescription,
                sku: product.sku || 'DEFAULT_SKU',
                brand: {
                    '@type': 'Brand',
                    name: product.brand || 'MythToy',
                },
                offers: {
                    '@type': 'Offer',
                    url: `https://mythtoy.com/toys${slug}`,
                    priceCurrency: 'USD',
                    price: product.currentPrice,
                    priceValidUntil: '2026-12-31',
                    itemCondition: 'https://schema.org/NewCondition',
                    availability: (product.status === 'ACTIVE' && product.stock > 0)
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                },
                ...(product.rating ? {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviewCount || 5
                    }
                } : {})
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbs.map((crumb, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: crumb.name,
                    item: crumb.path ? `https://mythtoy.com${crumb.path}` : undefined
                }))
            }
        ]
    };

    // ... 这一块处理 galleryImages 的逻辑保持不变 ...
    const getGalleryItems = (): Array<{ url: string; alt: string; type: 'image' | 'video'; poster: string }> => {
        if (!product) return [];
        
        // 直接使用 galleries 作为相册，不再单独添加主图
        if (product.galleries && product.galleries.length > 0) {
            return product.galleries.map(gallery => ({
                url: getProductImageUrl(undefined, gallery.url),
                alt: gallery.alt || product.title,
                type: (gallery.type as 'image' | 'video') || 'image',
                poster: getProductImageUrl(undefined, gallery.poster)
            }));
        }
        
        // 如果没有 galleries，返回空数组
        return [];
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