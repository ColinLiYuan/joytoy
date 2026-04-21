'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    getAdminCartList,
    getAdminCartDetail,
    getAdminCartStatistics,
    clearAdminCart,
    abandonAdminCart,
    cleanupExpiredAdminCarts,
    CartResponse,
    CartItem,
    CartStatistics
} from '@/app/actions/admin/cart'
import { getProductImageUrl } from '@/lib/image-utils'
import {
    Search,
    Eye,
    Trash2,
    Minus,
    Plus,
    Package,
    Loader2,
    ChevronLeft,
    ChevronRight,
    X,
    AlertCircle,
    TrendingUp,
    ShoppingCart
} from 'lucide-react'

const statusMap: Record<string, { label: string; color: string }> = {
    'ACTIVE': { label: '活跃中', color: 'bg-green-100 text-green-800 border-green-200' },
    'ABANDONED': { label: '已废弃', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    'CONVERTED': { label: '已转换', color: 'bg-blue-100 text-blue-800 border-blue-200' }
};

export default function AdminCartPage() {
    const [carts, setCarts] = useState<CartResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeStatus, setActiveStatus] = useState<string>('ALL')
    const [statistics, setStatistics] = useState<CartStatistics | null>(null)
    
    // 详情弹窗
    const [selectedCart, setSelectedCart] = useState<CartResponse | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)
    
    const statuses = ['ALL', 'ACTIVE', 'CONVERTED', 'ABANDONED']

    // 获取购物车列表
    const fetchCarts = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAdminCartList({
                page,
                size: 10,
                status: activeStatus === 'ALL' ? undefined : activeStatus,
            })
            setCarts(data.content)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Fetch carts failed:', error)
        } finally {
            setLoading(false)
        }
    }, [page, activeStatus])

    // 获取统计数据
    const fetchStatistics = useCallback(async () => {
        try {
            const stats = await getAdminCartStatistics()
            setStatistics(stats)
        } catch (error) {
            console.error('Fetch statistics failed:', error)
        }
    }, [])

    useEffect(() => {
        fetchCarts()
        fetchStatistics()
    }, [fetchCarts, fetchStatistics])

    // 查看购物车详情
    const handleViewDetail = async (cartId: number) => {
        setDetailLoading(true)
        setIsDetailModalOpen(true)
        try {
            const cart = await getAdminCartDetail(cartId)
            console.log('[Client] Cart detail received:', {
                status: cart.status,
                itemsCount: cart.items?.length,
                firstItem: cart.items?.[0] ? {
                    productImage: cart.items[0].productImage,
                    processedImage: getProductImageUrl(undefined, cart.items[0].productImage)
                } : null
            })
            setSelectedCart(cart)
        } catch (error) {
            console.error('Fetch cart detail failed:', error)
            setIsDetailModalOpen(false)
        } finally {
            setDetailLoading(false)
        }
    }

    // 清空购物车
    const handleClearCart = async (cartId: number) => {
        if (!window.confirm('确定要清空此购物车的所有商品吗？')) return
        try {
            await clearAdminCart(cartId)
            fetchCarts()
            if (selectedCart?.id === cartId) setIsDetailModalOpen(false)
        } catch (error: any) {
            alert('操作失败: ' + (error.message || '未知错误'))
        }
    }

    // 废弃购物车
    const handleAbandonCart = async (cartId: number) => {
        if (!window.confirm('确定要将此购物车标记为已废弃吗？')) return
        try {
            await abandonAdminCart(cartId)
            fetchCarts()
            if (selectedCart?.id === cartId) setIsDetailModalOpen(false)
        } catch (error: any) {
            alert('操作失败: ' + (error.message || '未知错误'))
        }
    }

    // 清理过期购物车
    const handleCleanupExpired = async () => {
        if (!window.confirm('确定要清理所有过期的购物车吗？')) return
        try {
            const result = await cleanupExpiredAdminCarts()
            alert(result.message)
            fetchCarts()
            fetchStatistics()
        } catch (error: any) {
            alert('操作失败: ' + (error.message || '未知错误'))
        }
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">购物车管理</h1>
                    <button
                        onClick={handleCleanupExpired}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        清理过期购物车
                    </button>
                </div>

                {/* 统计卡片 */}
                {statistics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">总购物车数</p>
                                    <p className="text-xl font-bold text-gray-900">{statistics.totalCarts}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">活跃购物车</p>
                                    <p className="text-xl font-bold text-gray-900">{statistics.activeCarts}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Package className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">总商品数</p>
                                    <p className="text-xl font-bold text-gray-900">{statistics.totalItems}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">平均商品数/购物车</p>
                                    <p className="text-xl font-bold text-gray-900">{statistics.avgItemsPerCart}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 筛选与搜索 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => { setActiveStatus(status); setPage(0); }}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeStatus === status
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {status === 'ALL' ? '全部购物车' : statusMap[status]?.label || status}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="输入用户邮箱或购物车Token搜索..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 购物车列表 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">购物车ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">用户</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">商品数/数量</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">总金额</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">状态</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">管理操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray-400">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    正在加载购物车数据...
                                </td>
                            </tr>
                        ) : carts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray-400">
                                    暂无购物车数据
                                </td>
                            </tr>
                        ) : carts.map((cart) => (
                            <tr key={cart.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-sm font-bold text-gray-900">#{cart.id}</div>
                                    <div className="text-xs text-gray-400 mt-1">Token: {cart.cartToken?.substring(0, 12)}...</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{cart.userName}</div>
                                    <div className="text-xs text-gray-500">{cart.userEmail || 'Guest'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">{cart.itemCount} 件商品</div>
                                    <div className="text-xs text-gray-400">总数量: {cart.totalItems}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900">${cart.totalAmount.toFixed(2)}</div>
                                    <div className="text-xs text-gray-400">{cart.currency}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusMap[cart.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                        {statusMap[cart.status]?.label || cart.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => handleViewDetail(cart.id)}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                            title="查看详情"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        {cart.status === 'ACTIVE' && (
                                            <>
                                                <button
                                                    onClick={() => handleClearCart(cart.id)}
                                                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                                    title="清空购物车"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAbandonCart(cart.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="废弃购物车"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 分页控制 */}
                    {!loading && totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                第 <span className="font-medium">{page + 1}</span> 页 / 共 <span className="font-medium">{totalPages}</span> 页
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(prev => prev - 1)}
                                    className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 详情模态框 */}
            {isDetailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsDetailModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">购物车详情</h3>
                                    <p className="text-sm text-gray-500">购物车ID: #{selectedCart?.id}</p>
                                </div>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            {detailLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : selectedCart ? (
                                <>
                                    {/* 购物车信息 */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-gray-500">用户</p>
                                            <p className="text-sm font-medium">{selectedCart.userName}</p>
                                            <p className="text-xs text-gray-500">{selectedCart.userEmail || 'Guest'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">状态</p>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusMap[selectedCart.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {statusMap[selectedCart.status]?.label || selectedCart.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">创建时间</p>
                                            <p className="text-sm">{new Date(selectedCart.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">总金额</p>
                                            <p className="text-lg font-bold text-gray-900">${selectedCart.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* 商品列表 */}
                                    <h4 className="font-bold text-gray-900 mb-4">商品列表 ({selectedCart.items?.length || 0})</h4>
                                    {selectedCart.items && selectedCart.items.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedCart.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                        {item.productImage ? (
                                                            <img 
                                                                src={getProductImageUrl(undefined, item.productImage)} 
                                                                alt={item.productTitle} 
                                                                className="w-full h-full object-cover" 
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/images/placeholder.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{item.productTitle}</p>
                                                        <p className="text-xs text-gray-500">SKU: {item.productSku}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">${item.unitPrice.toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500">数量: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">${item.totalPrice.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <Package className="h-12 w-12 mx-auto mb-2" />
                                            <p>购物车为空</p>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export const dynamic = 'force-dynamic'
