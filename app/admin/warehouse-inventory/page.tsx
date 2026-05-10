'use client';

import { useState, useEffect } from 'react';
import { warehouseInventoryService } from '@/services/warehouseInventoryService';
import { WarehouseInventoryResponse, WarehouseInventoryQueryRequest, SyncInventoryRequest, AdjustInventoryRequest, SetPreSaleRequest, StockType, STOCK_TYPE_MAP } from '@/types/admin/warehouseInventory';
import { Package, RefreshCw, Search, Filter, Calendar, ArrowUpRight, Edit, Settings } from 'lucide-react';
import Pagination from '@/components/common/pagination';

export default function WarehouseInventoryPage() {
  const [inventories, setInventories] = useState<WarehouseInventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 筛选条件
  const [filters, setFilters] = useState<WarehouseInventoryQueryRequest>({
    page: 0,
    size: 20,
    keyword: '',
    stockType: undefined,
  });

  // 操作弹窗
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showPreSaleModal, setShowPreSaleModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<WarehouseInventoryResponse | null>(null);
  const [syncForm, setSyncForm] = useState<SyncInventoryRequest>({ syncQuantity: 0 });
  const [adjustForm, setAdjustForm] = useState<AdjustInventoryRequest>({});
  const [preSaleForm, setPreSaleForm] = useState<SetPreSaleRequest>({ preSaleQuantity: 0 });

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const result = await warehouseInventoryService.getInventoryList(filters);
      setInventories(result.content || []);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      console.error('Failed to fetch warehouse inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventories();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.page, filters.size, filters.keyword, filters.stockType]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0,
    }));
  };

  const handleSearch = () => {
    fetchInventories();
  };

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      keyword: '',
      stockType: undefined,
    });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 同步库存
  const handleSync = async () => {
    if (!selectedInventory || syncForm.syncQuantity <= 0) return;
    
    try {
      await warehouseInventoryService.syncInventory({
        inventoryId: selectedInventory.id,
        syncQuantity: syncForm.syncQuantity,
        notes: syncForm.notes
      });
      setShowSyncModal(false);
      setSelectedInventory(null);
      setSyncForm({ syncQuantity: 0 });
      fetchInventories();
    } catch (error: any) {
      console.error('Failed to sync inventory:', error);
      const errorMessage = error.response?.data?.message || error.message || '同步失败，请重试';
      alert(errorMessage);
    }
  };

  // 调整库存
  const handleAdjust = async () => {
    if (!selectedInventory) return;
    
    try {
      await warehouseInventoryService.adjustInventory(selectedInventory.id, adjustForm);
      setShowAdjustModal(false);
      setSelectedInventory(null);
      setAdjustForm({});
      fetchInventories();
    } catch (error: any) {
      console.error('Failed to adjust inventory:', error);
      const errorMessage = error.response?.data?.message || error.message || '调整失败，请重试';
      alert(errorMessage);
    }
  };

  // 设置预售
  const handlePreSale = async () => {
    if (!selectedInventory || preSaleForm.preSaleQuantity < 0) return;
    
    try {
      await warehouseInventoryService.setPreSale(selectedInventory.id, preSaleForm);
      setShowPreSaleModal(false);
      setSelectedInventory(null);
      setPreSaleForm({ preSaleQuantity: 0 });
      fetchInventories();
    } catch (error: any) {
      console.error('Failed to set pre-sale:', error);
      const errorMessage = error.response?.data?.message || error.message || '设置失败，请重试';
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
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">仓库库存</h1>
              <p className="mt-2 text-sm text-gray-600">管理仓库真实库存，同步到线上商品</p>
            </div>
            <button
              onClick={fetchInventories}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">筛选条件</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 关键词搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">关键词</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
                placeholder="SKU编码、商品名称..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* 库存类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">库存类型</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('stockType', undefined)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    !filters.stockType
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => handleFilterChange('stockType', 'FOR_SALE' as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    filters.stockType === 'FOR_SALE'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  在售
                </button>
                <button
                  onClick={() => handleFilterChange('stockType', 'SAMPLE' as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    filters.stockType === 'SAMPLE'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  样品
                </button>
              </div>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">SKU 总数</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{totalElements}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">总实际库存</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {inventories.reduce((sum, inv) => sum + (inv.actualStock || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">总在途库存</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">
              {inventories.reduce((sum, inv) => sum + (inv.onWayStock || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">总可同步库存</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {inventories.reduce((sum, inv) => sum + (inv.availableForSync || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    库存类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    仓库库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    已同步库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    在途库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    可同步
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    仓库位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    最后同步
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
                ) : inventories.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">暂无库存记录</p>
                    </td>
                  </tr>
                ) : (
                  inventories.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          <div>{inv.productName}</div>
                          {inv.skuCode && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">{inv.skuCode}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inv.stockType ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            inv.stockType === 'FOR_SALE' ? 'bg-green-100 text-green-800' :
                            inv.stockType === 'SAMPLE' ? 'bg-purple-100 text-purple-800' :
                            inv.stockType === 'ACTIVITY' ? 'bg-blue-100 text-blue-800' :
                            inv.stockType === 'DEFECT' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {STOCK_TYPE_MAP[inv.stockType]}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">实际:</span>
                            <span className="font-semibold text-blue-600">{inv.actualStock || 0}</span>
                          </div>
                          {inv.reservedStock > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">预留:</span>
                              <span className="font-semibold text-orange-600">{inv.reservedStock}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{inv.syncedStock || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-orange-600">{inv.onWayStock || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">{inv.availableForSync || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{inv.warehouseLocation || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(inv.lastSyncTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {inv.stockType !== 'SAMPLE' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedInventory(inv);
                                setSyncForm({ syncQuantity: inv.availableForSync || 0 });
                                setShowSyncModal(true);
                              }}
                              className={`text-sm font-medium flex items-center gap-1 ${
                                inv.availableForSync > 0 
                                  ? 'text-green-600 hover:text-green-900' 
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={inv.availableForSync <= 0 ? '没有可同步的库存' : '同步库存到商品'}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                              同步
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInventory(inv);
                                setAdjustForm({
                                  actualStock: inv.actualStock,
                                  reservedStock: inv.reservedStock
                                });
                                setShowAdjustModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              调整
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInventory(inv);
                                setPreSaleForm({ preSaleQuantity: 0 });
                                setShowPreSaleModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-900 text-sm font-medium flex items-center gap-1"
                            >
                              <Settings className="w-4 h-4" />
                              预售
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">样品不可操作</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && inventories.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* 同步库存弹窗 */}
      {showSyncModal && selectedInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">同步库存到商品</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <p className="text-sm text-gray-900">{selectedInventory.productName}</p>
              </div>
              {selectedInventory.skuCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU编码</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedInventory.skuCode}</p>
                </div>
              )}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">当前状态</div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <div className="text-gray-500">实际</div>
                    <div className="font-bold text-blue-600">{selectedInventory.actualStock || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">已同步</div>
                    <div className="font-bold text-gray-900">{selectedInventory.syncedStock || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">可同步</div>
                    <div className="font-bold text-green-600">{selectedInventory.availableForSync || 0}</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">同步数量</label>
                <input
                  type="number"
                  min="0"
                  max={selectedInventory.availableForSync}
                  value={syncForm.syncQuantity}
                  onChange={(e) => setSyncForm({ ...syncForm, syncQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  最多可同步: {selectedInventory.availableForSync}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={syncForm.notes || ''}
                  onChange={(e) => setSyncForm({ ...syncForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSync}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                确认同步
              </button>
              <button
                onClick={() => {
                  setShowSyncModal(false);
                  setSelectedInventory(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 调整库存弹窗 */}
      {showAdjustModal && selectedInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">调整仓库库存</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <p className="text-sm text-gray-900">{selectedInventory.productName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">实际库存</label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.actualStock || 0}
                  onChange={(e) => setAdjustForm({ ...adjustForm, actualStock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预留数量</label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.reservedStock || 0}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reservedStock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">调整原因</label>
                <input
                  type="text"
                  value={adjustForm.reason || ''}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAdjust}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                确认调整
              </button>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setSelectedInventory(null);
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 设置预售弹窗 */}
      {showPreSaleModal && selectedInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">设置预售库存</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称</label>
                <p className="text-sm text-gray-900">{selectedInventory.productName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预售数量</label>
                <input
                  type="number"
                  min="0"
                  value={preSaleForm.preSaleQuantity}
                  onChange={(e) => setPreSaleForm({ ...preSaleForm, preSaleQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={preSaleForm.notes || ''}
                  onChange={(e) => setPreSaleForm({ ...preSaleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePreSale}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                确认设置
              </button>
              <button
                onClick={() => {
                  setShowPreSaleModal(false);
                  setSelectedInventory(null);
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
