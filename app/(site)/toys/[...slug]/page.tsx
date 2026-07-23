// app/toys/[...slug]/route.ts
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { blogService } from '@/services/blogService';
import { ProductResponse } from '@/types/product';
import { BlogResponse } from '@/types/site/blog';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { getRelatedBlogSlugs } from '@/lib/constants/related-guides';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/product?slug=${encodeURIComponent(slug)}`;
        const response = await fetch(url, { next: { revalidate: 86400 } });
        const result = await response.json();
        
        if (!result?.success) {
            return { title: 'Product Not Found', description: 'The product does not exist.' };
        }
        
        const product = result.data;
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
        const canonicalUrl = `${baseUrl}/toys${slug}`;
        const imageUrl = getProductImageUrl(undefined, product.image);
        // 去除 Markdown 符号，只取纯文本作为描述，避免 Schema 报错
        const cleanDescription = product.description?.replace(/[#*`]/g, '').substring(0, 160) || `Buy ${product.title}`;

        return {
            title: product.title,
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

export const revalidate = 86400;

export default async function ProductDetail({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    let product: ProductResponse | null = null;

    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/product?slug=${encodeURIComponent(slug)}`;
        const response = await fetch(url, { next: { revalidate: 86400 } });
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
    // ✅ 基于 SKU 计算总可用库存（产品表的库存字段已删除）
    const totalAvailableStock = (product.productSkus || []).reduce(
        (sum, sku) => sum + ((sku.stock || 0) - (sku.lockedStock || 0)),
        0
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    
    // ✅ 构建 SKU 变体列表
    const skuOffers = (product.productSkus || []).map(sku => {
        const skuStock = (sku.stock || 0) - (sku.lockedStock || 0);
        return {
            '@type': 'Offer',
            url: `${baseUrl}/toys${slug}`,
            priceCurrency: 'USD',
            price: sku.price || product.currentPrice,
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            itemCondition: 'https://schema.org/NewCondition',
            availability: skuStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            sku: sku.sku || `${product.sku}-${sku.color}-${sku.size}`,
            ...(sku.color && { color: sku.color }),
            ...(sku.size && { size: sku.size }),
        };
    });

    // ✅ 构建评论列表（最多5条）
    const reviewElements: any[] = [];
    if (product.reviews && product.reviews.length > 0) {
        const displayReviews = product.reviews.slice(0, 5);
        displayReviews.forEach((review, index) => {
            reviewElements.push({
                '@type': 'Review',
                author: {
                    '@type': 'Person',
                    name: review.authorName || `User${index + 1}`,
                },
                datePublished: review.createdAt,
                reviewBody: review.content?.substring(0, 200) || '',
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: review.rating || 5,
                },
            });
        });
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                '@id': `${baseUrl}/toys${slug}#product`,
                name: product.title,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `${baseUrl}/toys${slug}`,
                },
                image: allImages.map((img, index) => ({
                    '@type': 'ImageObject',
                    url: img,
                    caption: `${product.title} - ${index === 0 ? 'main view' : `view ${index + 1}`}`,
                })),
                description: schemaDescription,
                sku: product.sku || 'DEFAULT_SKU',
                brand: {
                    '@type': 'Brand',
                    name: product.brand || 'MythToy',
                },
                // ✅ 使用 AggregateOffer 支持多变体
                offers: {
                    '@type': 'AggregateOffer',
                    offers: skuOffers.length > 0 ? skuOffers : [{
                        '@type': 'Offer',
                        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'}/toys${slug}`,
                        priceCurrency: 'USD',
                        price: product.currentPrice,
                        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        itemCondition: 'https://schema.org/NewCondition',
                        availability: (product.status === 'ACTIVE' && totalAvailableStock > 0)
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                    }],
                },
                // ✅ 聚合评分（使用真实数据，不再硬编码）
                ...(product.rating && {
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: product.rating,
                        reviewCount: product.reviewCount || 0,
                        ...(product.reviewCount && product.reviewCount > 0 && {
                            bestRating: '5',
                            worstRating: '1',
                        }),
                    },
                }),
                // ✅ 添加评论详情
                ...(reviewElements.length > 0 && {
                    review: reviewElements,
                }),
            }
        ],
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

    // Fetch related blog guides based on product category
    const slugArray = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug];
    const productCategoryPath = slugArray.length > 1 ? slugArray.slice(0, -1).join('/') : '';
    const productParentSlug = slugArray.length > 1 ? slugArray[0] : '';
    const productRelatedBlogSlugs = getRelatedBlogSlugs(productCategoryPath, productParentSlug);
    let productRelatedGuides: BlogResponse[] = [];
    if (productRelatedBlogSlugs.length > 0) {
        const blogResults = await Promise.allSettled(
            productRelatedBlogSlugs.slice(0, 3).map(slug => blogService.getBySlug(slug))
        );
        productRelatedGuides = blogResults
            .filter((r): r is PromiseFulfilledResult<BlogResponse> => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(g => g?.slug);
    }

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
                    relatedGuides={productRelatedGuides}
                />
            </div>
        </div>
    );
}