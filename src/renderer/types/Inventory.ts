export interface IInventory {
  id: string;
  description: string;
  created: string;
}

export interface IInventoryItem {
  inventoryId: string;
  partId: string;
  colorId?: string;
  count: number;
  comment: string;
  updated: string;
}
