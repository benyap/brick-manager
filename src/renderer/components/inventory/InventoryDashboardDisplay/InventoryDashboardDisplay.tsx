import { useMemo } from "react";

import { countString } from "~/utils/text";
import { useInventory } from "~/hooks/models/inventory";

import IconTileGrid from "~/components/elements/IconTileGrid";

export interface InventoryDashboardDisplayProps {
  id?: string;
}

export function InventoryDashboardDisplay(props: InventoryDashboardDisplayProps) {
  const { id = "default" } = props;

  const inventory = useInventory(id);
  const items = useMemo(() => inventory?.getItems() ?? [], [inventory]);

  return (
    <div className="flex flex-wrap gap-20 mb-8 items-center">
      <div className="text-lego-navy">
        <p className="text-5xl py-3">{countString(items.length, "unique part")}</p>
        <p className="text-5xl py-3">
          {countString(
            items.reduce((total, item) => total + item.count, 0),
            "total piece"
          )}
        </p>
      </div>
      <IconTileGrid
        tiles={[
          {
            name: "Go to inventory",
            to: "/inventory",
            icon: "PackageIcon",
          },
        ]}
      />
    </div>
  );
}
