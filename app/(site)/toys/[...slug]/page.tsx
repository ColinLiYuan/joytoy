// /toys/[slug]/route.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productServiceServer } from '@/services/servers/product-service-server';
import { ProductResponse } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';
import { colorMap } from '@/lib/constants/color-map';

// 添加 Breadcrumb 类型定义
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

        const metadata: Metadata = {
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

        return metadata;
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

        // 最后一项是当前产品，不需要链接
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
    let error: string | null = null;

    try {
        product = await productServiceServer.getProductBySlug(slug);
        // console.log('ProductDetail product：', product)
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch product';
        console.error('Error fetching product:', err);
    }

    // 如果产品不存在，返回404
    if (error || !product) {
        notFound();
    }

    // 准备数据
    const breadcrumbs = generateBreadcrumbPaths(
        Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug],
        product
    );

    // 准备相册图片数据
    const getGalleryImages = () => {
        if (!product) return [];

        // 检查是否有图库图片
        const hasGallery = !!(product.galleries && product.galleries.length > 0);
        const displayImages = hasGallery ?
            product.galleries! :
            [{ url: product.image, alt: product.title }];

        return displayImages;
    };

    // 安全处理规格数据
    const getSafeSpecifications = () => {
        if (!product || !product.specifications) return [];

        // 确保 specifications 是数组
        if (Array.isArray(product.specifications)) {
            return product.specifications;
        }

        // 如果 specifications 不是数组，返回空数组
        console.warn('specifications is not an array:', product.specifications);
        return [];
    };

    // 安全处理特性数据
    const getSafeFeatures = () => {
        if (!product || !product.features) return [];

        // 确保 features 是数组
        if (Array.isArray(product.features)) {
            return product.features;
        }

        // 如果 features 不是数组，返回空数组
        console.warn('features is not an array:', product.features);
        return [];
    };

    // 安全处理描述数据
    const getSafeDescription = () => {
        if (!product || !product.description) return '';
        return product.description;
    };

    const galleryImages = getGalleryImages();
    const specifications = getSafeSpecifications();
    const features = getSafeFeatures();
    const description = getSafeDescription();

    // 默认选中的颜色
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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