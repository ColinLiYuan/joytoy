// types/admin/warehouseInventory.ts

export interface WarehouseInventoryResponse {
  id: number;
  skuCode?: string;
  productName: string;
  productId?: number;
  
  actualStock: number; // 实际在库
  reservedStock: number; // 预留数量
  availableForSync: number; // 可用于同步
  
  syncedStock: number; // 已同步到商品
  onWayStock: number; // 已采购未入库
  
  warehouseLocation?: string;
  lastSyncTime?: string;
  updatedAt: string;
}

export interface WarehouseInventoryQueryRequest {
  page: number;
  size: number;
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

export interface SyncInventoryRequest {
  inventoryId?: number; // 仓库库存ID
  skuCode?: string; // SKU编码（二选一）
  syncQuantity: number; // 同步数量
  notes?: string; // 备注
}

export interface AdjustInventoryRequest {
  actualStock?: number;
  reservedStock?: number;
  reason?: string;
}

export interface SetPreSaleRequest {
  preSaleQuantity: number;
  notes?: string;
}
