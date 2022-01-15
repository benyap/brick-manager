export interface IInventory {
  id: string;
  description: string;
  created: string;
  items: IInventoryItem[];
}

export type IInventoryItem = IInventoryItemPart;

export interface IInventoryItemPart {
  type: "part";
  id: string;
  created: string;
  instances: IInventoryItemPartInstance[];
}

export interface IInventoryItemPartInstance {
  colorRef: string;
  count: number;
  comment?: string;
  missing?: boolean;
  buildRef?: string;
}
