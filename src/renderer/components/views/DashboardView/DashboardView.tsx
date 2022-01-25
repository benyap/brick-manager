import { databaseTiles } from "~/config/dashboard";

import BaseView from "~/components/core/BaseView";
import IconTileGrid from "~/components/elements/IconTileGrid";
import InventoryDashboardDisplay from "~/components/inventory/InventoryDashboardDisplay";

export function DashboardView() {
  return (
    <BaseView className="px-10 py-8" disableBreadcrumbs>
      <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold mb-4">
        Your inventory
      </h2>
      <InventoryDashboardDisplay />
      {/* <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold my-4">
        Recent collections
      </h2>
      <p className="pb-8 text-lego-navy-200">No collections</p> */}
      <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold my-4">
        Browse the database
      </h2>
      <IconTileGrid tiles={databaseTiles} />
    </BaseView>
  );
}
