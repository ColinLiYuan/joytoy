// /app/admin/products/components/admin-product-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// 组件引用
import AdminProductFormHeader from './admin-product-form-header';
import SlugGenerator from './admin-product-slug-generator';
import AdminProductBasicInfo from './admin-product-basic-info';
import Specifications from './admin-product-specifications';
import Features from './admin-product-features';
import ImageUpload from './admin-product-gallery';
import AdminProductCategory from './admin-product-category';
import AdminPublishActions from './admin-publish-actions';
import ProductSkus from './admin-product-skus';

// 服务引用
import { categoryService } from '@/services/category-service';
import { productService } from '@/services/product-service';

// 类型引用
import { RootResponse } from '@/types/category';
import { AdminProductResponse, ReleaseProductRequest } from '@/types/admin/adminProduct';

// 简化的内部类型用于分类树
interface Category {
    slug: string;
    name: string;
    categoryList?: Category[];
}

export default function AdminProductForm() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    // 核心状态管理
    const [product, setProduct] = useState<AdminProductResponse>({
        id: undefined,
        slug: '',
        title: '',
        originalPrice: 0,
        currentPrice: 0,
        minOrder: '1',
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

    // 初始化加载
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
            alert('数据加载失败，请检查网络');
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
            setProduct(productData);
        } catch (error) {
            console.error('加载产品数据失败:', error);
        }
    };

    // 准备提交数据
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

            // 确保数组不为 null
            specifications: product.specifications || [],
            galleries: product.galleries || [],
            colors: product.colors || [],
            categories: product.categories || [],
            features: product.features || [],
            productSkus: product.productSkus || []
        };
    };

    // 表单逻辑校验
    const validateForm = (data: ReleaseProductRequest): string | null => {
        if (!data.title?.trim()) return "错误：产品标题不能为空";
        if (!data.slug?.trim()) return "错误：请生成产品 URL (Slug)";
        if (!data.sourceVendor?.trim()) return "错误：请选择供应商";

        if (!data.currentPrice || data.currentPrice <= 0) return "错误：当前价格必须大于 0";
        if (!data.originalPrice || data.originalPrice <= 0) return "错误：原始价格必须大于 0";

        if (!data.image) return "错误：请上传产品主图";
        // 确保 categories 存在
        if (!data.categories || data.categories.length === 0) return "错误：请至少选择一个产品分类";

        // 确保 colors 存在
        if (!data.colors || data.colors.length === 0) return "错误：请至少选择一种颜色变体";

        // SKU 校验 - 确保 productSkus 存在
        if (data.colors.length > 0) {
            if (!data.productSkus || data.productSkus.length === 0) {
                return "错误：SKU 信息未生成，请在 SKU 管理中检查";
            }

            // 检查每个颜色是否有对应的 SKU
            const missingColors = data.colors.filter(color =>
                !data.productSkus!.some(sku => sku.color === color)
            );
            if (missingColors.length > 0) {
                return `错误：以下颜色缺少 SKU 配置：${missingColors.join(', ')}`;
            }
        }

        return null; // 校验通过
    };

    // 提交处理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const submitData = prepareSubmitData();

            // 1. 执行校验
            const errorMsg = validateForm(submitData);
            if (errorMsg) {
                alert(errorMsg);
                setLoading(false);
                return;
            }

            // 2. 提交API
            // console.log('Submitting Product:', submitData);
            await productService.adminRelease(submitData);

            // 3. 成功反馈
            alert(productId ? '产品更新成功！' : '产品发布成功！');
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
                <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <span className="text-gray-600">正在加载数据，请稍候...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <AdminProductFormHeader id={productId} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="id" value={product.id} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 左侧导航栏 - 固定位置 */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">导航菜单</h3>
                            <nav className="space-y-1">
                                {navigationSections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                            activeSection === section.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <span className="mr-3">{section.icon}</span>
                                        {section.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* 中间主要内容区域 */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 基本信息 */}
                        <div className={activeSection === 'basic' ? 'block animate-fadeIn' : 'hidden'}>
                            <AdminProductBasicInfo
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* Slug URL 设置 */}
                        <div className={activeSection === 'slug' ? 'block animate-fadeIn' : 'hidden'}>
                            <SlugGenerator
                                product={product}
                                roots={roots}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 分类设置 */}
                        <div className={activeSection === 'category' ? 'block animate-fadeIn' : 'hidden'}>
                            <AdminProductCategory
                                product={product}
                                roots={roots}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 图片管理 */}
                        <div className={activeSection === 'images' ? 'block animate-fadeIn' : 'hidden'}>
                            <ImageUpload
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 产品规格 */}
                        <div className={activeSection === 'specs' ? 'block animate-fadeIn' : 'hidden'}>
                            <Specifications
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* 产品特点 */}
                        <div className={activeSection === 'features' ? 'block animate-fadeIn' : 'hidden'}>
                            <Features
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>

                        {/* SKU 管理 */}
                        <div className={activeSection === 'sku' ? 'block animate-fadeIn' : 'hidden'}>
                            <ProductSkus
                                product={product}
                                updateProduct={updateProduct}
                            />
                        </div>
                    </div>

                    {/* 右侧信息栏 (发布操作 & 状态概览) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 发布按钮组 */}
                        <div className="sticky top-6 space-y-6">
                            <AdminPublishActions
                                productId={productId}
                            />

                            {/* 状态监控卡片 */}
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                    产品概览
                                </h4>
                                <div className="space-y-3 text-xs text-gray-600">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span>当前状态:</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-full ${
                                            product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                product.status === 'INACTIVE' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {product.status === 'ACTIVE' ? '上架中' :
                                                product.status === 'INACTIVE' ? '已下架' : '草稿'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>总库存:</span>
                                        <span className="font-medium text-gray-900">{product.stock || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>当前售价:</span>
                                        <span className="font-medium text-blue-600">
                                            {product.currentPrice ? `$${product.currentPrice}` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>颜色变体:</span>
                                        <span className="font-medium text-gray-900">{product.colors?.length || 0} 个</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SKU数量:</span>
                                        <span className="font-medium text-gray-900">{product.productSkus?.length || 0} 个</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>分类关联:</span>
                                        <span className="font-medium text-gray-900">{product.categories?.length || 0} 个</span>
                                    </div>
                                </div>
                            </div>

                            {/* 提示信息 */}
                            <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 leading-relaxed border border-blue-100">
                                <i className="fas fa-info-circle mr-1"></i>
                                发布前请确保主图已上传且SKU信息完整。系统会自动处理图片尺寸。
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}