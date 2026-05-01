// services/purchaseRecordService.ts

import axiosClient from '@/lib/axios-client';
import {
  PurchaseRecordQueryRequest,
  PurchaseRecordResponse,
  PurchaseRecordRequest,
  ReceivePurchaseRequest,
  ReturnPurchaseRequest,
  PageResponse,
} from '@/types/admin/purchase';

export const purchaseRecordService = {
  /**
   * 查询采购记录列表
   */
  async getPurchaseRecords(request: PurchaseRecordQueryRequest): Promise<PageResponse<PurchaseRecordResponse>> {
    const params = new URLSearchParams();
    
    params.append('page', request.page.toString());
    params.append('size', request.size.toString());
    
    if (request.purchaseType) params.append('purchaseType', request.purchaseType);
    if (request.status) params.append('status', request.status);
    if (request.keyword) params.append('keyword', request.keyword);
    
    const url = `/api/admin/V1/purchase-records?${params.toString()}`;
    
    const response = await axiosClient.get(url);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch purchase records');
  },

  /**
   * 获取采购记录详情
   */
  async getPurchaseDetail(id: number): Promise<PurchaseRecordResponse> {
    const url = `/api/admin/V1/purchase-records/${id}`;
    
    const response = await axiosClient.get(url);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to fetch purchase detail');
  },

  /**
   * 创建采购记录
   */
  async createPurchase(request: PurchaseRecordRequest): Promise<PurchaseRecordResponse> {
    const url = `/api/admin/V1/purchase-records`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to create purchase record');
  },

  /**
   * 确认入库
   */
  async receivePurchase(id: number, request: ReceivePurchaseRequest): Promise<PurchaseRecordResponse> {
    const url = `/api/admin/V1/purchase-records/${id}/receive`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to receive purchase');
  },

  /**
   * 退回采购
   */
  async returnPurchase(id: number, request: ReturnPurchaseRequest): Promise<PurchaseRecordResponse> {
    const url = `/api/admin/V1/purchase-records/${id}/return`;
    
    const response = await axiosClient.post(url, request);
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to return purchase');
  },

  /**
   * 取消采购
   */
  async cancelPurchase(id: number, reason?: string): Promise<PurchaseRecordResponse> {
    const url = `/api/admin/V1/purchase-records/${id}/cancel`;
    
    const params = new URLSearchParams();
    if (reason) params.append('reason', reason);
    
    const response = await axiosClient.post(url, {}, { params });
    
    if (response.data?.success) {
      return response.data.data;
    }
    
    throw new Error(response.data?.message || 'Failed to cancel purchase');
  },
};
