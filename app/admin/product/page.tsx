// /app/admin/product/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { productService } from '@/services/productService'
import { ProductResponse, ProductListResponse } from '@/types/product'
import {
    Search,
    Plus,
    Edit,
    Image as ImageIcon,
    Package,
    Eye
} from 'lucide-react'
import Pagination from '@/components/common/pagination'

import { getProductImageUrl } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';

// 模拟分类数据
const categories = ['情趣内衣', '震动棒', '飞机杯', '润滑液', 'SM道具', '延时喷剂']

export default function ProductList() {
    const searchParams = useSearchParams()
    const initialLowStock = searchParams.get('stock') === 'low'

    const [products, setProducts] = useState<ProductResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        status: '',
        lowStock: initialLowStock
    })
    const [searchFilters, setSearchFilters] = useState({
        keyword: '',
        category: '',
        status: '',
        lowStock: initialLowStock
    })
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 1,
        totalElements: 0
    })

    // 获取产品数据
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            // 转换状态值为后端需要的格式
            let statusParam = ''
            if (searchFilters.status === 'active') {
                statusParam = 'ACTIVE'
            } else if (searchFilters.status === 'inactive') {
                statusParam = 'INACTIVE'
            }

            // 调用 Service 获取数据
            const result: ProductListResponse = await productService.adminList(
                searchFilters.category || '',
                pagination.currentPage,
                12,
                searchFilters.keyword || '',
                statusParam || '',
                '',
                searchFilters.lowStock || false
            )

            setProducts(result.content || [])
            setPagination({
                currentPage: result.currentPage || 0,
                totalPages: result.totalPages || 1,
                totalElements: result.totalElements || 0
            })
        } catch (err) {
            console.error('获取产品列表失败:', err)
            setError('获取产品列表失败，请重试')
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [searchFilters, pagination.currentPage])

    // 初始加载和搜索条件变化时获取数据
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // 将当前的筛选条件设置为搜索条件，并重置页码
        setSearchFilters(filters)
        setPagination(prev => ({ ...prev, currentPage: 0 }))
    }

    // 添加重置筛选功能
    const handleResetFilters = () => {
        const resetFilters = {
            keyword: '',
            category: '',
            status: '',
            lowStock: false
        }
        setFilters(resetFilters)
        setSearchFilters(resetFilters)
        setPagination(prev => ({ ...prev, currentPage: 0 }))
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleLowStockToggle = () => {
        setFilters(prev => ({ ...prev, lowStock: !prev.lowStock }))
    }

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }))
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">上架</span>
            case 'INACTIVE':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">下架</span>
            case 'DRAFT':
                return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">草稿</span>
            default:
                return null
        }
    }

    const formatPrice = (price: number) => {
        return `¥${price.toFixed(2)}`
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            {/* 页面标题和操作 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="h-6 w-6 mr-2" />
                    产品管理
                </h1>
                <Link
                    href="/admin/product/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    新增产品
                </Link>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* 搜索和筛选 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="搜索产品名称..."
                                    value={filters.keyword}
                                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">所有分类</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">所有状态</option>
                                <option value="active">上架</option>
                                <option value="inactive">下架</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={filters.lowStock}
                                    onChange={handleLowStockToggle}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-700">仅显示库存预警</span>
                            </label>
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Search className="h-4 w-4 mr-1" />
                                搜索
                            </button>
                            {(searchFilters.keyword || searchFilters.category || searchFilters.status || searchFilters.lowStock) && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    重置
                                </button>
                            )}
                        </div>
                    </form>
                    {/* 显示当前搜索条件 */}
                    {(searchFilters.keyword || searchFilters.category || searchFilters.status || searchFilters.lowStock) && (
                        <div className="mt-3 text-sm text-gray-500">
                            当前搜索：
                            {searchFilters.keyword && <span className="ml-2">名称包含：{searchFilters.keyword}</span>}
                            {searchFilters.category && <span className="ml-2">分类：{searchFilters.category}</span>}
                            {searchFilters.status && (
                                <span className="ml-2">状态：{searchFilters.status === 'active' ? '上架' : '下架'}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 产品表格 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                    图片
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    分类
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKU信息
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    价格
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.image ? (
                                            <img
                                                src={getProductImageUrl('', product.image || '')}
                                                alt={product.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                            </div>
                                        )}
                                    </td>

                                    {/* 修改部分：标题截断处理 */}
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="max-w-xs truncate" title={product.title}>
                                            {product.title}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {product.categories?.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.productSkus && product.productSkus.length > 0 ? (
                                            <div className="space-y-1">
                                                {product.productSkus.map((sku, index) => (
                                                    <div key={sku.id} className="flex items-center gap-2 text-xs">
                                                        <span className="font-mono text-gray-600">{sku.sku}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span className="text-gray-700">{sku.color}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span className={`font-medium ${sku.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            库存: {sku.stock}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatPrice(product.currentPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {/* 查看商品 */}
                                            <Link
                                                href={`/admin/product/${product.id}`}
                                                className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded transition-colors"
                                                title="查看商品"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            {/* 完整编辑 */}
                                            <Link
                                                href={`/admin/product/edit/${product.id}`}
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-colors"
                                                title="完整编辑"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* 空状态 */}
                            {products.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="text-gray-400 mb-4">
                                            <Package className="h-12 w-12 mx-auto mb-2" />
                                            <p className="text-lg">暂无产品数据</p>
                                        </div>
                                        <Link
                                            href="/admin/product/add"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            添加第一个产品
                                        </Link>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页 */}
                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalElements={pagination.totalElements}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    )
} 
