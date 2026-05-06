// services/warehouseInventoryService.ts

import axiosClient from '@/lib/axios-client';
import {
  WarehouseInventoryQueryRequest,
  WarehouseInventoryResponse,
  SyncInventoryRequest,
  AdjustInventoryRequest,
  SetPreSaleRequest,
  PageResponse,
} from '@/types/admin/warehouseInventory';

export const warehouseInventoryService = {
  /**
   * 查询仓库库存列表
   */
  async getInventoryList(request: WarehouseInventoryQueryRequest): Promise<PageResponse<WarehouseInventoryResponse>> {
    const params = new URLSearchParams();
    
    params.append('page', request.page.toString());
    params.append('size', request.size.toString());
    
    if (request.keyword) params.append('keyword', request.keyword);
    if (request.stockType) params.append('stockType', request.stockType);
    
    const url = `/api/admin/V1/warehouse-inventory?${params.toString()}`;
    
    const response = await axiosClient.get(url);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch inventory list');
  },

  /**
   * 同步库存（刷库存到商品）
   */
  async syncInventory(request: SyncInventoryRequest): Promise<WarehouseInventoryResponse> {
    const url = `/api/admin/V1/warehouse-inventory/sync`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to sync inventory');
  },

  /**
   * 手动调整仓库库存
   */
  async adjustInventory(id: number, request: AdjustInventoryRequest): Promise<WarehouseInventoryResponse> {
    const url = `/api/admin/V1/warehouse-inventory/${id}/adjust`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to adjust inventory');
  },

  /**
   * 设置预售
   */
  async setPreSale(id: number, request: SetPreSaleRequest): Promise<WarehouseInventoryResponse> {
    const url = `/api/admin/V1/warehouse-inventory/${id}/pre-sale`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to set pre-sale');
  },
};
