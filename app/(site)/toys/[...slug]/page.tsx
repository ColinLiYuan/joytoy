// /toys/[slug]/route.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productServiceServer } from '@/services/servers/product-service-server';
import { ProductResponse } from '@/types/product';
import ProductDetailClient from './ProductDetailClient';
import { getProductImageUrl } from '@/lib/image-utils';

// 添加 Breadcrumb 类型定义
interface Breadcrumb {
    name: string;
    path: string | null;
}

// 颜色映射表
const colorMap: { [key: string]: string } = {
    // 肤色系列
    'flesh': '#FFE9D1',
    'skin': '#FFE9D1',

    'nude': '#F3E5AB',
    'beige': '#F5F5DC',
    'tan': '#D2B48C',
    'ivory': '#FFFFF0',
    'cream': '#FFFDD0',

    // 红色系列
    'red': '#FF0000',
    'crimson': '#DC143C',
    'scarlet': '#FF2400',
    'burgundy': '#800020',
    'maroon': '#800000',
    'pink': '#FFC0CB',
    'rose': '#FF007F',
    'coral': '#FF7F50',

    // 蓝色系列
    'blue': '#0000FF',
    'navy': '#000080',
    'skyblue': '#87CEEB',
    'royalblue': '#4169E1',
    'teal': '#008080',
    'turquoise': '#40E0D0',
    'aqua': '#00FFFF',
    'cyan': '#00FFFF',

    // 绿色系列
    'green': '#008000',
    'lime': '#00FF00',
    'forest': '#228B22',
    'olive': '#808000',
    'emerald': '#50C878',
    'mint': '#98FB98',
    'seagreen': '#2E8B57',

    // 黄色/橙色系列
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'amber': '#FFBF00',
    'mustard': '#FFDB58',

    // 紫色系列
    'purple': '#800080',
    'violet': '#EE82EE',
    'lavender': '#E6E6FA',
    'lilac': '#C8A2C8',
    'plum': '#DDA0DD',

    // 棕色系列
    'brown': '#A52A2A',
    'chocolate': '#D2691E',
    'coffee': '#6F4E37',
    'caramel': '#AF6E4D',
    'coffee light': '#6F4E37',
    'coffee dark': '#3B2A1A',
    'espresso': '#3B2A1A',
    'mocha': '#8B7355',
    'latte': '#C4A484',
    'cappuccino': '#A68B6F',

    // 灰色/黑色系列
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'charcoal': '#36454F',

    // 金属色
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'bronze': '#CD7F32',
    'copper': '#B87333'
};

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

// 获取映射后的颜色值
function getMappedColor(color: string): string {
    const normalizedColor = color.toLowerCase().trim();
    return colorMap[normalizedColor] || color;
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
        console.log('ProductDetail product：', product)
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