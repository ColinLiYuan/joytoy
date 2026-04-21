'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAdminProductById } from '@/app/actions/admin/product'
import { AdminProductResponse } from '@/types/admin/adminProduct'
import { getProductImageUrl } from '@/lib/image-utils'
import {
    ArrowLeft,
    Eye,
    Star,
    Ruler,
    Package,
    Tag,
    Loader2,
    Edit,
    ExternalLink,
    DollarSign,
    Box,
    Palette,
    ListChecks
} from 'lucide-react'

export default function AdminProductDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [product, setProduct] = useState<AdminProductResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'skus'>('info')

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError('')
                const data = await getAdminProductById(id)
                console.log('[Admin Product Detail] Product data:', data)
                setProduct(data)
            } catch (err: any) {
                console.error('[Admin Product Detail] Error:', err)
                setError(err.message || '获取商品详情失败')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-gray-500 mb-4">{error || '商品不存在'}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    返回
                </button>
            </div>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">上架</span>
            case 'INACTIVE':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">下架</span>
            case 'DRAFT':
                return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">草稿</span>
            default:
                return null
        }
    }

    const formatPrice = (price?: number | null) => {
        return (price !== undefined && price !== null) ? `$${price.toFixed(2)}` : '-'
    }

    const tabs = [
        { key: 'info' as const, label: '基本信息', icon: <Eye className="h-4 w-4" /> },
        { key: 'specs' as const, label: '规格参数', icon: <Ruler className="h-4 w-4" /> },
        { key: 'skus' as const, label: 'SKU 库存', icon: <Box className="h-4 w-4" /> },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 顶部导航 */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 truncate max-w-2xl">
                                    {product.title}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-500">ID: {product.id}</span>
                                    <span className="text-sm text-gray-400">|</span>
                                    {getStatusBadge(product.status)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/admin/product/edit/${product.id}`}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                编辑商品
                            </Link>
                            <a
                                href={`/toys${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                前台查看
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Tab 切换 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 基本信息 */}
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 商品图片 */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                <h3 className="text-sm font-semibold text-gray-500 mb-3">商品图片</h3>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    {product.image ? (
                                        <Image
                                            src={getProductImageUrl('', product.image)}
                                            alt={product.title || ''}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Eye className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                {/* 附图 */}
                                {product.galleries && product.galleries.length > 0 && (
                                    <div className="mt-4 grid grid-cols-4 gap-2">
                                        {product.galleries.map((gallery, index) => (
                                            <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                                <Image
                                                    src={getProductImageUrl('', gallery.url)}
                                                    alt={gallery.alt || ''}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 基本信息详情 */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* 标题和描述 */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">基本信息</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">商品标题</span>
                                        <span className="text-sm font-medium text-gray-900">{product.title || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">品牌</span>
                                        <span className="text-sm font-medium text-gray-900">{product.brand || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Slug</span>
                                        <span className="text-sm font-mono text-gray-900">{product.slug || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">来源标题</span>
                                        <span className="text-sm font-medium text-gray-900">{product.sourceTitle || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">供应商</span>
                                        <span className="text-sm font-medium text-gray-900">{product.sourceVendor || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">徽章</span>
                                        <span className="text-sm font-medium text-gray-900">{product.badge || '-'}</span>
                                    </div>
                                </div>
                                {product.description && (
                                    <div className="mt-4">
                                        <span className="text-xs text-gray-500 block mb-1">描述</span>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* 价格信息 */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    价格与库存
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">当前售价</span>
                                        <span className="text-lg font-bold text-green-600">{formatPrice(product.currentPrice)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">原价</span>
                                        <span className="text-sm font-medium text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">采购价</span>
                                        <span className="text-sm font-medium text-gray-900">{formatPrice(product.purchasePrice)}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">总库存</span>
                                        <span className="text-lg font-bold text-gray-900">{product.stock}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">锁定库存</span>
                                        <span className="text-sm font-medium text-gray-900">{product.lockedStock}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 分类和标签 */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-purple-600" />
                                    分类与特性
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-2">分类</span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.categories && product.categories.length > 0 ? (
                                                product.categories.map((cat, index) => (
                                                    <span key={index} className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                        {cat}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-400">未设置分类</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-2">颜色</span>
                                        <div className="flex flex-wrap gap-2">
                                            {product.colors && product.colors.length > 0 ? (
                                                product.colors.map((color, index) => (
                                                    <span key={index} className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {color}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-400">未设置颜色</span>
                                            )}
                                        </div>
                                    </div>
                                    {product.features && product.features.length > 0 && (
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-2">产品特点</span>
                                            <div className="flex flex-wrap gap-2">
                                                {product.features.map((feature, index) => (
                                                    <span key={index} className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 规格参数 */}
                {activeTab === 'specs' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Ruler className="h-5 w-5 text-blue-600" />
                                规格参数
                            </h3>
                            {product.specifications && product.specifications.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.specifications.map((spec, index) => (
                                        <div key={spec.id || index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">{spec.specKey}</span>
                                            <span className="text-sm text-gray-900">{spec.specValue}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>暂无规格参数</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SKU 库存 */}
                {activeTab === 'skus' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Box className="h-5 w-5 text-blue-600" />
                                SKU 库存管理
                            </h3>
                            {product.productSkus && product.productSkus.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">颜色</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">库存</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">锁定库存</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">可用库存</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {product.productSkus.map((sku, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{sku.sku}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{sku.color}</td>
                                                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{sku.stock}</td>
                                                    <td className="px-4 py-3 text-sm text-right text-gray-500">{sku.lockedStock || 0}</td>
                                                    <td className="px-4 py-3 text-sm text-right">
                                                        <span className={`font-medium ${(sku.availableStock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {sku.availableStock || 0}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Box className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>暂无 SKU 数据</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
