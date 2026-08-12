// app/admin/bundle/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { bundleService } from '@/services/bundleService'
import { ProductBundle } from '@/types/bundle'
import { getProductImageUrl } from '@/lib/image-utils'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { usePermission } from '@/hooks/usePermission'

export default function AdminBundleList() {
    const [bundles, setBundles] = useState<ProductBundle[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const { canEdit } = usePermission()

    useEffect(() => {
        loadBundles()
    }, [page])

    const loadBundles = async () => {
        try {
            setLoading(true)
            const data = await bundleService.adminList(page, 20)
            setBundles(data.content || [])
            setTotalPages(data.totalPages || 0)
        } catch (error) {
            console.error('Failed to load bundles:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('确定要删除这个套装吗？')) return

        try {
            await bundleService.delete(id)
            alert('删除成功')
            loadBundles()
        } catch (error) {
            console.error('Failed to delete bundle:', error)
            alert('删除失败')
        }
    }

    if (loading) {
        return (
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 页面标题 */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">套装管理</h1>
                    {canEdit && (
                        <Link
                            href="/admin/bundle/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            新建套装
                        </Link>
                    )}
                </div>

                {/* 套装列表 */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {bundles.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无套装</h3>
                            <p className="mt-1 text-sm text-gray-500">点击上方按钮创建第一个套装</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {bundles.map((bundle) => (
                                <li key={bundle.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {/* 套装主图 */}
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                {bundle.coverImage ? (
                                                    <img
                                                        src={getProductImageUrl('', bundle.coverImage)}
                                                        alt={bundle.bundleName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* 套装信息 */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center">
                                                    <h2 className="text-sm font-medium text-gray-900 truncate">
                                                        {bundle.bundleName}
                                                    </h2>
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {bundle.items?.length || 0} 件商品
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 truncate">
                                                    Slug: {bundle.slug}
                                                </p>
                                                {bundle.subtitle && (
                                                    <p className="mt-1 text-sm text-gray-400 truncate">
                                                        {bundle.subtitle}
                                                    </p>
                                                )}
                                            </div>

                                            {/* 价格信息 */}
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    ¥{bundle.bundlePrice?.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-500 line-through">
                                                    ¥{bundle.originalPrice?.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-green-600">
                                                    省 ¥{(bundle.originalPrice - bundle.bundlePrice).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 操作按钮 */}
                                        {canEdit && (
                                            <div className="flex items-center space-x-2 ml-4">
                                                <Link
                                                    href={`/admin/bundle/edit/${bundle.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    编辑
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(bundle.id!)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    删除
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    上一页
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    下一页
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        第 <span className="font-medium">{page + 1}</span> 页，共{' '}
                                        <span className="font-medium">{totalPages}</span> 页
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => setPage(p => Math.max(0, p - 1))}
                                            disabled={page === 0}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            上一页
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                            disabled={page >= totalPages - 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            下一页
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
