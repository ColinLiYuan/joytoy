'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { cancelAdminOrder, refundAdminOrder, settleOrderCommission, updateOrderStatus } from '@/app/actions/order'
import { orderService } from '@/services/orderService'
import { OrderResponse, OrderStatus } from '@/types/order'
import {
    Search,
    Truck,
    Eye,
    Calendar,
    CreditCard,
    Package,
    PackageCheck,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    XCircle,
    DollarSign
} from 'lucide-react'

// 定义所有状态
const statuses: (OrderStatus | 'ALL')[] = [
    'ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'
];

// 状态中文映射
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
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)

    // 初始化默认过滤“已支付”状态
    const [activeStatus, setActiveStatus] = useState<OrderStatus | 'ALL'>('PAID')
    const [searchQuery, setSearchQuery] = useState('')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // 发货弹窗状态
    const [isShipModalOpen, setIsShipModalOpen] = useState(false)
    const [shipOrder, setShipOrder] = useState<OrderResponse | null>(null)
    const [trackingNumber, setTrackingNumber] = useState('')
    const [shipLoading, setShipLoading] = useState(false)

    // 退款弹窗状态
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
    const [refundOrder, setRefundOrder] = useState<OrderResponse | null>(null)
    const [refundReason, setRefundReason] = useState('')
    const [refundLoading, setRefundLoading] = useState(false)

    // 取消订单弹窗状态
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [cancelOrder, setCancelOrder] = useState<OrderResponse | null>(null)
    const [cancelLoading, setCancelLoading] = useState(false)
    
    // 佣金结算 loading 状态
    const [settlingOrderId, setSettlingOrderId] = useState<number | null>(null)

    // 获取订单列表
    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const data = await orderService.adminList({
                page,
                size: 7,
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

    // 更新状态逻辑（后端是状态机模式，根据当前状态自动推进到下一步）
    const handleUpdateStatus = async (orderNumber: string, trackingNumber?: string) => {
        console.log('[Handle Update Status] orderNumber:', orderNumber, 'trackingNumber:', trackingNumber);
        
        // 如果是发货操作，检查物流单号
        if (trackingNumber) {
            if (!window.confirm(`确定要发货吗？物流单号：${trackingNumber}`)) return;
        } else {
            if (!window.confirm(`确定要推进订单状态吗？`)) return;
        }

        try {
            console.log('[Handle Update Status] Calling updateOrderStatus...');
            await updateOrderStatus(orderNumber, trackingNumber);
            console.log('[Handle Update Status] Success, refreshing orders...');
            fetchOrders();
        } catch (error: any) {
            console.error('[Handle Update Status] Error:', error);
            alert('操作失败: ' + (error.message || '未知错误'));
        }
    };

    // 退款提交
    const handleRefundSubmit = async () => {
        if (!refundOrder) return
        setRefundLoading(true)
        try {
            await refundAdminOrder(refundOrder.orderNumber, refundReason || '管理员退款')
            setIsRefundModalOpen(false)
            setRefundReason('')
            fetchOrders()
        } catch (error: any) {
            console.error('Refund error:', error)
            alert('退款操作失败: ' + (error.message || '未知错误'));
        } finally {
            setRefundLoading(false)
        }
    }

    // 取消订单提交
    const handleCancelSubmit = async () => {
        if (!cancelOrder) return
        setCancelLoading(true)
        try {
            await cancelAdminOrder(cancelOrder.orderNumber)
            setIsCancelModalOpen(false)
            fetchOrders()
        } catch (error: any) {
            console.error('Cancel error:', error)
            alert('取消订单失败: ' + (error.message || '未知错误'));
        } finally {
            setCancelLoading(false)
        }
    }
    
    // 佣金结算
    const handleSettleCommission = async (order: OrderResponse) => {
        if (!window.confirm(`确定要结算订单 #${order.orderNumber} 的佣金吗？`)) return;
        
        setSettlingOrderId(order.id);
        try {
            const result = await settleOrderCommission(order.orderNumber);
            alert(`佣金结算成功！\n联盟ID: ${result.affiliateId}\n佣金金额: $${result.commissionAmount}`);
            fetchOrders();
        } catch (error: any) {
            console.error('Settle commission error:', error);
            // 显示后端返回的具体错误信息
            const errorMsg = error.message || '未知错误';
            if (errorMsg.includes('没有联盟推广')) {
                alert('该订单没有联盟推广，无需结算佣金。');
            } else if (errorMsg.includes('已结算')) {
                alert('该订单佣金已结算，无需重复操作。');
            } else {
                alert('佣金结算失败: ' + errorMsg);
            }
        } finally {
            setSettlingOrderId(null);
        }
    }

    // 发货提交
    const handleShipSubmit = async () => {
        if (!trackingNumber || !shipOrder) return
        setShipLoading(true)
        try {
            await updateOrderStatus(shipOrder.orderNumber, trackingNumber);

            // ✅ 发货邮件由后端自动发送，前端无需处理

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
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                        />
                    </div>
                </div>

                {/* 订单列表 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">订单编号</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">商品名称</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">客户邮箱</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">联盟信息</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">佣金状态</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">实付金额</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">当前状态</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">管理操作</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-20 text-center text-gray-400">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                    正在加载订单数据...
                                </td>
                            </tr>
                        ) : orders.map((order) => {
                            // 调试日志：检查 COMPLETED 订单
                            if (order.status === 'COMPLETED') {
                                console.log('[Order Debug] COMPLETED order:', {
                                    orderNumber: order.orderNumber,
                                    affiliateId: order.affiliateId,
                                    affiliateCode: order.affiliateCode,
                                    commissionAmount: order.commissionAmount,
                                    affiliatePayoutStatus: order.affiliatePayoutStatus,
                                    shouldShowSettleButton: order.affiliateId && order.commissionAmount && order.commissionAmount > 0 && order.affiliatePayoutStatus?.toUpperCase() === 'PENDING'
                                });
                            }
                            
                            // 格式化下单时间
                            const orderDate = new Date(order.createdAt);
                            const orderTimeStr = orderDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                            const orderDateStr = orderDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
                            
                            // 格式化完成时间
                            let completedTimeStr = '';
                            let completedDateStr = '';
                            if (order.completedAt) {
                                const completedDate = new Date(order.completedAt);
                                completedTimeStr = completedDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                                completedDateStr = completedDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
                            }
                            
                            // 拼接商品名称
                            const productNames = order.items?.map(item => item.productTitle).filter(Boolean).join(', ') || '-';
                            
                            return (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-mono text-sm font-bold text-gray-900">#{order.orderNumber}</div>
                                    <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-500" title={orderDate.toLocaleString('zh-CN')}>
                                        <Calendar className="h-3 w-3 flex-shrink-0" />
                                        <span>{orderDateStr}</span>
                                        <span className="text-gray-400">{orderTimeStr}</span>
                                    </div>
                                    {order.completedAt && (
                                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-green-600" title={new Date(order.completedAt).toLocaleString('zh-CN')}>
                                            <PackageCheck className="h-3 w-3 flex-shrink-0" />
                                            <span>{completedDateStr}</span>
                                            <span className="text-green-500">{completedTimeStr}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div 
                                        className="max-w-[200px] truncate text-xs text-gray-700 cursor-pointer hover:text-gray-900"
                                        title={productNames}
                                    >
                                        {productNames}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div 
                                        className="max-w-[180px] truncate text-xs text-gray-600 cursor-pointer hover:text-gray-900"
                                        title={order.guestEmail || '-'}
                                    >
                                        {order.guestEmail || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {order.affiliateCode ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-900">{order.affiliateCode}</span>
                                                {order.commissionAmount !== undefined && order.commissionAmount > 0 && (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                                        ${order.commissionAmount.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {order.affiliatePayoutStatus ? (
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border ${
                                            order.affiliatePayoutStatus === 'PAID' 
                                                ? 'bg-green-100 text-green-700 border-green-200' 
                                                : order.affiliatePayoutStatus === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {order.affiliatePayoutStatus === 'PAID' 
                                                ? '已结算' 
                                                : order.affiliatePayoutStatus === 'PENDING' 
                                                    ? '待结算' 
                                                    : order.affiliatePayoutStatus}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.finalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)}`}>
                                            {statusMap[order.status] || order.status}
                                        </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        {/* 查看详情按钮 */}
                                        <button
                                            onClick={() => router.push(`/admin/order/detail/${order.orderNumber}`)}
                                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                            title="详情"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>

                                        {order.status === 'PENDING' && (
                                            <button onClick={() => handleUpdateStatus(order.orderNumber)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg" title="确认支付"><CreditCard className="h-5 w-5" /></button>
                                        )}
                                        {['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(order.status) && (
                                            <button onClick={() => { setRefundOrder(order); setIsRefundModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="退款"><RotateCcw className="h-5 w-5" /></button>
                                        )}
                                        {order.status === 'PAID' && (
                                            <button onClick={() => handleUpdateStatus(order.orderNumber)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg" title="开始处理"><Package className="h-5 w-5" /></button>
                                        )}
                                        {order.status === 'PROCESSING' && (
                                            <button onClick={() => { setShipOrder(order); setIsShipModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="去发货"><Truck className="h-5 w-5" /></button>
                                        )}
                                        {order.status === 'PENDING' && (
                                            <button onClick={() => { setCancelOrder(order); setIsCancelModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="取消订单"><XCircle className="h-5 w-5" /></button>
                                        )}
                                        {order.status === 'SHIPPED' && (
                                            <button onClick={() => handleUpdateStatus(order.orderNumber)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg" title="确认签收"><PackageCheck className="h-5 w-5" /></button>
                                        )}
                                        {order.status === 'COMPLETED' && order.affiliateId && (order.commissionAmount || 0) > 0 && order.affiliatePayoutStatus?.toUpperCase() === 'PENDING' && (
                                            <button 
                                                onClick={() => handleSettleCommission(order)} 
                                                disabled={settlingOrderId === order.id}
                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50" 
                                                title="结算佣金"
                                            >
                                                {settlingOrderId === order.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <DollarSign className="h-5 w-5" />}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                        })}
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

            {/* 退款模态框 */}
            {isRefundModalOpen && refundOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsRefundModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">订单退款</h3>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">订单号：<span className="font-mono font-bold">#{refundOrder.orderNumber}</span></p>
                                <p className="text-sm text-gray-600">退款金额：<span className="font-bold text-red-600">${refundOrder.finalAmount.toFixed(2)}</span></p>
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">退款原因</label>
                            <textarea
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black resize-none"
                                rows={3}
                                placeholder="请输入退款原因（选填）"
                            />
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button onClick={() => setIsRefundModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
                            <button
                                onClick={handleRefundSubmit}
                                disabled={refundLoading}
                                className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {refundLoading ? '处理中...' : '确认退款'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 取消订单模态框 */}
            {isCancelModalOpen && cancelOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsCancelModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">取消订单</h3>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">订单号：<span className="font-mono font-bold">#{cancelOrder.orderNumber}</span></p>
                                <p className="text-sm text-gray-600">订单金额：<span className="font-bold">${cancelOrder.finalAmount.toFixed(2)}</span></p>
                                <p className="text-sm text-gray-600">当前状态：<span className="font-medium">{statusMap[cancelOrder.status]}</span></p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    <strong>注意：</strong>此操作不可撤销。
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
                            <button
                                onClick={handleCancelSubmit}
                                disabled={cancelLoading}
                                className="px-6 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {cancelLoading ? '处理中...' : '确认取消'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 发货模态框 */}
            {isShipModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsShipModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">订单发货</h3>
                            <label className="block text-sm font-medium text-gray-700 mb-1">物流单号</label>
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                                placeholder="请输入物流单号"
                            />
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button onClick={() => setIsShipModalOpen(false)} className="px-4 py-2 text-sm text-gray-600">取消</button>
                            <button
                                onClick={handleShipSubmit}
                                disabled={shipLoading || !trackingNumber}
                                className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg disabled:opacity-50"
                            >
                                {shipLoading ? '提交中...' : '确认发货'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}export const dynamic = 'force-dynamic'; 
