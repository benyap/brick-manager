export interface ICollection {
  id: string;
  created: string;
  name: string;
  description: string;
  type: "moc" | "set";
}

export interface ICollectionItem {
  partId: string;
  colorId?: string;
  requiredCount: number;
  acquiredCount: number;
  updated: string;
  comment: string;
}

export interface ICollectionItemAssignment {
  inventoryId: string;
  collectionId: string;
  partId: string;
  colorId?: string;
  count: number;
  created: string;
}
