'use client'

import { useState, useEffect } from 'react'
import { cartService, CartOperationLog, CartOperationStatistics } from '@/services/cartService'
import { getProductImageUrl } from '@/lib/image-utils'
import {
    Search, Filter, Clock, TrendingUp, ShoppingCart,
    Trash2, Package, Loader2, ChevronLeft, ChevronRight, ChevronDown,
    Plus, Minus, RotateCcw, User, Monitor, MapPin, Tag, Hash
} from 'lucide-react'

const ITEMS_PER_PAGE = 20

const typeConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
    CART_CREATE:   { label: '创建购物车', color: 'bg-blue-100 text-blue-700',   icon: ShoppingCart },
    ITEM_ADD:      { label: '添加商品',   color: 'bg-green-100 text-green-700',   icon: Plus },
    ITEM_UPDATE:   { label: '修改数量',   color: 'bg-amber-100 text-amber-700',   icon: TrendingUp },
    ITEM_REMOVE:   { label: '删除商品',   color: 'bg-red-100 text-red-700',       icon: Minus },
    CART_CLEAR:    { label: '清空购物车', color: 'bg-orange-100 text-orange-700', icon: Trash2 },
    CART_ABANDON:  { label: '废弃购物车', color: 'bg-gray-200 text-gray-700',    icon: RotateCcw },
    CART_MERGE:    { label: '合并购物车', color: 'bg-purple-100 text-purple-700', icon: ShoppingCart },
    CART_EXPIRE:   { label: '购物车过期', color: 'bg-red-100 text-red-700',       icon: Clock },
}

const operationTypes = ['ALL', 'CART_CREATE', 'ITEM_ADD', 'ITEM_UPDATE', 'ITEM_REMOVE', 'CART_CLEAR', 'CART_ABANDON', 'CART_MERGE', 'CART_EXPIRE']

