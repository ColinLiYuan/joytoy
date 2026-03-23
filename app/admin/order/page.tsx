// app/admin/order/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { orderService } from '@/services/orderService'
import { OrderResponse, OrderStatus } from '@/types/order'
import {
    Search,
    Truck,
    Eye,
    Calendar,
    CreditCard,
    Package, // 新增：用于表示打包/处理中的图标
    PackageCheck,
    Loader2
} from 'lucide-react'
import { sendShippingConfirmationEmail } from '@/app/actions/send-shipping-email';

// 定义所有状态，包含已签收
const statuses: (OrderStatus | 'ALL')[] = [
    'ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'
];

// 状态中文映射字典
const statusMap: Record<string, string> = {
    'ALL': '全部订单',
    'PENDING': '待支付',
    'PAID': '已支付',
    'PROCESSING': '处理中',
    'SHIPPED': '已发货',
    'DELIVERED': '已签收',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款',
    'EXPIRED': '已过期'
};

export default function OrderPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)

    // 发货弹窗状态
    const [isShipModalOpen, setIsShipModalOpen] = useState(false)
    const [shipOrder, setShipOrder] = useState<OrderResponse | null>(null)
    const [trackingNumber, setTrackingNumber] = useState('')
    const [shipLoading, setShipLoading] = useState(false)

    // 获取订单列表
    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const data = await orderService.adminList({
                page,
                size: 10,
                status: activeStatus === 'ALL' ? undefined : activeStatus,
                orderNumber: searchQuery
            })
            setOrders(data.content)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('Fetch orders failed:', error)
        } finally {
            setLoading(false)
        }
    }, [page, activeStatus, searchQuery])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    // 通用的状态更新方法（用于支付确认、开始处理、签收确认等操作）
    const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
        if (!window.confirm(`确定要将订单状态手动更新为【${statusMap[newStatus] || newStatus}】吗？`)) return;

        try {
            // 直接调用 orderService 的封装方法
            await orderService.updateStatus(orderId, newStatus);
            fetchOrders();
        } catch (error: any) {
            alert('操作失败: ' + (error.message || '未知错误'));
        }
    };

    // 发货提交逻辑（复用通用的 updateStatus 接口，同时附带物流单号）
    const handleShipSubmit = async () => {
        if (!trackingNumber || !shipOrder) return
        setShipLoading(true)
        try {
            // 直接调用 orderService 的封装方法，传入 trackingNumber
            await orderService.updateStatus(shipOrder.id, trackingNumber);

            await sendShippingConfirmationEmail({
                orderNumber: shipOrder.orderNumber,
                email: shipOrder.guestEmail || shipOrder.shippingAddress.email || "",
                firstName: shipOrder.shippingAddress.firstName || "Customer",
                lastName: shipOrder.shippingAddress.lastName || "Customer",
                carrier: 'Standard Shipping',
                trackingNumber: trackingNumber,
                shippingAddress: {
                    addressLine1: shipOrder.shippingAddress.addressLine1 || "",
                    city: shipOrder.shippingAddress.city || "",
                    country: shipOrder.shippingAddress.country || ""
                },
                items: shipOrder.items.map(item => ({
                    title: item.productTitle,
                    quantity: item.quantity,
                    color: item.color,
                    image: ""
                }))
            });

            setIsShipModalOpen(false)
            setTrackingNumber('')
            fetchOrders()
        } catch (error: any) {
            console.error('Ship error:', error)
            alert('发货操作失败: ' + (error.message || '未知错误'));
        } finally {
            setShipLoading(false)
        }
    }

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'COMPLETED': return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'CANCELLED':
            case 'REFUNDED':
            case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">订单管理</h1>
                </div>

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
                                {statusMap[status] || status}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="输入订单号搜索..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 订单列表 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">订单编号</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">客户邮箱</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">联盟码</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">折扣码</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">折扣金额</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">实付金额</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">佣金率</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">佣金</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">当前状态</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">管理操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-gray-400">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    正在加载订单数据...
                                </td>
                            </tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-sm font-bold text-gray-900">#{order.orderNumber}</div>
                                    <div className="text-xs text-gray-400 mt-1 flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.guestEmail}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.affiliateCode}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{order.couponCode}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.discountAmount}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.finalAmount}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.commissionRate}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.commissionAmount}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                            {statusMap[order.status] || order.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                            title="详情"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>

                                        {/* 待支付状态下展示 支付按钮 */}
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                                className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                                                title="确认支付"
                                            >
                                                <CreditCard className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* 已支付状态下展示 开始处理按钮 (仅流转状态，不弹出发货框) */}
                                        {order.status === 'PAID' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg"
                                                title="开始处理"
                                            >
                                                <Package className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* 处理中状态下展示 发货按钮 (弹出发货框) */}
                                        {order.status === 'PROCESSING' && (
                                            <button
                                                onClick={() => { setShipOrder(order); setIsShipModalOpen(true); }}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                                title="去发货"
                                            >
                                                <Truck className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* 已发货状态下展示 签收按钮 */}
                                        {order.status === 'SHIPPED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                                                title="确认签收"
                                            >
                                                <PackageCheck className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 发货模态框 */}
            {isShipModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsShipModalOpen(false)} />
                        <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-6 py-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">订单发货</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">物流单号</label>
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                                            placeholder="请输入物流单号"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                                <button onClick={() => setIsShipModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">取消</button>
                                <button
                                    onClick={handleShipSubmit}
                                    disabled={shipLoading || !trackingNumber}
                                    className="px-6 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg disabled:opacity-50"
                                >
                                    {shipLoading ? '提交中...' : '确认发货'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}