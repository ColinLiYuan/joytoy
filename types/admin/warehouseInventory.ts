// types/admin/warehouseInventory.ts

// 库存用途类型
export type StockType = 'FOR_SALE' | 'SAMPLE' | 'ACTIVITY' | 'DEFECT' | 'TRANSFER';

// 库存类型中文映射
export const STOCK_TYPE_MAP: Record<StockType, string> = {
  FOR_SALE: '在售',
  SAMPLE: '样品',
  ACTIVITY: '活动预留',
  DEFECT: '次品',
  TRANSFER: '调拨在途'
};

export interface WarehouseInventoryResponse {
  id: number;
  skuCode?: string;
  productName: string;
  productId?: number;
  
  stockType?: StockType; // 库存用途类型
  
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
  stockType?: StockType; // 库存用途类型筛选
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
