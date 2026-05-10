'use client';

import { useState, useEffect } from 'react';
import { purchaseRecordService } from '@/services/purchaseRecordService';
import { PurchaseRecordResponse, PurchaseRecordQueryRequest, PurchaseRecordRequest, ReceivePurchaseRequest, ReturnPurchaseRequest } from '@/types/admin/purchase';
import { Package, ArrowUpRight, ArrowDownRight, RefreshCw, Search, Filter, Calendar, DollarSign, Plus, Check, X } from 'lucide-react';
import Pagination from '@/components/common/pagination';

const PURCHASE_TYPE_COLORS: Record<string, string> = {
  SAMPLE: 'bg-purple-100 text-purple-800',
  RESTOCK: 'bg-green-100 text-green-800',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL_RECEIVED: 'bg-blue-100 text-blue-800',
  RECEIVED: 'bg-green-100 text-green-800',
  RETURNED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

export default function PurchaseRecordPage() {
  const [records, setRecords] = useState<PurchaseRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 筛选条件
  const [filters, setFilters] = useState<PurchaseRecordQueryRequest>({
    page: 0,
    size: 20,
    purchaseType: '',
    status: '',
    keyword: '',
  });

  // 操作弹窗
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PurchaseRecordResponse | null>(null);
  const [createForm, setCreateForm] = useState<PurchaseRecordRequest>({
    productName: '',
    quantity: 0,
    purchaseType: 'RESTOCK',
    warehouseLocation: '新塘',
  });
  const [receiveForm, setReceiveForm] = useState<ReceivePurchaseRequest>({ 
    receivedQuantity: 0,
    warehouseLocation: '新塘',
  });
  const [cancelReason, setCancelReason] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const result = await purchaseRecordService.getPurchaseRecords(filters);
      setRecords(result.content || []);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      console.error('Failed to fetch purchase records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords();
    }, 300); // 防抖 300ms
    
    return () => clearTimeout(timer);
  }, [filters.page, filters.size, filters.purchaseType, filters.status, filters.keyword]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0, // 重置到第一页
    }));
  };

  const handleSearch = () => {
    fetchRecords();
  };

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      purchaseType: '',
      status: '',
      keyword: '',
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return `¥${value.toFixed(2)}`;
  };

  // 创建采购
  const handleCreate = async () => {
    if (!createForm.productName || createForm.quantity <= 0) {
      alert('请填写商品名称和采购数量');
      return;
    }
    
    try {
      await purchaseRecordService.createPurchase(createForm);
      setShowCreateModal(false);
      setCreateForm({
        productName: '',
        quantity: 0,
        purchaseType: 'RESTOCK',
        warehouseLocation: '新塘',
      });
      fetchRecords();
    } catch (error) {
      console.error('Failed to create purchase:', error);
      alert('创建失败，请重试');
    }
  };

  // 确认入库
  const handleReceive = async () => {
    if (!selectedRecord || receiveForm.receivedQuantity <= 0) return;
    
    try {
      await purchaseRecordService.receivePurchase(selectedRecord.id, receiveForm);
      setShowReceiveModal(false);
      setSelectedRecord(null);
      setReceiveForm({ 
        receivedQuantity: 0,
        warehouseLocation: '新塘',
      });
      fetchRecords();
    } catch (error: any) {
      console.error('Failed to receive purchase:', error);
      const errorMessage = error.response?.data?.message || error.message || '入库失败，请重试';
      alert(errorMessage);
    }
  };



  // 取消采购
  const handleCancel = async () => {
    if (!selectedRecord) return;
    
    try {
      await purchaseRecordService.cancelPurchase(selectedRecord.id, cancelReason);
      setShowCancelModal(false);
      setSelectedRecord(null);
      setCancelReason('');
      fetchRecords();
    } catch (error: any) {
      console.error('Failed to cancel purchase:', error);
      const errorMessage = error.response?.data?.message || error.message || '取消失败，请重试';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">采购记录</h1>
              <p className="mt-2 text-sm text-gray-600">管理所有采购行为（样品、新品、补货等）</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                新建采购
              </button>
              <button
                onClick={fetchRecords}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">筛选条件</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 采购类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">采购类型</label>
              <select
                value={filters.purchaseType}
                onChange={(e) => handleFilterChange('purchaseType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">全部类型</option>
                <option value="SAMPLE">样品</option>
                <option value="RESTOCK">补货</option>
              </select>
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">全部状态</option>
                <option value="PENDING">待处理</option>
                <option value="PARTIAL_RECEIVED">部分入库</option>
                <option value="RECEIVED">已入库</option>
                <option value="RETURNED">已退回</option>
                <option value="CANCELLED">已取消</option>
              </select>
            </div>

            {/* 关键词搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="采购单号、商品名称..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              搜索
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              重置
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    采购单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    类型/状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    采购数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    入库/退回
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    供应商
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>加载中...</span>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">暂无采购记录</p>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {record.purchaseNo}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${PURCHASE_TYPE_COLORS[record.purchaseType] || 'bg-gray-100 text-gray-800'}`}>
                            {record.purchaseTypeDesc}
                          </span>
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${STATUS_COLORS[record.status] || 'bg-gray-100 text-gray-800'}`}>
                              {record.statusDesc}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          <div>{record.productName}</div>
                          {record.skuCode && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">{record.skuCode}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{record.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUpRight className="w-3 h-3" />
                            <span className="font-medium">{record.receivedQuantity}</span>
                          </div>
                          {record.returnedQuantity > 0 && (
                            <div className="flex items-center gap-1 text-red-600">
                              <ArrowDownRight className="w-3 h-3" />
                              <span className="font-medium">{record.returnedQuantity}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="font-semibold text-gray-900">{formatCurrency(record.totalAmount)}</div>
                          {record.unitPrice && (
                            <div className="text-xs text-gray-500">{formatCurrency(record.unitPrice)} × {record.quantity}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.supplier || '-'}</div>
                        {record.supplierContact && (
                          <div className="text-xs text-gray-500">{record.supplierContact}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(record.purchaseDate || record.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {record.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowReceiveModal(true);
                                }}
                                className="text-green-600 hover:text-green-900 text-sm font-medium flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                入库
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowCancelModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center gap-1"
                              >
                                <X className="w-4 h-4" />
                                取消
                              </button>
                            </>
                          )}
                          {record.status === 'PARTIAL_RECEIVED' && (
                            <button
                              onClick={() => {
                                setSelectedRecord(record);
                                setShowReceiveModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 text-sm font-medium flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              继续入库
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && records.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>

      {/* 入库弹窗 */}
      {showReceiveModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">确认入库</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">采购单号</label>
                <p className="text-sm text-gray-900 font-mono">{selectedRecord.purchaseNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <p className="text-sm text-gray-900">{selectedRecord.productName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入库数量</label>
                <input
                  type="number"
                  min="1"
                  max={selectedRecord.quantity - selectedRecord.receivedQuantity}
                  value={receiveForm.receivedQuantity}
                  onChange={(e) => setReceiveForm({ ...receiveForm, receivedQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  最多可入库: {selectedRecord.quantity - selectedRecord.receivedQuantity}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">仓库位置</label>
                <input
                  type="text"
                  value={receiveForm.warehouseLocation || ''}
                  onChange={(e) => setReceiveForm({ ...receiveForm, warehouseLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={receiveForm.notes || ''}
                  onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReceive}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                确认入库
              </button>
              <button
                onClick={() => {
                  setShowReceiveModal(false);
                  setSelectedRecord(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 取消弹窗 */}
      {showCancelModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">取消采购</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">采购单号</label>
                <p className="text-sm text-gray-900 font-mono">{selectedRecord.purchaseNo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">取消原因</label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认取消
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedRecord(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 创建采购弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">新建采购记录</h3>
            <div className="space-y-4">
              {/* 采购类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">采购类型 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    createForm.purchaseType === 'SAMPLE' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="purchaseType"
                      value="SAMPLE"
                      checked={createForm.purchaseType === 'SAMPLE'}
                      onChange={(e) => setCreateForm({ ...createForm, purchaseType: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-sm font-semibold">样品</div>
                      <div className="text-xs text-gray-500 mt-1">联盟客样品采购</div>
                    </div>
                  </label>
                  <label className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    createForm.purchaseType === 'RESTOCK' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="purchaseType"
                      value="RESTOCK"
                      checked={createForm.purchaseType === 'RESTOCK'}
                      onChange={(e) => setCreateForm({ ...createForm, purchaseType: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-sm font-semibold">补货</div>
                      <div className="text-xs text-gray-500 mt-1">库存补货采购</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 商品名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={createForm.productName}
                  onChange={(e) => setCreateForm({ ...createForm, productName: e.target.value })}
                  placeholder="请输入商品名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* SKU编码 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU编码</label>
                <input
                  type="text"
                  value={createForm.skuCode || ''}
                  onChange={(e) => setCreateForm({ ...createForm, skuCode: e.target.value })}
                  placeholder="可选，新品采购可不填"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 采购数量和单价 - 并排显示 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">采购数量 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={createForm.quantity}
                    onChange={(e) => setCreateForm({ ...createForm, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">采购单价</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={createForm.unitPrice || ''}
                    onChange={(e) => setCreateForm({ ...createForm, unitPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="可选"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* 供应商信息 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">供应商</label>
                <input
                  type="text"
                  value={createForm.supplier || ''}
                  onChange={(e) => setCreateForm({ ...createForm, supplier: e.target.value })}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 供应商联系方式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">供应商联系方式</label>
                <input
                  type="text"
                  value={createForm.supplierContact || ''}
                  onChange={(e) => setCreateForm({ ...createForm, supplierContact: e.target.value })}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 仓库位置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">仓库位置</label>
                <input
                  type="text"
                  value={createForm.warehouseLocation || ''}
                  onChange={(e) => setCreateForm({ ...createForm, warehouseLocation: e.target.value })}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 采购原因 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">采购原因</label>
                <input
                  type="text"
                  value={createForm.reason || ''}
                  onChange={(e) => setCreateForm({ ...createForm, reason: e.target.value })}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={createForm.notes || ''}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="可选"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                确认创建
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    productName: '',
                    quantity: 0,
                    purchaseType: 'RESTOCK',
                    warehouseLocation: '新塘',
                  });
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}