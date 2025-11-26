// /toys/[slug]/route.tsx (app/(site)/toys/[...slug]/page.tsx)
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? `/${resolvedParams.slug.join('/')}` : `/${resolvedParams.slug}`;
    try {
        const product = await productServiceServer.getProductBySlug(slug);
        const canonicalUrl = `https://mythtoy.com/toys${slug}`;
        const imageUrl = getProductImageUrl('', product.image);
        const description = product.description?.substring(0, 160) || `Buy ${product.title}`;

        return {
            title: `${product.title} - Myth Toy`,
            description: description,
            alternates: { canonical: canonicalUrl },
            openGraph: {
                title: product.title,
                description: description,
                url: canonicalUrl,
                type: 'website',
                images: [{ url: imageUrl, width: 800, height: 600, alt: product.title }],
            },
            twitter: { card: 'summary_large_image', title: product.title, description: description, images: [imageUrl] },
        };
    } catch (error) {
        return { title: 'Product Not Found', description: 'The product does not exist.' };
    }
}

function generateBreadcrumbPaths(slugArray: string[], product: ProductResponse | null): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [{ name: 'Home', path: '/' }];
    let currentPath = '';
    for (let i = 0; i < slugArray.length; i++) {
        const slugPart = slugArray[i];
        currentPath += `/${slugPart}`;
        if (i === slugArray.length - 1) {
            breadcrumbs.push({ name: product?.title || formatDisplayName(slugPart), path: null });
        } else {
            breadcrumbs.push({ name: formatDisplayName(slugPart), path: `/collections${currentPath}` });
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

    const breadcrumbs = generateBreadcrumbPaths(
        Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug],
        product
    );

    const getGalleryImages = () => {
        if (!product) return [];
        const hasGallery = !!(product.galleries && product.galleries.length > 0);
        return hasGallery ?
            product.galleries!.map(gallery => ({ url: getProductImageUrl(product!.baseUrl, gallery.url), alt: gallery.alt || product.title })) :
            [{ url: getProductImageUrl('', product.image), alt: product.title }];
    };

    const galleryImages = getGalleryImages();
    const specifications = Array.isArray(product.specifications) ? product.specifications : [];
    const features = Array.isArray(product.features) ? product.features : [];
    const description = product.description || '';
    const defaultColor = product.colors?.[0] || null;

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ 修复：确保容器宽度和 Padding 与 Navigation 一致 */}
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8">
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