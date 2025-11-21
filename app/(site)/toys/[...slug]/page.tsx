// /toys/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productServiceServer } from '@/services/servers/product-service-server';
import { ProductResponse } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

// 生成元数据
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug)
        ? `/${resolvedParams.slug.join('/')}`
        : `/${resolvedParams.slug}`;

    try {
        const product = await productServiceServer.getProductBySlug(slug);

        const canonicalUrl = `https://mythtoy.com/toys${slug}`;
        const imageUrl = getProductImageUrl(product.baseUrl, product.image);
        const description = product.description?.substring(0, 160) || `Buy ${product.title} at the best price`;

        return {
            title: `${product.title} - Myth Toy`,
            description: description,
            alternates: {
                canonical: canonicalUrl,
            },
            openGraph: {
                title: product.title,
                description: description,
                url: canonicalUrl,
                type: 'website',
                images: [
                    {
                        url: imageUrl,
                        width: 800,
                        height: 600,
                        alt: product.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: product.title,
                description: description,
                images: [imageUrl],
            },
        };
    } catch (error) {
        return {
            title: 'Product Not Found - Myth Toy',
            description: 'The product you are looking for does not exist.',
        };
    }
}

// 生成面包屑路径
function generateBreadcrumbPaths(slugArray: string[], product: ProductResponse | null): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];
    let currentPath = '';

    // 首页
    breadcrumbs.push({ name: 'Home', path: '/' });

    // 动态生成分类路径
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
    return slug
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export default async function ProductDetail({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug)
        ? `/${resolvedParams.slug.join('/')}`
        : `/${resolvedParams.slug}`;

    let product: ProductResponse | null = null;

    try {
        product = await productServiceServer.getProductBySlug(slug);
    } catch (err) {
        console.error('Error fetching product:', err);
        notFound();
    }

    // 准备数据 - 并行处理
    const [breadcrumbs, galleryImages, specifications, features] = await Promise.all([
        generateBreadcrumbPaths(
            Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug],
            product
        ),
        // 准备相册图片数据
        (() => {
            if (!product) return [];
            const hasGallery = !!(product.galleries && product.galleries.length > 0);
            return hasGallery ?
                product.galleries!.map(gallery => ({
                    url: getProductImageUrl(product!.baseUrl, gallery.url),
                    alt: gallery.alt || product.title
                })) :
                [{
                    url: getProductImageUrl(product.baseUrl, product.image),
                    alt: product.title
                }];
        })(),
        // 安全处理规格数据
        (() => {
            if (!product || !product.specifications) return [];
            return Array.isArray(product.specifications) ? product.specifications : [];
        })(),
        // 安全处理特性数据
        (() => {
            if (!product || !product.features) return [];
            return Array.isArray(product.features) ? product.features : [];
        })()
    ]);

    const description = product.description || '';
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <ProductDetailClient
                    product={product}
                    breadcrumbs={breadcrumbs}
                    galleryImages={galleryImages}
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