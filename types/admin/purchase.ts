// types/admin/purchase.ts

export interface PurchaseRecordRequest {
  purchaseType?: string; // SAMPLE/RESTOCK
  supplier?: string; // 供应商名称
  supplierContact?: string; // 供应商联系方式
  productId?: number; // 商品ID（可选）
  skuCode?: string; // SKU编码（可选）
  productName: string; // 商品名称（必填）
  quantity: number; // 采购数量
  unitPrice?: number; // 采购单价
  purchaseDate?: string; // 采购日期
  warehouseLocation?: string; // 仓库位置
  reason?: string; // 采购原因
  notes?: string; // 备注
}

export interface PurchaseRecordResponse {
  id: number;
  purchaseNo: string; // 采购单号
  purchaseDate: string;
  supplier?: string;
  supplierContact?: string;
  purchaseType: string;
  purchaseTypeDesc: string; // 中文描述
  
  productId?: number;
  skuCode?: string;
  productName: string;
  
  quantity: number; // 采购数量
  unitPrice?: number;
  totalAmount?: number;
  
  receivedQuantity: number; // 已入库
  returnedQuantity: number; // 已退回
  netQuantity: number; // 净入库
  warehouseLocation?: string;
  
  status: string;
  statusDesc: string; // 中文描述
  reason?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseRecordQueryRequest {
  page: number;
  size: number;
  purchaseType?: string;
  status?: string;
  keyword?: string;
}

export interface PageResponse<T> {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ReceivePurchaseRequest {
  receivedQuantity: number; // 本次入库数量
  warehouseLocation?: string; // 仓库位置
  notes?: string; // 备注
}

export interface ReturnPurchaseRequest {
  returnQuantity: number; // 退回数量
  reason?: string; // 退回原因
  notes?: string; // 备注
}
