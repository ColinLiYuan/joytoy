'use client'

import { useState, useEffect } from 'react'
import { cartService } from '@/services/cartService'
import { getProductImageUrl } from '@/lib/image-utils'
import {
    Search,
    Filter,
    Clock,
    TrendingUp,
    ShoppingCart,
    Trash2,
    Package,
    Loader2,
    ChevronLeft,
    ChevronRight,
    X,
    Eye
} from 'lucide-react'

// 购物车操作日志类型
interface CartOperationLog {
    id: number;
    cartId: number;
    sessionId: string;
    userId: number | null;
    userEmail: string | null;
    userName: string;
    isGuest: boolean;
    operationType: string; // ADD_ITEM, UPDATE_QUANTITY, REMOVE_ITEM, CLEAR_CART, ABANDON_CART, CREATE_CART
    operationDesc: string;
    productId: number | null;
    productTitle: string | null;
    productSku: string | null;
    skuId: number | null;
    quantity: number | null;
    unitPrice: number | null;
    totalPrice: number | null;
    cartTotalItems: number;
    cartTotalAmount: number;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
}

// 操作日志统计类型
interface CartOperationStatistics {
    totalOperations: number;
    todayOperations: number;
    addOperations: number;
    updateOperations: number;
    removeOperations: number;
    clearOperations: number;
    abandonOperations: number;
    avgOperationsPerCart: number;
}

// 操作类型映射（字典翻译）
const operationTypeMap: Record<string, { label: string; color: string; icon: any; description?: string }> = {
    'CREATE_CART': { 
        label: '创建购物车', 
        color: 'bg-blue-100 text-blue-800', 
        icon: ShoppingCart,
        description: '用户首次添加商品到购物车时自动创建' 
    },
    'ITEM_ADD': { 
        label: '添加商品', 
        color: 'bg-green-100 text-green-800', 
        icon: Package,
        description: '向购物车中添加新的商品' 
    },
    'ADD_ITEM': { 
        label: '添加商品', 
        color: 'bg-green-100 text-green-800', 
        icon: Package,
        description: '向购物车中添加新的商品' 
    },
    'ITEM_UPDATE': { 
        label: '修改数量', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: TrendingUp,
        description: '修改购物车中商品的数量' 
    },
    'UPDATE_QUANTITY': { 
        label: '修改数量', 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: TrendingUp,
        description: '修改购物车中商品的数量' 
    },
    'ITEM_REMOVE': { 
        label: '删除商品', 
        color: 'bg-red-100 text-red-800', 
        icon: Trash2,
        description: '从购物车中移除某个商品' 
    },
    'REMOVE_ITEM': { 
        label: '删除商品', 
        color: 'bg-red-100 text-red-800', 
        icon: Trash2,
        description: '从购物车中移除某个商品' 
    },
    'CART_CLEAR': { 
        label: '清空购物车', 
        color: 'bg-orange-100 text-orange-800', 
        icon: Trash2,
        description: '清空购物车中的所有商品' 
    },
    'CLEAR_CART': { 
        label: '清空购物车', 
        color: 'bg-orange-100 text-orange-800', 
        icon: Trash2,
        description: '清空购物车中的所有商品' 
    },
    'CART_ABANDON': { 
        label: '废弃购物车', 
        color: 'bg-gray-100 text-gray-800', 
        icon: X,
        description: '购物车被标记为废弃状态（长时间未操作或结账失败）' 
    },
    'ABANDON_CART': { 
        label: '废弃购物车', 
        color: 'bg-gray-100 text-gray-800', 
        icon: X,
        description: '购物车被标记为废弃状态（长时间未操作或结账失败）' 
    }
}

// 用户类型映射
const userTypeMap: Record<string, { label: string; color: string }> = {
    'GUEST': { 
        label: '游客', 
        color: 'bg-gray-100 text-gray-700' 
    },
    'REGISTERED': { 
        label: '注册用户', 
        color: 'bg-purple-100 text-purple-700' 
    }
}

