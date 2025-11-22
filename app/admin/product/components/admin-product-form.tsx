// /app/admin/product/admin-product-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminProductFormHeader from './admin-product-form-header';
import SlugGenerator from './admin-product-slug-generator';
import AdminProductBasicInfo from './admin-product-basic-info';
import Specifications from './admin-product-specifications';
import Features from './admin-product-features';
import ImageUpload from './admin-product-gallery';
import AdminProductCategory from './admin-product-category';
import AdminPublishActions from './admin-publish-actions';
import ProductSkus from './admin-product-skus';
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';
import { RootResponse } from '@/types/category';
import { AdminProductResponse } from '@/types/admin/adminProduct'
import { ReleaseProductRequest } from '@/types/admin/adminProduct'


interface Category {
    slug: string;
    name: string;
    categoryList?: Category[];
}

export default function AdminProductForm() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<AdminProductResponse>({
        id: undefined,
        slug: '',
        title: '',
        originalPrice: 0,
        currentPrice: 0,
        minOrder: '',
        description: '',
        image: '',
        baseUrl: '',
        stock: 0,
        status: 'DRAFT',
        galleries: [],
        specifications: [],
        features: [],
        colors: [],
        categories: [],
        productSkus: []
    });
    const [roots, setRoots] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('basic');

    useEffect(() => {
        loadFormData();
    }, [productId]);

    const loadFormData = async () => {
        try {
            setLoading(true);

            const [rootsData] = await Promise.all([
                loadRoots(),
            ]);

            setRoots(rootsData);

            if (productId) {
                await loadProductData(productId);
            }
        } catch (error) {
            console.error('加载表单数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRoots = async (): Promise<Category[]> => {
        try {
            const rootsResponse: RootResponse[] = await categoryService.getRoots();
            return rootsResponse.map(root => ({
                slug: root.slug,
                name: root.name,
                categoryList: root.categories && Array.isArray(root.categories)
                    ? root.categories.map(category => ({
                        slug: category.slug || '',
                        name: category.name || ''
                    }))
                    : []
            }));
        } catch (error) {
            console.error('加载分类数据失败:', error);
            return [];
        }
    };

    const loadProductData = async (id: string) => {
        try {
            const productData = await productService.adminGetById(id);
            // console.log('loadProductData:', productData)
            setProduct(productData);
        } catch (error) {
            console.error('加载产品数据失败:', error);
        }
    };

    const prepareSubmitData = (): ReleaseProductRequest => {
        return {
            id: product.id,
            badge: product.badge,
            brand: product.brand,
            image: product.image,
            alt: product.alt || product.title,
            slug: product.slug,
            sourceTitle: product.sourceTitle,
            sourceVendor: product.sourceVendor,
            title: product.title,
            description: product.description,
            stock: product.stock || 0,
            purchasePrice: product.purchasePrice,
            currentPrice: product.currentPrice,
            originalPrice: product.originalPrice,
            minOrder: product.minOrder?.toString(),
            status: product.status,

            specifications: product.specifications || [],
            galleries: product.galleries || [],
            colors: product.colors || [],
            categories: product.categories || [],
            features: product.features || [],
            productSkus: product.productSkus || []
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const submitData = prepareSubmitData();

            // 验证SKU数据
            if (submitData.colors && submitData.colors.length > 0) {
                if (!submitData.productSkus || submitData.productSkus.length === 0) {
                    alert('请先配置SKU信息');
                    return;
                }

                // 检查每个颜色是否都有对应的SKU
                const missingColors = submitData.colors.filter(color =>
                    !submitData.productSkus!.some(sku => sku.color === color)
                );

                if (missingColors.length > 0) {
                    alert(`以下颜色缺少SKU配置：${missingColors.join(', ')}`);
                    return;
                }
            }

            console.log('product release handleSubmit: ', submitData)
            const result = await productService.adminRelease(submitData);

            // 成功后跳转到产品列表
            router.push('/admin/product');

        } catch (error) {
            console.error('提交产品数据失败:', error);
            alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = (updates: Partial<ReleaseProductRequest>) => {
        setProduct(prev => ({ ...prev, ...updates }));
    };

    const navigationSections = [
        { id: 'basic', label: '基本信息', icon: '📝' },
        { id: 'slug', label: 'URL设置', icon: '🔗' },
        { id: 'category', label: '分类设置', icon: '📂' },
        { id: 'images', label: '图片管理', icon: '🖼️' },
        { id: 'specs', label: '产品规格', icon: '📊' },
        { id: 'features', label: '产品特点', icon: '⭐' },
        { id: 'sku', label: 'SKU管理', icon: '🏷️' }
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">加载中...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <AdminProductFormHeader id={productId} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={product.id} />
                <input type="hidden" name="lockedStock" value={product.lockedStock} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 左侧导航 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">导航菜单</h3>
                            <nav className="space-y-1">
                                {navigationSections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <span className="mr-2">{section.icon}</span>
                                        {section.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* 主要内容区域 - 从 7 列增加到 8 列 */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 基本信息 */}
                        <div className={activeSection === 'basic' ? 'block' : 'hidden'}>
                            <AdminProductBasicInfo
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* Slug设置 */}
                        <div className={activeSection === 'slug' ? 'block' : 'hidden'}>
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="px-6 py-4 border-b">
                                    <h3 className="text-lg font-semibold">Slug设置</h3>
                                </div>
                                <div className="p-6">
                                    <SlugGenerator
                                        product={product}
                                        roots={roots}
                                        updateProduct={updateProduct}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 图片管理 - 移到主要内容区域 */}
                        <div className={activeSection === 'images' ? 'block' : 'hidden'}>
                            <ImageUpload
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 产品规格 */}
                        <div className={activeSection === 'specs' ? 'block' : 'hidden'}>
                            <Specifications
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 产品特点 */}
                        <div className={activeSection === 'features' ? 'block' : 'hidden'}>
                            <Features
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 分类设置 - 也移到主要内容区域 */}
                        <div className={activeSection === 'category' ? 'block' : 'hidden'}>
                            <AdminProductCategory
                                product={product}
                                roots={roots}
                                updateProduct={updateProduct}
                            />
                        </div>

                        <div className={activeSection === 'sku' ? 'block' : 'hidden'}>
                            <ProductSkus
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>
                    </div>

                    {/* 右侧侧边栏 - 从 3 列减少到 2 列 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 发布操作 */}
                        <AdminPublishActions
                            productId={productId}
                        />

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">产品状态</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">状态:</span>
                                    <span className={`font-medium ${
                                        product.status === 'ACTIVE' ? 'text-green-600' :
                                            product.status === 'INACTIVE' ? 'text-red-600' : 'text-yellow-600'
                                    }`}>
                {product.status === 'ACTIVE' ? '上架' :
                    product.status === 'INACTIVE' ? '下架' : '草稿'}
            </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">总库存:</span>
                                    <span className="font-medium">{product.stock || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">颜色变体:</span>
                                    <span className="font-medium">{product.colors?.length || 0}个</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">有库存:</span>
                                    <span className="font-medium text-green-600">
                {product.productSkus?.filter((sku: any) => (sku.stock || 0) > 0).length || 0}个
            </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">缺货:</span>
                                    <span className="font-medium text-red-600">
                {product.productSkus?.filter((sku: any) => (sku.stock || 0) === 0).length || 0}个
            </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">价格:</span>
                                    <span className="font-medium">¥{product.currentPrice || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">分类:</span>
                                    <span className="font-medium">{product.categories?.length || 0}个</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}