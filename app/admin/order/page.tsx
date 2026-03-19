// app/admin/order/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { orderService } from '@/services/orderService'
import { OrderResponse, OrderItemResponse, OrderStatus } from '@/types/order'
import {
    Search,
    Filter,
    Truck,
    Eye,
    Calendar,
    MapPin,
    CreditCard,
    Mail,
    Hash,
    User
} from 'lucide-react'
import { sendShippingConfirmationEmail } from '@/app/actions/send-shipping-email';

// ... (Type definitions 保持不变: OrderStatus, AddressSnapshot, OrderItemResponse, OrderResponse) ...
// type OrderStatus =
//     | 'PENDING'
//     | 'PAID'
//     | 'PROCESSING'
//     | 'SHIPPED'
//     | 'DELIVERED'
//     | 'COMPLETED'
//     | 'CANCELLED'
//     | 'REFUNDED'
//     | 'EXPIRED';

interface AddressSnapshot {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
    addressLine1?: string;
    email?: string;
}
//
// interface OrderItemResponse {
//     id: number;
//     productName: string;
//     productTitle: string;
//     color: string;
//     quantity: number;
//     price: number;
//     sku?: string;
// }
//
// interface OrderResponse {
//     id: number;
//     orderNumber: string;
//     status: OrderStatus;
//     totalAmount: number;
//     shippingFee: number;
//     discountAmount: number;
//     finalAmount: number;
//     createdAt: string;
//     paymentMethod: string;
//     shippingMethod: string;
//     trackingNumber?: string;
//     items: OrderItemResponse[];
//     shippingAddress: AddressSnapshot;
//     recipientName: string;
//     recipientPhone: string;
//     paymentStatus: string;
//     guestEmail?: string;
// }

