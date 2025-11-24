// /app/admin/products/route.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { productService } from '@/services/product-service'
import { ProductResponse, ProductListResponse } from '@/types/product'

import {
    Search,
    Plus,
    Edit,
    Settings,
    Image as ImageIcon,
    Tag,
    Star,
    Ruler,
    Info,
    ChevronLeft,
    ChevronRight,
    Package
} from 'lucide-react'
import { getProductImageUrl } from '@/lib/image-utils';

// 模拟分类数据
const categories = ['情趣内衣', '震动棒', '飞机杯', '润滑液', 'SM道具', '延时喷剂']

export default function ProductList() {
    const [products, setProducts] = useState<ProductResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        status: ''
    })
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 1,
        totalElements: 0
    })

    // 使用接口获取产品数据
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError('')

                // 调用产品服务获取数据
                const result: ProductListResponse = await productService.adminList(
                    filters.category || '', // slug参数
                    pagination.currentPage, // page
                    12 // size
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
        }

        fetchProducts()
    }, [filters, pagination.currentPage])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // 重新获取数据
        setPagination(prev => ({ ...prev, currentPage: 0 }))
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
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
                        <div className="md:col-span-4">
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
                        <div className="md:col-span-3">
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
                        <div className="md:col-span-3">
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
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <Search className="h-4 w-4 mr-1" />
                                搜索
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 产品表格 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    图片
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    供应商
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    源标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    分类
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    价格
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状态
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    创建时间
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {product.title}
                                    </td>
                                    {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                                    {/*    {product.sourceVendor || '-'}*/}
                                    {/*</td>*/}
                                    {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                                    {/*    {product.sourceTitle || '-'}*/}
                                    {/*</td>*/}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatPrice(product.currentPrice)}
                                    </td>
                                    {/*<td className="px-6 py-4 whitespace-nowrap">*/}
                                    {/*    {getStatusBadge(product.status)}*/}
                                    {/*</td>*/}
                                    {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">*/}
                                    {/*    {new Date(product.createdAt).toLocaleDateString()}*/}
                                    {/*</td>*/}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            {/* 完整编辑 */}
                                            <Link
                                                href={`/admin/product/edit/${product.id}`}
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded transition-colors"
                                                title="完整编辑"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>

                                            {/* 快速编辑下拉菜单 */}
                                            <div className="relative group">
                                                <button
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded transition-colors"
                                                    title="快速编辑"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    <div className="py-1">
                                                        <Link
                                                            href={`/admin/products/edit-basic/${product.id}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Info className="h-4 w-4 mr-2 text-blue-500" />
                                                            基本信息
                                                        </Link>
                                                        <Link
                                                            href={`/admin/products/edit-specs/${product.id}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Ruler className="h-4 w-4 mr-2 text-blue-400" />
                                                            规格信息
                                                        </Link>
                                                        <Link
                                                            href={`/admin/products/edit-images/${product.id}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <ImageIcon className="h-4 w-4 mr-2 text-yellow-500" />
                                                            产品图片
                                                        </Link>
                                                        <Link
                                                            href={`/admin/products/edit-features/${product.id}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Star className="h-4 w-4 mr-2 text-green-500" />
                                                            产品特点
                                                        </Link>
                                                        <Link
                                                            href={`/admin/products/edit-categories/${product.id}`}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            <Tag className="h-4 w-4 mr-2 text-gray-500" />
                                                            分类设置
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* 空状态 */}
                            {products.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center">
                                        <div className="text-gray-400 mb-4">
                                            <Package className="h-12 w-12 mx-auto mb-2" />
                                            <p className="text-lg">暂无产品数据</p>
                                        </div>
                                        <Link
                                            href="/admin/products/add"
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
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    第 {pagination.currentPage + 1} 页，共 {pagination.totalPages} 页，
                                    总计 {pagination.totalElements} 条记录
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        disabled={pagination.currentPage === 0}
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        className={`px-3 py-1 rounded ${
                                            pagination.currentPage === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                                        }`}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        上一页
                                    </button>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => i).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded ${
                                                page === pagination.currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                                            }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={pagination.currentPage + 1 >= pagination.totalPages}
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        className={`px-3 py-1 rounded ${
                                            pagination.currentPage + 1 >= pagination.totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
                                        }`}
                                    >
                                        下一页
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}