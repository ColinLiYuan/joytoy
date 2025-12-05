// /app/admin/products/components/admin-product-gallery.tsx
'use client';

import { useState, useRef } from 'react';
import { productService } from '@/services/product-service';
import { getProductImageUrl } from '@/lib/image-utils';
import { resizeImageToPng } from '@/lib/utils/image-resize'; // 确保你保留了之前定义的这个工具

// 引入 dnd-kit 相关库
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Product {
    id?: number;
    image?: string;
    galleries?: Array<{ id?: number; url: string; alt?: string }>;
    title?: string;
    slug?: string;
}

interface ImageUploadProps {
    product: Product;
    updateProduct: (updates: Partial<Product>) => void;
}

// --- 子组件：可拖拽的图片项 ---
interface SortableItemProps {
    id: string;
    url: string;
    alt?: string;
    index: number;
    onRemove: (index: number) => void;
}

function SortableGalleryItem({ id, url, alt, index, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1, // 拖拽时层级提高
        opacity: isDragging ? 0.5 : 1, // 拖拽时半透明
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative group aspect-square bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-move touch-none"
        >
            <img
                src={getProductImageUrl('', url)}
                alt={alt}
                className="w-full h-full object-contain p-2 pointer-events-none" // 防止图片本身被拖拽干扰 dnd
            />

            {/* 悬停遮罩 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>

            {/* 删除按钮 - 需要阻止事件冒泡，否则点击删除会触发拖拽 */}
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()} // 关键：阻止拖拽事件
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                }}
                className="absolute top-1 right-1 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 transform hover:scale-110 cursor-pointer"
                title="删除"
            >
                ×
            </button>

            {/* 序号标签 */}
            <span className="absolute bottom-1 left-1 bg-gray-100 text-gray-500 text-[10px] px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                #{index + 1}
            </span>
        </div>
    );
}

