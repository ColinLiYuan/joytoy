'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { inventoryLogService } from '@/services/inventoryLogService';
import { InventoryLogResponse, InventoryLogQueryRequest } from '@/types/admin/inventoryLog';
import { Package, ArrowUpRight, ArrowDownRight, RefreshCw, Search, Filter, Calendar } from 'lucide-react';
import Pagination from '@/components/common/pagination';

const CHANGE_TYPE_COLORS: Record<string, string> = {
  LOCK: 'bg-yellow-100 text-yellow-800',
  RELEASE: 'bg-blue-100 text-blue-800',
  CONSUME: 'bg-red-100 text-red-800',
  RESTOCK: 'bg-green-100 text-green-800',
  REFUND: 'bg-purple-100 text-purple-800',
  ADJUSTMENT: 'bg-gray-100 text-gray-800',
  PURCHASE_IN: 'bg-indigo-100 text-indigo-800',
  PURCHASE_RETURN: 'bg-orange-100 text-orange-800',
  SAMPLE_OUT: 'bg-pink-100 text-pink-800',
  SYNC_TO_SALE: 'bg-cyan-100 text-cyan-800',
  PRE_SALE: 'bg-violet-100 text-violet-800',
  INVENTORY_CHECK: 'bg-teal-100 text-teal-800',
};

export default function InventoryLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<InventoryLogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 筛选条件
  const [filters, setFilters] = useState<InventoryLogQueryRequest>({
    page: 0,
    size: 20,
    changeType: '',
    orderNumber: '',
    productName: '',
    skuCode: '',
    startTime: '',
    endTime: '',
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const result = await inventoryLogService.getInventoryLogs(filters);
      setLogs(result.content || []);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (error) {
      console.error('Failed to fetch inventory logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300); // 防抖 300ms
    
    return () => clearTimeout(timer);
  }, [filters.page, filters.size, filters.changeType, filters.orderNumber, filters.productName, filters.skuCode, filters.startTime, filters.endTime]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0, // 重置到第一页
    }));
  };

  const handleSearch = () => {
    // 清除防抖，立即执行
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      changeType: '',
      orderNumber: '',
      productName: '',
      skuCode: '',
      startTime: '',
      endTime: '',
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
      second: '2-digit',
    });
  };

  const getStockChangeIcon = (changeType: string) => {
    const type = changeType?.toUpperCase();
    if (['LOCK', 'CONSUME', 'PURCHASE_RETURN', 'SAMPLE_OUT'].includes(type || '')) {
      return <ArrowDownRight className="w-4 h-4" />;
    }
    return <ArrowUpRight className="w-4 h-4" />;
  };

  const getStockChangeColor = (changeType: string) => {
    const type = changeType?.toUpperCase();
    if (['LOCK', 'CONSUME', 'PURCHASE_RETURN', 'SAMPLE_OUT'].includes(type || '')) {
      return 'text-red-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">库存流水</h1>
              <p className="mt-2 text-sm text-gray-600">查看所有库存变动记录（销售、采购、调整等）</p>
            </div>
            <button
              onClick={fetchLogs}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 变化类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">变化类型</label>
              <select
                value={filters.changeType}
                onChange={(e) => handleFilterChange('changeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">全部类型</option>
                <option value="LOCK">锁定库存</option>
                <option value="RELEASE">释放库存</option>
                <option value="CONSUME">扣减库存</option>
                <option value="RESTOCK">补货</option>
                <option value="REFUND">退款恢复</option>
                <option value="ADJUSTMENT">库存调整</option>
                <option value="PURCHASE_IN">采购入库</option>
                <option value="PURCHASE_RETURN">采购退回</option>
                <option value="SAMPLE_OUT">样品发出</option>
                <option value="SYNC_TO_SALE">同步到销售</option>
                <option value="PRE_SALE">预售设置</option>
                <option value="INVENTORY_CHECK">库存盘点</option>
              </select>
            </div>

            {/* 订单号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">订单号</label>
              <input
                type="text"
                value={filters.orderNumber}
                onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                placeholder="输入订单号搜索"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 商品名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">商品名称</label>
              <input
                type="text"
                value={filters.productName || ''}
                onChange={(e) => handleFilterChange('productName', e.target.value)}
                placeholder="输入商品名称搜索"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* SKU编码 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU编码</label>
              <input
                type="text"
                value={filters.skuCode || ''}
                onChange={(e) => handleFilterChange('skuCode', e.target.value)}
                placeholder="输入SKU编码搜索"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 开始时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
              <input
                type="datetime-local"
                value={filters.startTime}
                onChange={(e) => handleFilterChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 结束时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
              <input
                type="datetime-local"
                value={filters.endTime}
                onChange={(e) => handleFilterChange('endTime', e.target.value)}
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
                    变化类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    商品/套装
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    SKU编码
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    变更数量/销售库存
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    采购单号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    原因
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>加载中...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">暂无库存流水记录</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${CHANGE_TYPE_COLORS[log.changeType?.toUpperCase() || ''] || 'bg-gray-100 text-gray-800'}`}>
                          {getStockChangeIcon(log.changeType)}
                          {log.changeTypeDesc || log.changeType?.toUpperCase() || '未知'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.productName ? (
                          <div className="text-sm font-medium text-gray-900">
                            <div>{log.productName}</div>
                            {log.bundleName && (
                              <div className="text-xs text-gray-500 mt-1">
                                套装: {log.bundleName}
                              </div>
                            )}
                          </div>
                        ) : log.bundleName ? (
                          <div className="text-sm font-medium text-gray-900">
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4 text-indigo-600" />
                              {log.bundleName}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-mono">{log.skuCode || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          {/* 变化数量 */}
                          <div className={`flex items-center gap-1 font-semibold ${getStockChangeColor(log.changeType)}`}>
                            {getStockChangeIcon(log.changeType)}
                            {log.quantity != null ? (log.quantity > 0 ? '+' : '') + log.quantity : '-'}
                          </div>
                          {/* 可用库存变化 */}
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">可用:</span> {log.beforeStock ?? '-'} → {log.afterStock ?? '-'}
                          </div>
                          {/* 锁定库存变化 */}
                          {(log.beforeLockedStock != null || log.afterLockedStock != null) && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">锁定:</span> {log.beforeLockedStock ?? '-'} → {log.afterLockedStock ?? '-'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.orderNumber ? (
                          <span className="text-sm font-mono text-indigo-600">{log.orderNumber}</span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.purchaseOrderNo ? (
                          <span className="text-sm font-mono text-green-600">{log.purchaseOrderNo}</span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 line-clamp-2">{log.reason || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(log.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && logs.length > 0 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
