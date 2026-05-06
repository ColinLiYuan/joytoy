// services/inventoryLogService.ts

import axiosClient from '@/lib/axios-client';
import { InventoryLogQueryRequest, InventoryLogListResponse } from '@/types/admin/inventoryLog';

export const inventoryLogService = {
  /**
   * 获取库存流水列表
   */
  async getInventoryLogs(request: InventoryLogQueryRequest): Promise<InventoryLogListResponse> {
    const params = new URLSearchParams();
    
    params.append('page', request.page.toString());
    params.append('size', request.size.toString());
    
    if (request.productId) params.append('productId', request.productId.toString());
    if (request.bundleId) params.append('bundleId', request.bundleId.toString());
    if (request.orderId) params.append('orderId', request.orderId.toString());
    if (request.orderNumber) params.append('orderNumber', request.orderNumber);
    if (request.productName) params.append('productName', request.productName);
    if (request.changeType) params.append('changeType', request.changeType);
    if (request.startTime) params.append('startTime', request.startTime);
    if (request.endTime) params.append('endTime', request.endTime);
    
    const url = `/api/admin/V1/inventory-logs?${params.toString()}`;
    
    const response = await axiosClient.get(url);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch inventory logs');
  },
};
