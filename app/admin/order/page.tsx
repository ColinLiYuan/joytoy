'use client'

import { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    Truck,
    Eye,
    MoreHorizontal,
    X,
    CheckCircle,
    AlertCircle,
    Calendar,
    MapPin,
    CreditCard
} from 'lucide-react'

// --- 类型定义 (对应你的 Java DTO) ---
// 实际项目中建议放入 types/index.ts
type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

interface AddressSnapshot {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
    addressLine1?: string;
}

interface OrderItemResponse {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    sku?: string;
}

interface OrderResponse {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string; // ISO String
    paymentMethod: string;
    shippingMethod: string;
    trackingNumber?: string;
    items: OrderItemResponse[];
    shippingAddress: AddressSnapshot;
    recipientName: string;
    recipientPhone: string;
    paymentStatus: string;
}

export default function OrderManagementPage() {
    // --- 状态管理 ---
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('ALL')
    const [searchTerm, setSearchTerm] = useState('')

    // 发货弹窗状态
    const [isShipModalOpen, setIsShipModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const [trackingNumberInput, setTrackingNumberInput] = useState('')

    // --- 模拟数据加载 (实际项目中替换为 API 调用) ---
    useEffect(() => {
        // 模拟 API 请求
        setTimeout(() => {
            const mockData: OrderResponse[] = [
                {
                    id: 1,
                    orderNumber: '#MT251001',
                    status: 'PAID', // 待发货
                    totalAmount: 299.00,
                    shippingFee: 10.00,
                    discountAmount: 0,
                    finalAmount: 309.00,
                    createdAt: '2025-12-20T10:30:00',
                    paymentMethod: 'PayPal',
                    shippingMethod: 'Standard',
                    trackingNumber: '',
                    items: [{ id: 101, productName: '无线蓝牙耳机', quantity: 1, price: 299.00, sku: 'BLK-001' }],
                    shippingAddress: { country: 'USA', city: 'New York', addressLine1: '123 Broadway' },
                    recipientName: 'John Doe',
                    recipientPhone: '+1 123-456-7890',
                    paymentStatus: 'SUCCESS'
                },
                {
                    id: 2,
                    orderNumber: '#MT251002',
                    status: 'SHIPPED', // 已发货
                    totalAmount: 150.00,
                    shippingFee: 0,
                    discountAmount: 10,
                    finalAmount: 140.00,
                    createdAt: '2025-12-19T14:20:00',
                    paymentMethod: 'Credit Card',
                    shippingMethod: 'Express',
                    trackingNumber: 'SF123456789',
                    items: [{ id: 102, productName: '手机壳', quantity: 2, price: 75.00 }],
                    shippingAddress: { country: 'China', city: 'Shanghai', addressLine1: 'Nanjing Road' },
                    recipientName: '张三',
                    recipientPhone: '13800138000',
                    paymentStatus: 'SUCCESS'
                },
                {
                    id: 3,
                    orderNumber: '#MT251003',
                    status: 'PENDING', // 待付款
                    totalAmount: 599.00,
                    shippingFee: 20,
                    discountAmount: 0,
                    finalAmount: 619.00,
                    createdAt: '2025-12-21T09:00:00',
                    paymentMethod: 'PayPal',
                    shippingMethod: 'Standard',
                    items: [],
                    shippingAddress: { country: 'UK', city: 'London' },
                    recipientName: 'Alice Smith',
                    recipientPhone: '',
                    paymentStatus: 'UNPAID'
                }
            ]
            setOrders(mockData)
            setLoading(false)
        }, 800)
    }, [])

    // --- 辅助函数 ---

    // 状态对应的标签样式和文字
    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING':
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">待付款</span>
            case 'PAID':
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">待发货</span>
            case 'SHIPPED':
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">已发货</span>
            case 'COMPLETED':
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">已完成</span>
            case 'CANCELLED':
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">已取消</span>
            default:
                return <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
        }
    }

    // 格式化金额
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount)
    }

    // --- 事件处理 ---

    // 打开此时发货弹窗
    const openShipModal = (orderId: number) => {
        setSelectedOrderId(orderId)
        setTrackingNumberInput('')
        setIsShipModalOpen(true)
    }

    // 提交发货
    const handleShipSubmit = async () => {
        if (!trackingNumberInput.trim()) {
            alert('请输入物流单号')
            return
        }

        // TODO: 调用后端 API 更新订单状态为 SHIPPED 并保存 trackingNumber
        console.log(`Shipping Order ID: ${selectedOrderId}, Tracking: ${trackingNumberInput}`)

        // 模拟更新本地状态
        setOrders(prev => prev.map(order =>
            order.id === selectedOrderId
                ? { ...order, status: 'SHIPPED', trackingNumber: trackingNumberInput }
                : order
        ))

        setIsShipModalOpen(false)
        // 可以加一个 Toast 提示成功
    }

    // 筛选逻辑
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const tabs = [
        { key: 'ALL', label: '全部订单' },
        { key: 'PENDING', label: '待付款' },
        { key: 'PAID', label: '待发货' }, // 重点关注
        { key: 'SHIPPED', label: '已发货' },
        { key: 'COMPLETED', label: '已完成' },
        { key: 'CANCELLED', label: '已取消' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 1. 页面头部 */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">订单管理</h1>
                        <p className="text-gray-600 mt-2">查看所有订单状态并处理发货</p>
                    </div>
                </div>

                {/* 2. 统计概览 (可选) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">待发货订单</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {orders.filter(o => o.status === 'PAID').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ... 其他统计 ... */}
                </div>

                {/* 3. 筛选与操作栏 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setStatusFilter(tab.key)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                        ${statusFilter === tab.key
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="搜索订单号、收货人姓名..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* 可以加更多筛选器，如日期范围 */}
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                            <Filter className="h-4 w-4 mr-2" />
                            更多筛选
                        </button>
                    </div>
                </div>

                {/* 4. 订单列表表格 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单信息</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收货人</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额/支付</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">物流信息</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-500">加载订单中...</p>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        没有找到符合条件的订单
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        {/* 订单信息 */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{order.orderNumber}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                共 {order.items.length} 件商品
                                            </div>
                                        </td>

                                        {/* 收货人 */}
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.recipientName}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex items-start">
                                                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                                <span className="truncate max-w-[150px]" title={`${order.shippingAddress.city}, ${order.shippingAddress.country}`}>
                                                    {order.shippingAddress.city}, {order.shippingAddress.country}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{order.recipientPhone}</div>
                                        </td>

                                        {/* 金额/支付 */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{formatCurrency(order.finalAmount)}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <CreditCard className="h-3 w-3 mr-1" />
                                                {order.paymentMethod}
                                            </div>
                                        </td>

                                        {/* 状态 */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>

                                        {/* 物流信息 */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.trackingNumber ? (
                                                <div>
                                                    <div className="text-sm text-gray-900 font-medium">{order.trackingNumber}</div>
                                                    <div className="text-xs text-gray-500">{order.shippingMethod}</div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>

                                        {/* 操作 */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                {/* 核心功能：发货按钮 */}
                                                {order.status === 'PAID' && (
                                                    <button
                                                        onClick={() => openShipModal(order.id)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    >
                                                        <Truck className="h-4 w-4 mr-1" />
                                                        发货
                                                    </button>
                                                )}

                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* 分页组件 (静态展示) */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredOrders.length}</span> 条结果
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        上一页
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        下一页
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. 发货弹窗 (Modal) */}
            {isShipModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* 背景遮罩 */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsShipModalOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <Truck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        订单发货
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-4">
                                            请输入订单 <span className="font-bold text-gray-800">#{orders.find(o => o.id === selectedOrderId)?.orderNumber}</span> 的物流单号。
                                        </p>
                                        <div>
                                            <label htmlFor="tracking-no" className="block text-sm font-medium text-gray-700">物流单号</label>
                                            <input
                                                type="text"
                                                name="tracking-no"
                                                id="tracking-no"
                                                className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                placeholder="例如: SF12345678"
                                                value={trackingNumberInput}
                                                onChange={(e) => setTrackingNumberInput(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleShipSubmit}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    确认发货
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsShipModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}