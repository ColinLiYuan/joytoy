// /app/admin/product/components/admin-product-gallery.tsx
'use client';

import { useState, useRef } from 'react';
import { productService } from '@/services/product-service';
import { getProductImageUrl } from '@/lib/image-utils';

interface Product {
    id?: number;
    image?: string;
    galleries?: Array<{ id?: number; url: string; alt?: string }>;
    title?: string;
    slug?: string;
    baseUrl?: string;
}

interface ImageUploadProps {
    product: Product;
    updateProduct: (updates: Partial<Product>) => void;
}

export default function AdminProductGallery({ product, updateProduct }: ImageUploadProps) {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && product.slug) {
            try {
                setUploading(true);
                const result = await productService.uploadMainImage(file, product.slug);
                updateProduct({ image: result.url });

                // 预览
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMainImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);

            } catch (error) {
                console.error('主图上传失败:', error);
                alert('主图上传失败');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && product.slug) {
            try {
                setUploading(true);
                const newGalleries = [];

                // 获取所有已使用的索引
                const existingGalleries = product.galleries || [];
                const usedIndexes = new Set<number>();

                // 从现有的相册URL中提取索引
                existingGalleries.forEach(gallery => {
                    const match = gallery.url.match(/-(\d+)\./);
                    if (match) {
                        const index = parseInt(match[1]);
                        usedIndexes.add(index);
                    }
                });

                // 找到第一个可用的索引
                let nextAvailableIndex = 1;
                while (usedIndexes.has(nextAvailableIndex)) {
                    nextAvailableIndex++;
                }

                for (let i = 0; i < files.length; i++) {
                    const currentIndex = nextAvailableIndex + i;
                    const result = await productService.uploadGalleryImage(files[i], product.slug, currentIndex);
                    newGalleries.push({
                        url: result.url,
                        alt: `${product.title || 'product'}${product.slug ? '-' + product.slug : ''}`
                    });
                }

                updateProduct({
                    galleries: [...existingGalleries, ...newGalleries]
                });

            } catch (error) {
                console.error('图库图片上传失败:', error);
                alert('图库图片上传失败');
            } finally {
                setUploading(false);
            }
        }
    };

    const removeMainImage = () => {
        setMainImagePreview(null);
        if (mainImageInputRef.current) {
            mainImageInputRef.current.value = '';
        }
        updateProduct({ image: undefined });
    };

    const removeExistingGallery = (index: number) => {
        const updatedGalleries = product.galleries?.filter((_, i) => i !== index);
        updateProduct({
            galleries: updatedGalleries
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">产品图片管理</h3>
                <p className="text-sm text-gray-600 mt-1">上传产品主图和相册图片</p>
            </div>

            <div className="p-6 space-y-6">
                {/* 主图上传区域 */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
                            产品主图
                        </label>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            id="mainImage"
                            name="mainImage"
                            accept="image/*"
                            onChange={handleMainImageChange}
                            ref={mainImageInputRef}
                            disabled={uploading}
                        />
                    </div>

                    {uploading && (
                        <div className="flex items-center text-blue-600 text-sm">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            上传中...
                        </div>
                    )}

                    {(mainImagePreview || product.image) && (
                        <div className="relative inline-block group">
                            <img
                                id="imagePreview"
                                className="rounded-lg shadow-md border border-gray-200"
                                src={mainImagePreview || getProductImageUrl('', product.image || '')}
                                alt={product.title}
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                onClick={removeMainImage}
                                disabled={uploading}
                                title="移除主图"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

                {/* 分隔线 */}
                <div className="border-t border-gray-200"></div>

                {/* 相册图片上传区域 */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="galleryImages" className="block text-sm font-medium text-gray-700 mb-2">
                            相册图片
                        </label>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            id="galleryImages"
                            name="galleryImages"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryChange}
                            ref={galleryInputRef}
                            disabled={uploading}
                        />
                        <p className="text-xs text-gray-500 mt-1">支持多选，可一次上传多张图片</p>
                    </div>

                    {/* 相册预览 */}
                    {product.galleries && product.galleries.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">相册预览 ({product.galleries.length}张)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {product.galleries.map((gallery, index) => (
                                    <div key={gallery.id || index} className="relative group">
                                        <div className="aspect-square bg-gray-100 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                            <img
                                                src={getProductImageUrl('', gallery.url)}
                                                alt={gallery.alt || gallery.url}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-md"
                                            onClick={() => removeExistingGallery(index)}
                                            disabled={uploading}
                                            title="移除图片"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}