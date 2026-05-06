// types/admin/inventoryLog.ts

export interface InventoryLogResponse {
  id: number;
  productId?: number;
  productName?: string;
  bundleId?: number;
  bundleName?: string;
  skuCode?: string;
  changeType: string; // LOCK/RELEASE/CONSUME/RESTOCK/REFUND/ADJUSTMENT/PURCHASE_IN/PURCHASE_RETURN/SAMPLE_OUT/SYNC_TO_SALE/PRE_SALE/INVENTORY_CHECK
  changeTypeDesc: string; // 中文描述
  quantity?: number; // 变化数量（后端可能返回null）
  beforeStock?: number; // 变化前可用库存（后端可能返回null）
  afterStock?: number; // 变化后可用库存（后端可能返回null）
  beforeLockedStock?: number; // 变化前锁定库存（后端可能返回null）
  afterLockedStock?: number; // 变化后锁定库存（后端可能返回null）
  orderId?: number;
  orderNumber?: string;
  purchaseOrderNo?: string; // 采购单号
  operatedBy?: string;
  reason?: string;
  createdAt: string;
}

export interface InventoryLogQueryRequest {
  page: number;
  size: number;
  productId?: number;
  productName?: string; // 商品名称（模糊查询）
  bundleId?: number;
  orderId?: number;
  orderNumber?: string;
  changeType?: string;
  startTime?: string;
  endTime?: string;
}

export interface InventoryLogListResponse {
  content: InventoryLogResponse[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