export default function CartOperationLogsPage() {
    const [logs, setLogs] = useState<CartOperationLog[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [statistics, setStatistics] = useState<CartOperationStatistics | null>(null)
    
    // 筛选条件
    const [searchQuery, setSearchQuery] = useState('')
    const [operationType, setOperationType] = useState<string>('ALL')
    const [isGuestFilter, setIsGuestFilter] = useState<boolean | undefined>(undefined)
    const [dateRange, setDateRange] = useState<string>('')
    
    // 详情弹窗
    const [selectedLog, setSelectedLog] = useState<CartOperationLog | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const operationTypes = ['ALL', 'CREATE_CART', 'ADD_ITEM', 'UPDATE_QUANTITY', 'REMOVE_ITEM', 'CLEAR_CART', 'ABANDON_CART']

    // 加载统计数据
    useEffect(() => {
        loadStatistics()
    }, [])

    // 加载日志列表
    useEffect(() => {
        loadLogs()
    }, [page, operationType, isGuestFilter])

    const loadStatistics = async () => {
        try {
            const stats = await cartService.getCartOperationStatistics()
            setStatistics(stats)
        } catch (error) {
            console.error('加载统计数据失败:', error)
        }
    }

    const loadLogs = async () => {
        setLoading(true)
        try {
            const result = await cartService.getCartOperationLogs({
                page,
                size: 20,
                operationType: operationType === 'ALL' ? '' : operationType,
                isGuest: isGuestFilter,
                search: searchQuery
            })
            setLogs(result.content)
            setTotalPages(result.totalPages)
            setTotalElements(result.totalElements)
        } catch (error) {
            console.error('加载日志失败:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = () => {
        setPage(0)
        loadLogs()
    }

    const resetFilters = () => {
        setSearchQuery('')
        setOperationType('ALL')
        setIsGuestFilter(undefined)
        setDateRange('')
        setPage(0)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 页面标题 */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">购物车操作日志</h1>
                    <p className="mt-2 text-sm text-gray-600">查看和分析所有购物车操作记录</p>
                </div>

                {/* 统计卡片 */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">总操作数</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.totalOperations}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">今日操作</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{statistics.todayOperations}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">添加商品</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.addOperations}</p>
                                </div>
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">平均每购物车</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-2">{statistics.avgOperationsPerCart}</p>
                                </div>
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 筛选器 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-900">筛选条件</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 搜索框 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">搜索</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="用户名、邮箱、SessionId..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>

                        {/* 操作类型 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">操作类型</label>
                            <select
                                value={operationType}
                                onChange={(e) => setOperationType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {operationTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type === 'ALL' ? '全部类型' : operationTypeMap[type]?.label || type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 用户类型 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">用户类型</label>
                            <select
                                value={isGuestFilter === undefined ? 'ALL' : isGuestFilter ? 'GUEST' : 'REGISTERED'}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setIsGuestFilter(value === 'ALL' ? undefined : value === 'GUEST')
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="ALL">全部用户</option>
                                <option value="GUEST">游客</option>
                                <option value="REGISTERED">注册用户</option>
                            </select>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                查询
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                重置
                            </button>
                        </div>
                    </div>
                </div>

                {/* 日志列表 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* 表格头部 */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                                操作日志列表
                                {totalElements > 0 && (
                                    <span className="ml-2 text-xs font-normal text-gray-500">
                                        (共 {totalElements} 条记录)
                                    </span>
                                )}
                            </h3>
                        </div>
                    </div>

                    {/* 表格内容 */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <Clock className="h-12 w-12 mb-4" />
                            <p className="text-lg font-medium">暂无操作日志</p>
                            <p className="text-sm mt-2">尝试调整筛选条件</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作时间</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作类型</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">用户</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">商品信息</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作详情</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">购物车状态</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log) => {
                                            const operationConfig = operationTypeMap[log.operationType] || { label: log.operationType, color: 'bg-gray-100 text-gray-800', icon: Clock }
                                            const OperationIcon = operationConfig.icon

                                            return (
                                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(log.createdAt).toLocaleString('zh-CN', {
                                                                year: 'numeric',
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${operationConfig.color}`}>
                                                            <OperationIcon className="h-3 w-3" />
                                                            {operationConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm">
                                                            <div className="font-medium text-gray-900">{log.userName}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {log.isGuest ? userTypeMap['GUEST'].label : (log.userEmail || userTypeMap['REGISTERED'].label)}
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-mono mt-1">
                                                                {log.sessionId?.substring(0, 12)}...
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {log.productId ? (
                                                            <div className="text-sm">
                                                                <div className="font-medium text-gray-900">{log.productTitle || '商品'}</div>
                                                                <div className="text-xs text-gray-500">SKU: {log.productSku}</div>
                                                                {log.quantity && (
                                                                    <div className="text-xs text-gray-500">数量: {log.quantity}</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-600 max-w-xs">
                                                            {log.operationDesc || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm">
                                                            <div className="text-gray-900">
                                                                {log.cartTotalItems || 0} 件商品
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                ${log.cartTotalAmount?.toFixed(2) || '0.00'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLog(log)
                                                                setIsDetailModalOpen(true)
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="查看详情"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* 分页 */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        第 <span className="font-medium">{page + 1}</span> 页 / 共 <span className="font-medium">{totalPages}</span> 页
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            disabled={page === 0}
                                            onClick={() => setPage(prev => prev - 1)}
                                            className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            disabled={page >= totalPages - 1}
                                            onClick={() => setPage(prev => prev + 1)}
                                            className="p-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* 详情弹窗 */}
            {isDetailModalOpen && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsDetailModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                        {/* 弹窗头部 */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">操作日志详情</h3>
                                    <p className="text-sm text-gray-500">日志 ID: #{selectedLog.id}</p>
                                </div>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* 弹窗内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* 基本信息 */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">基本信息</h4>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">操作时间</p>
                                        <p className="text-sm font-medium">
                                            {new Date(selectedLog.createdAt).toLocaleString('zh-CN')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">操作类型</p>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${operationTypeMap[selectedLog.operationType]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {operationTypeMap[selectedLog.operationType]?.label || selectedLog.operationType}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">用户</p>
                                        <p className="text-sm font-medium">{selectedLog.userName}</p>
                                        <p className="text-xs text-gray-500">{selectedLog.userEmail || (selectedLog.isGuest ? userTypeMap['GUEST'].label : userTypeMap['REGISTERED'].label)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Session ID</p>
                                        <p className="text-sm font-mono text-gray-600">{selectedLog.sessionId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 商品信息 */}
                            {selectedLog.productId && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">商品信息</h4>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                                <Package className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{selectedLog.productTitle}</p>
                                                <p className="text-xs text-gray-500 mt-1">SKU: {selectedLog.productSku}</p>
                                                {selectedLog.quantity && (
                                                    <p className="text-xs text-gray-500">数量: {selectedLog.quantity}</p>
                                                )}
                                                {selectedLog.unitPrice && (
                                                    <p className="text-xs text-gray-500">单价: ${selectedLog.unitPrice.toFixed(2)}</p>
                                                )}
                                                {selectedLog.totalPrice && (
                                                    <p className="text-xs text-gray-500">总价: ${selectedLog.totalPrice.toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 操作描述 */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">操作描述</h4>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">{selectedLog.operationDesc}</p>
                                </div>
                            </div>

                            {/* 购物车状态 */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">购物车状态（操作后）</h4>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">购物车 ID</p>
                                        <p className="text-sm font-medium">#{selectedLog.cartId}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">商品总数</p>
                                        <p className="text-sm font-medium">{selectedLog.cartTotalItems} 件</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">总金额</p>
                                        <p className="text-sm font-medium">${selectedLog.cartTotalAmount?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 其他信息 */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">其他信息</h4>
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500">IP 地址</p>
                                        <p className="text-sm font-medium">{selectedLog.ip || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">用户代理</p>
                                        <p className="text-sm font-medium">{selectedLog.userAgent ? selectedLog.userAgent.substring(0, 50) + '...' : '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export const dynamic = 'force-dynamic'