function formatTime(iso: string) {
    return new Date(iso).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function formatFullTime(iso: string) {
    return new Date(iso).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function CartOperationLogsPage() {
    const [logs, setLogs] = useState<CartOperationLog[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [stats, setStats] = useState<CartOperationStatistics | null>(null)
    const [expandedId, setExpandedId] = useState<number | null>(null)

    // filters
    const [searchText, setSearchText] = useState('')
    const [opType, setOpType] = useState('ALL')
    const [userType, setUserType] = useState<'ALL' | 'GUEST' | 'REGISTERED'>('ALL')

    useEffect(() => { loadStats() }, [])
    useEffect(() => { loadLogs() }, [page, opType, userType])

    const loadStats = async () => {
        try { setStats(await cartService.getCartOperationStatistics()) } catch { /* ignore */ }
    }

    const loadLogs = async () => {
        setLoading(true)
        try {
            const result = await cartService.getCartOperationLogs({
                page, size: ITEMS_PER_PAGE,
                operationType: opType === 'ALL' ? '' : opType,
                isGuest: userType === 'ALL' ? undefined : userType === 'GUEST',
                search: searchText,
            })
            setLogs(result.content)
            setTotalPages(result.totalPages)
            setTotalElements(result.totalElements)
        } catch { /* ignore */ } finally { setLoading(false) }
    }

    const doSearch = () => { setPage(0); loadLogs() }
    const resetFilters = () => { setSearchText(''); setOpType('ALL'); setUserType('ALL'); setPage(0) }

    const StatCard = ({ label, value, color, Icon }: { label: string; value: number | string; color: string; Icon: typeof Package }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900">购物车操作日志</h1>
                </div>

                {/* ====== Stats ====== */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                        <StatCard label="总操作数" value={stats.totalOperations} color="text-gray-900" Icon={Hash} />
                        <StatCard label="今日操作" value={stats.todayOperations} color="text-green-600" Icon={TrendingUp} />
                        <StatCard label="创建购物车" value={stats.createOperations} color="text-blue-600" Icon={ShoppingCart} />
                        <StatCard label="添加商品" value={stats.addOperations} color="text-emerald-600" Icon={Plus} />
                        <StatCard label="删除商品" value={stats.removeOperations} color="text-red-600" Icon={Minus} />
                        <StatCard label="加购转化率" value={`${stats.addToCartConversionRate}%`} color="text-purple-600" Icon={TrendingUp} />
                    </div>
                )}

                {/* ====== Top products + period stats ====== */}
                {stats && (stats.topAddedProducts.length > 0 || stats.last7Days) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {stats.topAddedProducts.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">热门添加 Top {stats.topAddedProducts.length}</h4>
                                <div className="space-y-2">
                                    {stats.topAddedProducts.map((p, i) => (
                                        <div key={p.productId} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 truncate flex-1">
                                                <span className="text-gray-400 mr-1">#{i + 1}</span>
                                                {p.productName || p.productTitle || `ID:${p.productId}`}
                                            </span>
                                            <span className="text-gray-500 ml-2 whitespace-nowrap">{p.count}次</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {stats.topRemovedProducts.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">热门删除 Top {stats.topRemovedProducts.length}</h4>
                                <div className="space-y-2">
                                    {stats.topRemovedProducts.map((p, i) => (
                                        <div key={p.productId} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 truncate flex-1">
                                                <span className="text-gray-400 mr-1">#{i + 1}</span>
                                                {p.productName || p.productTitle || `ID:${p.productId}`}
                                            </span>
                                            <span className="text-gray-500 ml-2 whitespace-nowrap">{p.count}次</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">近期趋势</h4>
                            <div className="space-y-3 text-xs">
                                {stats.last7Days && (
                                    <div>
                                        <p className="text-gray-400 mb-1">近 7 天</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            <span className="text-gray-600">添加: {stats.last7Days.itemsAdded}</span>
                                            <span className="text-gray-600">删除: {stats.last7Days.itemsRemoved}</span>
                                            <span className="text-gray-600">创建: {stats.last7Days.cartsCreated}</span>
                                            <span className="text-gray-600">废弃: {stats.last7Days.cartsAbandoned}</span>
                                        </div>
                                    </div>
                                )}
                                {stats.last30Days && (
                                    <div>
                                        <p className="text-gray-400 mb-1">近 30 天</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            <span className="text-gray-600">添加: {stats.last30Days.itemsAdded}</span>
                                            <span className="text-gray-600">删除: {stats.last30Days.itemsRemoved}</span>
                                            <span className="text-gray-600">创建: {stats.last30Days.cartsCreated}</span>
                                            <span className="text-gray-600">废弃: {stats.last30Days.cartsAbandoned}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== Filters ====== */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-gray-500 mb-1">搜索</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                <input
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && doSearch()}
                                    placeholder="用户名 / 邮箱 ..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">操作类型</label>
                            <select value={opType} onChange={e => { setOpType(e.target.value); setPage(0) }}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
                                {operationTypes.map(t => (
                                    <option key={t} value={t}>{t === 'ALL' ? '全部类型' : typeConfig[t]?.label || t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">用户类型</label>
                            <select value={userType} onChange={e => { setUserType(e.target.value as typeof userType); setPage(0) }}
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
                                <option value="ALL">全部</option>
                                <option value="GUEST">游客</option>
                                <option value="REGISTERED">注册用户</option>
                            </select>
                        </div>
                        <button onClick={doSearch} className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">查询</button>
                        <button onClick={resetFilters} className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50">重置</button>
                    </div>
                </div>

                {/* ====== Table ====== */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
                    ) : logs.length === 0 ? (
                        <div className="flex flex-col items-center py-20 text-gray-400">
                            <Clock className="h-10 w-10 mb-3" />
                            <p className="text-sm">暂无操作日志</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 w-[140px]">时间</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 w-[170px]">用户</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 w-[110px]">操作</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">商品 / 详情</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 w-[110px]">购物车状态</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 w-[50px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {logs.map(log => {
                                            const cfg = typeConfig[log.operationType] || { label: log.operationType, color: 'bg-gray-100 text-gray-600', icon: Clock }
                                            const Icon = cfg.icon
                                            const isExpanded = expandedId === log.id
                                            const isGuest = log.userId == null

                                            return (
                                                <tr key={log.id} className={`hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                                                    <td className="px-5 py-3 text-gray-600 font-mono text-xs whitespace-nowrap">
                                                        {formatTime(log.createdAt)}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`h-7 w-7 rounded-full flex items-center justify-center ${isGuest ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                                                <User className={`h-3.5 w-3.5 ${isGuest ? 'text-gray-400' : 'text-blue-500'}`} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-gray-900 font-medium truncate">{log.userName || '—'}</p>
                                                                <p className="text-xs text-gray-400 truncate">
                                                                    {isGuest ? '游客' : log.userEmail || '—'}
                                                                    {log.sessionId && <span className="ml-1 font-mono">{log.sessionId.substring(0, 8)}…</span>}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                                            <Icon className="h-3 w-3" />{cfg.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        {log.productId ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                                    {log.productImage ? (
                                                                        <img src={getProductImageUrl(undefined, log.productImage)} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-5 h-5 text-gray-300 m-auto mt-2.5" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-gray-900 font-medium truncate">{log.productName || log.productTitle || `#${log.productId}`}</p>
                                                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-gray-400">
                                                                        {log.productSku && <span>SKU: {log.productSku}</span>}
                                                                        {log.skuColor && <span>{log.skuColor}</span>}
                                                                        {log.bundleName && <span>套装: {log.bundleName}</span>}
                                                                        {log.unitPrice != null && <span>${log.unitPrice.toFixed(2)}</span>}
                                                                        {log.quantityChange != null && (
                                                                            <span className={log.quantityChange > 0 ? 'text-green-600' : log.quantityChange < 0 ? 'text-red-600' : ''}>
                                                                                {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">
                                                                {log.reason || log.operationTypeDesc || '—'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-3 whitespace-nowrap">
                                                        <p className="text-gray-900">{log.cartTotalQuantity || 0} 件商品</p>
                                                        <p className="text-xs text-gray-400">{log.cartItemsCount || 0} 个SKU</p>
                                                        <p className="text-xs text-gray-400">
                                                            ${(log.cartSubtotal ?? 0).toFixed(2)}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <button
                                                            onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                                            className={`p-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100'}`}
                                                        >
                                                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ====== Expanded Row Detail ====== */}
                            {expandedId != null && (() => {
                                const log = logs.find(l => l.id === expandedId)
                                if (!log) return null
                                const cfg = typeConfig[log.operationType] || { label: log.operationType, color: 'bg-gray-100 text-gray-600', icon: Clock }
                                return (
                                    <div className="border-t border-gray-200 bg-gray-50/70 px-5 py-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            {/* 基本信息 */}
                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">基本信息</h5>
                                                <div className="space-y-1 text-gray-700">
                                                    <p><span className="text-gray-400">ID:</span> #{log.id}</p>
                                                    <p><span className="text-gray-400">时间:</span> {formatFullTime(log.createdAt)}</p>
                                                    <p>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                                                            <cfg.icon className="h-3 w-3" />{cfg.label}
                                                        </span>
                                                    </p>
                                                    <p><span className="text-gray-400">描述:</span> {log.reason || log.operationTypeDesc || '—'}</p>
                                                </div>
                                            </div>

                                            {/* 用户信息 */}
                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">用户信息</h5>
                                                <div className="space-y-1 text-gray-700">
                                                    <p><span className="text-gray-400">用户名:</span> {log.userName || '—'}</p>
                                                    <p><span className="text-gray-400">邮箱:</span> {log.userEmail || '—'}</p>
                                                    <p><span className="text-gray-400">类型:</span> {log.userId ? '注册用户' : '游客'}</p>
                                                    <p className="font-mono text-xs"><span className="text-gray-400">Session:</span> {log.sessionId || '—'}</p>
                                                    {log.ipAddress && (
                                                        <p className="flex items-center gap-1 text-xs">
                                                            <MapPin className="h-3 w-3 text-gray-400" /> {log.ipAddress}
                                                        </p>
                                                    )}
                                                    {log.userAgent && (
                                                        <p className="flex items-center gap-1 text-xs text-gray-400 truncate max-w-[280px]" title={log.userAgent}>
                                                            <Monitor className="h-3 w-3 flex-shrink-0" /> {log.userAgent.substring(0, 60)}{log.userAgent.length > 60 ? '…' : ''}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 商品 / 数量变化 */}
                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">商品 &amp; 数量</h5>
                                                <div className="space-y-1 text-gray-700">
                                                    {log.productId ? (
                                                        <>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                                    {log.productImage ? (
                                                                        <img src={getProductImageUrl(undefined, log.productImage)} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package className="w-8 h-8 text-gray-300 m-auto mt-4" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{log.productName || log.productTitle || `#${log.productId}`}</p>
                                                                    {log.bundleName && <p className="text-xs text-gray-400">套装: {log.bundleName}</p>}
                                                                </div>
                                                            </div>
                                                            <p><span className="text-gray-400">SKU:</span> {log.productSku || '—'}</p>
                                                            {log.skuColor && <p><span className="text-gray-400">颜色:</span> {log.skuColor}</p>}
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {(log.quantityBefore != null || log.quantityAfter != null) ? (
                                                                    <>
                                                                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{log.quantityBefore ?? 0}</span>
                                                                        <span className="text-gray-400">→</span>
                                                                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{log.quantityAfter ?? 0}</span>
                                                                        {log.quantityChange != null && (
                                                                            <span className={`text-xs font-medium ${log.quantityChange > 0 ? 'text-green-600' : log.quantityChange < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                                                ({log.quantityChange > 0 ? '+' : ''}{log.quantityChange})
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400 text-xs">—</span>
                                                                )}
                                                            </div>
                                                            {log.unitPrice != null && <p className="text-xs text-gray-400">单价: ${log.unitPrice.toFixed(2)}</p>}
                                                            {log.totalPrice != null && <p className="text-xs text-gray-400">总价: ${log.totalPrice.toFixed(2)}</p>}
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-400 text-xs">无商品信息</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 购物车状态 */}
                                            <div>
                                                <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">购物车状态</h5>
                                                <div className="space-y-1 text-gray-700">
                                                    <p><span className="text-gray-400">Cart ID:</span> #{log.cartId}</p>
                                                    <p><span className="text-gray-400">SKU 数:</span> {log.cartItemsCount || 0}</p>
                                                    <p><span className="text-gray-400">总件数:</span> {log.cartTotalQuantity || 0}</p>
                                                    <p className="font-medium"><span className="text-gray-400">金额:</span> ${(log.cartSubtotal ?? 0).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {/* ====== Pagination ====== */}
                            {totalPages > 1 && (
                                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        第 {page + 1} / {totalPages} 页，共 {totalElements} 条
                                    </span>
                                    <div className="flex gap-1">
                                        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                                            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs">
                                            上一页
                                        </button>
                                        <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                                            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs">
                                            下一页
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export const dynamic = 'force-dynamic'