export default function OrderManagementPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)

    // ✅ 1. 拆分搜索状态
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [searchOrderNumber, setSearchOrderNumber] = useState('') // 精确/模糊订单号
    const [searchEmail, setSearchEmail] = useState('')             // 邮箱
    const [searchKeyword, setSearchKeyword] = useState('')         // 其他关键字(如姓名)

    // 分页
    const [page, setPage] = useState(0)
    const [size] = useState(12) // Service 默认是 12
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)

    // 发货弹窗状态
    const [isShipModalOpen, setIsShipModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('')
    const [trackingNumberInput, setTrackingNumberInput] = useState('')
    const [shipLoading, setShipLoading] = useState(false)

    // ✅ 2. 适配新的 Service 参数签名
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true)
            const data = await orderService.adminList({
                page,
                size,
                keyword: searchKeyword,
                status: statusFilter === 'ALL' ? '' : statusFilter, // status
                orderNumber: searchOrderNumber, // orderNumber: 独立参数
                guestEmail: searchEmail        // guestEmail: 独立参数
            })

            // 强制类型转换
            setOrders(data.content as unknown as OrderResponse[])
            setTotalPages(data.totalPages)
            setTotalElements(data.totalElements)
        } catch (error) {
            console.error('Failed to load orders:', error)
        } finally {
            setLoading(false)
        }
    }, [page, size, statusFilter, searchKeyword, searchOrderNumber, searchEmail])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    // 状态标签样式 (保持不变)
    const getStatusBadge = (status: OrderStatus) => {
        const styles: Record<OrderStatus, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            PAID: 'bg-blue-100 text-blue-800 border-blue-200',
            PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            SHIPPED: 'bg-purple-100 text-purple-800 border-purple-200',
            DELIVERED: 'bg-cyan-100 text-cyan-800 border-cyan-200',
            COMPLETED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
            REFUNDED: 'bg-pink-100 text-pink-800 border-pink-200',
            EXPIRED: 'bg-red-50 text-red-600 border-red-100',
        }
        const labels: Record<OrderStatus, string> = {
            PENDING: '待支付', PAID: '已支付', PROCESSING: '处理中', SHIPPED: '已发货',
            DELIVERED: '已送达', COMPLETED: '已完成', CANCELLED: '已取消', REFUNDED: '已退款', EXPIRED: '已过期',
        }
        return (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
    }

    // --- 操作逻辑 (发货部分保持不变) ---
    const openShipModal = (order: OrderResponse) => {
        setSelectedOrderId(order.id)
        setSelectedOrderNumber(order.orderNumber)
        setTrackingNumberInput(order.trackingNumber || '')
        setIsShipModalOpen(true)
    }

    const handleShipSubmit = async () => {
        if (!trackingNumberInput.trim() || !selectedOrderId) {
            alert('请输入物流单号')
            return
        }
        const order = orders.find(o => o.id === selectedOrderId);
        if (!order) return;

        try {
            setShipLoading(true)
            await orderService.shipOrder(selectedOrderId, trackingNumberInput)
            setIsShipModalOpen(false)

            // console.log('order: ', order)

            await sendShippingConfirmationEmail({
                orderNumber: order.orderNumber,
                email: order.guestEmail || order.shippingAddress.email || "",
                firstName: order.shippingAddress.firstName || "Customer",
                lastName: order.shippingAddress.lastName || order.shippingAddress.lastName.email || "",
                carrier: 'Standard Shipping',
                trackingNumber: trackingNumberInput,
                shippingAddress: {
                    addressLine1: order.shippingAddress.addressLine1 || "",
                    city: order.shippingAddress.city || "",
                    country: order.shippingAddress.country || ""
                },
                items: order.items.map(item => ({
                    title: item.productTitle,
                    quantity: item.quantity,
                    color: item.color,
                    image: ""
                }))
            });

            fetchOrders()
            alert('发货成功并已触发邮件发送')
        } catch (error) {
            console.error('发货操作失败:', error)
            alert('发货失败，请重试')
        } finally {
            setShipLoading(false)
        }
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setPage(0)
            fetchOrders()
        }
    }

    const tabs = [
        { key: 'ALL', label: '全部' },
        { key: 'PENDING', label: '待支付' },
        { key: 'PAID', label: '待发货' },
        { key: 'PROCESSING', label: '处理中' },
        { key: 'SHIPPED', label: '已发货' },
        { key: 'REFUNDED', label: '售后/退款' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">订单管理</h1>
                        <p className="text-sm text-gray-500 mt-1">处理发货、查看详情及售后管理</p>
                    </div>
                </div>

                {/* ✅ 3. 筛选与操作栏 (更新UI) */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-2 overflow-x-auto">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setStatusFilter(tab.key); setPage(0); }}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${statusFilter === tab.key
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Search Bars - 使用 Grid 布局适应多输入框 */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                        {/* 订单号搜索 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">订单号</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="#MT25..."
                                    value={searchOrderNumber}
                                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                        </div>

                        {/* 邮箱搜索 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">客户邮箱</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="name@example.com"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                        </div>

                        {/* 关键字搜索 (姓名等) */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">其他关键字</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="姓名/备注..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </div>
                        </div>

                        {/* 搜索按钮 */}
                        <div>
                            <button
                                onClick={() => { setPage(0); fetchOrders(); }}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors h-[38px]"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                筛选查询
                            </button>
                        </div>
                    </div>
                </div>

                {/* 订单列表 - 保持不变 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号/时间</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收货人</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">物流</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                        <p className="mt-2 text-sm text-gray-500">数据加载中...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-gray-100 rounded-full p-4 mb-3">
                                                <Search className="h-6 w-6 text-gray-400" />
                                            </div>
                                            暂无符合条件的订单
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <div className="text-sm font-bold text-gray-500">共{order.items.length}个商品</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {/*<div className="text-sm font-medium text-gray-900">{order.recipientName}</div>*/}
                                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                <span className="truncate max-w-[140px]" title={`${order.shippingAddress?.city}, ${order.shippingAddress?.country}`}>
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.country}
                                                </span>
                                            </div>
                                            {order.guestEmail && (
                                                <div className="text-xs text-indigo-500 mt-0.5 max-w-[140px] truncate" title={order.guestEmail}>
                                                    {order.guestEmail}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{formatCurrency(order.finalAmount)}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <CreditCard className="h-3 w-3 mr-1" />
                                                {order.paymentMethod || '未支付'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.trackingNumber ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{order.trackingNumber}</span>
                                                    <span className="text-xs">{order.shippingMethod}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {(order.status === 'PAID' || order.status === 'PROCESSING') && (
                                                    <button
                                                        onClick={() => openShipModal(order)}
                                                        className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-xs flex items-center transition-colors"
                                                    >
                                                        <Truck className="h-3 w-3 mr-1" />
                                                        发货
                                                    </button>
                                                )}

                                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* 分页组件 (保持不变) */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        第 <span className="font-medium">{page + 1}</span> 页，共 <span className="font-medium">{totalPages}</span> 页
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100">上一页</button>
                                        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100">下一页</button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 发货弹窗 (保持不变) */}
            {isShipModalOpen && (
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        onClick={() => !shipLoading && setIsShipModalOpen(false)}
                    ></div>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <Truck className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                                                订单发货
                                            </h3>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    正在为订单 <span className="font-bold text-gray-900">{selectedOrderNumber}</span> 进行发货操作。
                                                </p>
                                                <div className="mt-4">
                                                    <label htmlFor="tracking" className="block text-sm font-medium leading-6 text-gray-900">
                                                        物流运单号
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="tracking"
                                                            id="tracking"
                                                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            placeholder="请输入快递单号，如：SF12345678"
                                                            value={trackingNumberInput}
                                                            onChange={(e) => setTrackingNumberInput(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        disabled={shipLoading}
                                        onClick={handleShipSubmit}
                                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {shipLoading ? '提交中...' : '确认发货'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={shipLoading}
                                        onClick={() => setIsShipModalOpen(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}