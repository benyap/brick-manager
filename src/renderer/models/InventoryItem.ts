import { Database, IInventoryItem, Index } from "~/types";
import { keyBy } from "~/utils/transform";

import { EntityLoader } from "./Entity";

export class InventoryItemLoader extends EntityLoader<"inventoryItems"> {
  static itemHash(item: Pick<IInventoryItem, "inventoryId" | "partId" | "colorId">) {
    return [item.inventoryId, item.partId, item.colorId ?? "none"].join(".");
  }

  constructor(db: Database) {
    super("inventoryItems", db);
  }

  protected createIndex(collection: IInventoryItem[]): Index<IInventoryItem> {
    return keyBy(collection, (item) => InventoryItemLoader.itemHash(item));
  }

  getInventory(id: string) {
    return Object.values(this.index).filter((item) => item.inventoryId === id);
  }
}
