import { Low } from "lowdb";

import { IInventory, IInventoryItem } from "./Inventory";
import {
  ICollection,
  ICollectionItem,
  ICollectionItemAssignment,
} from "./Collection";

export interface DatabaseSchema {
  inventories: IInventory[];
  inventoryItems: IInventoryItem[];
  collections: ICollection[];
  collectionItems: ICollectionItem[];
  assignments: ICollectionItemAssignment[];
}

export type Database = Low<DatabaseSchema>;

export interface Index<T> {
  [key: string]: T;
}