// --- 主组件 ---
export default function AdminProductGallery({ product, updateProduct }: ImageUploadProps) {
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progressText, setProgressText] = useState('');

    const mainImageInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // 配置 dnd-kit 传感器 (鼠标和触摸)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // 移动 5px 后才开始拖拽，防止误触点击
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 处理拖拽结束
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = product.galleries?.findIndex((item) => item.url === active.id);
            const newIndex = product.galleries?.findIndex((item) => item.url === over.id);

            if (oldIndex !== undefined && newIndex !== undefined && product.galleries) {
                // 使用 dnd-kit 的 arrayMove 重新排序数组
                const newGalleries = arrayMove(product.galleries, oldIndex, newIndex);
                updateProduct({ galleries: newGalleries });
            }
        }
    };

    // 校验函数：只允许 PNG
    const validateFile = (file: File): boolean => {
        if (file.type !== 'image/png') {
            alert(`文件 "${file.name}" 格式错误。\n\n请上传 PNG 格式的图片。`);
            return false;
        }
        return true;
    };

    // 处理主图
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!product.slug) {
            alert('错误：请先在"URL设置"中生成 Slug，图片文件名依赖于它。');
            if (mainImageInputRef.current) mainImageInputRef.current.value = '';
            return;
        }

        if (file) {
            // 这里我加上了 resizeImageToPng 调用，这符合你之前的需求
            // 如果你决定不通过代码 resize，请删除这一步并恢复 validateFile
            try {
                setUploading(true);
                setProgressText('正在处理主图...');

                // 1. 处理图片 (强制 1600x1600 PNG)
                const processedFile = await resizeImageToPng(file);

                // 2. 上传
                const result = await productService.uploadMainImage(processedFile, product.slug);
                updateProduct({ image: result.url });

                // 3. 预览
                const reader = new FileReader();
                reader.onload = (e) => {
                    setMainImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(processedFile);

            } catch (error) {
                console.error('主图上传失败:', error);
                alert('主图上传失败，请重试');
            } finally {
                setUploading(false);
                setProgressText('');
                if (mainImageInputRef.current) mainImageInputRef.current.value = '';
            }
        }
    };

    // 处理相册图
    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!product.slug) {
            alert('请先设置 Slug');
            if (galleryInputRef.current) galleryInputRef.current.value = '';
            return;
        }

        if (files && files.length > 0) {
            try {
                setUploading(true);
                const newGalleries = [];
                const existingGalleries = product.galleries || [];

                // 计算起始索引
                const usedIndexes = new Set<number>();
                existingGalleries.forEach(gallery => {
                    const match = gallery.url.match(/-(\d+)\./);
                    if (match) usedIndexes.add(parseInt(match[1]));
                });

                let nextAvailableIndex = 1;
                while (usedIndexes.has(nextAvailableIndex)) {
                    nextAvailableIndex++;
                }

                // 循环上传
                for (let i = 0; i < files.length; i++) {
                    const currentIndex = nextAvailableIndex + i;
                    setProgressText(`正在上传 ${i + 1}/${files.length}...`);

                    // 1. 处理图片
                    const processedFile = await resizeImageToPng(files[i]);

                    // 2. 上传
                    const result = await productService.uploadGalleryImage(processedFile, product.slug, currentIndex);

                    newGalleries.push({
                        url: result.url,
                        alt: `${product.title || 'product'}-${product.slug}-${currentIndex}`
                    });
                }

                updateProduct({
                    galleries: [...existingGalleries, ...newGalleries]
                });

            } catch (error) {
                console.error('图库上传失败:', error);
                alert('部分图片上传失败');
            } finally {
                setUploading(false);
                setProgressText('');
                if (galleryInputRef.current) galleryInputRef.current.value = '';
            }
        }
    };

    const removeMainImage = () => {
        if (confirm('确定要移除主图吗？')) {
            setMainImagePreview(null);
            if (mainImageInputRef.current) mainImageInputRef.current.value = '';
            updateProduct({ image: undefined });
        }
    };

    const removeExistingGallery = (index: number) => {
        if (confirm('确定要删除这张相册图片吗？')) {
            const updatedGalleries = product.galleries?.filter((_, i) => i !== index);
            updateProduct({ galleries: updatedGalleries });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">图片管理</h3>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">自动优化</span>
                    <span>上传自动统一为 1600x1600 PNG。<strong>相册图片支持长按拖拽排序。</strong></span>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* 遮罩层 */}
                {uploading && (
                    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                            <span className="text-sm font-medium text-gray-700">{progressText || '正在上传...'}</span>
                        </div>
                    </div>
                )}

                {/* 主图上传区域 */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            产品主图 <span className="text-red-500">*</span>
                        </label>
                    </div>

                    <div className="flex items-start gap-6">
                        {/* 图片预览框 */}
                        <div className="relative group w-48 h-48 flex-shrink-0 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors">
                            {(mainImagePreview || product.image) ? (
                                <>
                                    <img
                                        src={mainImagePreview || getProductImageUrl('', product.image || '')}
                                        alt="Main Preview"
                                        className="w-full h-full object-contain p-2"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={removeMainImage}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            title="移除图片"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400 p-4">
                                    <svg className="mx-auto h-10 w-10 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <span className="text-xs">暂无主图</span>
                                </div>
                            )}
                        </div>

                        {/* 上传控件 */}
                        <div className="flex-1 space-y-3 pt-2">
                            <input
                                type="file"
                                id="mainImage"
                                accept="image/png, image/jpeg, image/jpg" // 恢复支持 jpg，因为我们有自动转 png
                                onChange={handleMainImageChange}
                                ref={mainImageInputRef}
                                disabled={uploading}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-all"
                            />
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>• 支持 JPG, PNG, WebP 格式上传</p>
                                <p>• 系统自动转换为 <span className="font-bold text-gray-700">1600x1600 PNG</span></p>
                                <p>• 请务必上传<span className="text-red-500">已去除背景</span>的图片</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* 相册上传区域 (带拖拽排序) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            产品相册
                        </label>
                        <span className="text-xs text-gray-500">
                            已上传 {product.galleries?.length || 0} 张 (拖拽可调整顺序)
                        </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300">
                        <input
                            type="file"
                            id="galleryImages"
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleGalleryChange}
                            ref={galleryInputRef}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition-all mb-4"
                        />

                        {/* 拖拽上下文 */}
                        {product.galleries && product.galleries.length > 0 ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={product.galleries.map(g => g.url)}
                                    strategy={rectSortingStrategy}
                                >
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                        {product.galleries.map((gallery, index) => (
                                            <SortableGalleryItem
                                                key={gallery.url} // 使用 url 作为唯一 key
                                                id={gallery.url}
                                                url={gallery.url}
                                                alt={gallery.alt}
                                                index={index}
                                                onRemove={removeExistingGallery}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                暂无相册图片，支持批量上传
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}