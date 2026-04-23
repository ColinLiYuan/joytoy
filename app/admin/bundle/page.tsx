// app/admin/bundle/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { bundleService } from '@/services/bundleService'
import { ProductBundle } from '@/types/bundle'
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react'

export default function AdminBundlePage() {
    const [bundles, setBundles] = useState<ProductBundle[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchBundles()
    }, [currentPage])

    const fetchBundles = async () => {
        try {
            setLoading(true)
            const data = await bundleService.adminList(currentPage, 20)
            setBundles(data.content || [])
            setTotalPages(data.totalPages || 1)
            setTotalElements(data.totalElements || 0)
        } catch (error) {
            console.error('Failed to fetch bundles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('确定要删除这个套装吗？')) return

        try {
            await bundleService.delete(id)
            alert('删除成功！')
            fetchBundles()
        } catch (error: any) {
            console.error('Delete failed:', error)
            alert('删除失败: ' + (error.message || '未知错误'))
        }
    }

    const filteredBundles = bundles.filter(bundle =>
        bundle.bundleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bundle.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">商品套装管理</h1>
                    <p className="text-sm text-gray-500 mt-1">管理礼盒、套餐等组合商品</p>
                </div>
                <Link
                    href="/admin/bundle/add"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> 新建套装
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜索套装名称或Slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Bundle List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">套装列表</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        共 {totalElements} 个套装
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">套装信息</th>
                                <th className="px-6 py-4">价格</th>
                                <th className="px-6 py-4">库存</th>
                                <th className="px-6 py-4">状态</th>
                                <th className="px-6 py-4">创建时间</th>
                                <th className="px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin h-8 w-8 text-gray-400 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredBundles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        暂无套装数据
                                    </td>
                                </tr>
                            ) : (
                                filteredBundles.map((bundle) => (
                                    <tr key={bundle.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {bundle.coverImage ? (
                                                        <img
                                                            src={bundle.coverImage}
                                                            alt={bundle.bundleName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-full h-full p-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{bundle.bundleName}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{bundle.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">${bundle.bundlePrice.toFixed(2)}</div>
                                            <div className="text-xs text-gray-400 line-through">${bundle.originalPrice.toFixed(2)}</div>
                                            <div className="text-xs text-green-600 font-medium">
                                                {bundle.discountRate > 0 ? `${(bundle.discountRate * 100).toFixed(0)}% OFF` : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{bundle.stock}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex px-2 py-1 text-[10px] font-bold rounded-full ${
                                                    bundle.isActive
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {bundle.isActive ? '已上架' : '已下架'}
                                                </span>
                                                {bundle.isFeatured && (
                                                    <span className="inline-flex px-2 py-1 text-[10px] font-bold rounded-full bg-purple-100 text-purple-700">
                                                        推荐
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(bundle.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/bundle/${bundle.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="查看详情"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/bundle/edit/${bundle.id}`}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="编辑"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(bundle.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="删除"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            第 <span className="font-medium">{currentPage + 1}</span> 页 / 共 <span className="font-medium">{totalPages}</span> 页
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
