import { useEffect, useState } from "react";

import { Logger } from "~/utils/logger";
import { Inventory } from "~/models/Inventory";

import { useResource } from "~/components/core/ResourceProvider";

const DEFAULT_ID = "default";

export function useInventory(id: string = DEFAULT_ID) {
  const { inventory: inventoryLoader, inventoryItems: inventoryItemsLoader } =
    useResource("loaders");

  const [inventory, setInventory] = useState<Inventory>();

  useEffect(() => {
    const inventory = inventoryLoader.getEntity(id);

    inventory.setItemLoader(inventoryItemsLoader);

    if (inventoryLoader.exists(id)) {
      setInventory(inventory);
      return;
    }

    inventory
      .update({
        id,
        created: new Date().toISOString(),
        description: "Your LEGO inventory",
      })
      .then(() => {
        Logger.debug(useInventory.name, `Created inventory "${id}"`);
        setInventory(inventory);
      });
  }, [id, inventoryLoader, inventoryItemsLoader]);

  return inventory;
}
