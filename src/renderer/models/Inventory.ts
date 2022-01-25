import { Database, IInventory, IInventoryItem, Index } from "~/types";
import { keyBy } from "~/utils/transform";

import { DependencyUnavailableError } from "./errors";
import { Entity, EntityLoader } from "./Entity";
import { InventoryItemLoader } from "./InventoryItem";

export class InventoryLoader extends EntityLoader<"inventories"> {
  constructor(db: Database) {
    super("inventories", db);
  }

  protected createIndex(collection: IInventory[]): Index<IInventory> {
    return keyBy(collection, "id");
  }

  getEntity(id: string): Inventory {
    return new Inventory(id, this);
  }
}

export class Inventory extends Entity<"inventories"> {
  private _itemLoader?: InventoryItemLoader;

  private get itemLoader() {
    if (!this._itemLoader)
      throw new DependencyUnavailableError(Inventory.name, "itemLoader");
    return this._itemLoader;
  }

  setItemLoader(loader: InventoryItemLoader) {
    this._itemLoader = loader;
  }

  getItems() {
    return this.itemLoader.getInventory(this.id);
  }

  getItem(partId: string, colorId?: string) {
    const key = InventoryItemLoader.itemHash({
      inventoryId: this.id,
      partId,
      colorId,
    });
    return this.itemLoader.get(key);
  }

  async upsertItem(
    item: Pick<IInventoryItem, "partId" | "colorId" | "count" | "comment">
  ) {
    // Delete item if there is a count of 0
    if (item.count === 0) {
      await this.deleteItem(item);
      return;
    }

    let update = this.getItem(item.partId, item.colorId);

    // Update existing item if it exists
    if (update) {
      update.count = item.count;
      update.comment = item.comment;
      update.updated = new Date().toISOString();
    } else {
      // Create new item
      update = {
        inventoryId: this.id,
        partId: item.partId,
        colorId: item.colorId,
        count: item.count,
        comment: item.comment,
        updated: new Date().toISOString(),
      };
    }

    await this.itemLoader.update(InventoryItemLoader.itemHash(update), update);
  }

  async deleteItem(item: Pick<IInventoryItem, "partId" | "colorId">) {
    const id = InventoryItemLoader.itemHash({ inventoryId: this.id, ...item });
    await this.itemLoader.delete(id);
  }
}
