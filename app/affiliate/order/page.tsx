'use client'

import { useState, useEffect, useCallback } from 'react'
import { affiliateService } from '@/services/affiliateService'
import { getUserId } from '@/lib/user-utils'
import { useAuth } from '@/contexts/authContext'
import { ShieldCheck } from 'lucide-react'
import {
    Search,
    Calendar,
    Hash,
    Tag,
    Percent,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react'

// 复用 Order.java 对应的响应类型
type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED';

interface OrderResponse {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    finalAmount: number;
    commissionAmount: number; // ✅ Order.java 中的字段
    commissionRate: number;   // ✅ Order.java 中的字段
    couponCode: string;       // ✅ Order.java 中的字段
    createdAt: string;
}

export default function AffiliateOrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(false)
    const { isClient, openAuthModal } = useAuth()

    // 分页与搜索状态 (与 Admin 保持一致)
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [searchOrderNumber, setSearchOrderNumber] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    const fetchOrders = useCallback(async () => {
        // ✅ 先检查是否登录
        const userId = getUserId();
        if (!userId) {
            console.log('[Affiliate Orders] User not logged in');
            setAuthError(true);
            setLoading(false);
            return;
        }

        try {
            setLoading(true)
            // ✅ 共用订单查询接口，但后端会根据当前登录的 Affiliate 角色自动过滤
            const data = await affiliateService.orderList({
                page,
                size: 10,
                orderNumber: searchOrderNumber,
                status: statusFilter === 'ALL' ? '' : statusFilter
            })
            console.log('orders: ', data)
            setOrders(data.content as unknown as OrderResponse[])
            setTotalPages(data.totalPages)
            setTotalElements(data.totalElements)
        } catch (error) {
            console.error('Failed to load orders:', error)
        } finally {
            setLoading(false)
        }
    }, [page, statusFilter, searchOrderNumber])

    useEffect(() => {
        if (isClient) {
            fetchOrders()
        }
    }, [isClient, fetchOrders])

    // 状态样式映射
    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<string, string> = {
            PAID: 'bg-green-50 text-green-700 border-green-200',
            COMPLETED: 'bg-green-100 text-green-800 border-green-300',
            PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
        }
        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                {status}
            </span>
        )
    }

    const tabs = [
        { key: 'ALL', label: 'All Orders' },
        // { key: 'PAID', label: 'Settling' },
        // { key: 'COMPLETED', label: 'Completed' },
    ]

    return (
        <div className="space-y-6">
            {/* 未登录状态 */}
            {authError && (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-dashed border-gray-200 p-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                    <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
                        You need to login as an affiliate to view your referral orders.
                    </p>
                    <button
                        onClick={() => openAuthModal('login', { 
                            onSuccess: () => window.location.reload() 
                        })}
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                    >
                        Login to Continue
                    </button>
                </div>
            )}

            {!authError && (
            <>
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Referral Orders</h1>
                    <p className="text-sm text-gray-500">Track your performance and commissions.</p>
                </div>
            </div>

            {/* 列表容器 (复用 Admin 风格) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-4">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setStatusFilter(tab.key); setPage(0); }}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    statusFilter === tab.key ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Search Bar */}
                <div className="p-4 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Order Number..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                            value={searchOrderNumber}
                            onChange={(e) => setSearchOrderNumber(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                        />
                    </div>
                    {/*<button onClick={fetchOrders} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">*/}
                    {/*    <Filter className="w-4 h-4" /> Filter*/}
                    {/*</button>*/}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-y border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Order Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Discount Code</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Value</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Commission</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-200" /></td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.orderNumber}</div>
                                        <div className="text-[10px] text-gray-400 mt-1 uppercase flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" /> {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.couponCode ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                                                    <Tag className="w-3 h-3 mr-1" /> {order.couponCode}
                                                </span>
                                        ) : <span className="text-gray-300 text-xs">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        ${order.finalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-green-600">+${order.commissionAmount.toFixed(2)}</div>
                                        <div className="text-[10px] text-gray-400 flex items-center mt-1">
                                            <Percent className="w-2.5 h-2.5 mr-0.5" /> {(order.commissionRate * 100).toFixed(0)}% Rate
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <p className="text-xs text-gray-500">Total <span className="font-bold text-gray-900">{totalElements}</span> orders</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    )
}