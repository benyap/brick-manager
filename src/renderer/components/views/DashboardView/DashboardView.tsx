import { databaseTiles } from "~/config/dashboard";

import BaseView from "~/components/core/BaseView";
import IconTileGrid from "~/components/core/IconTileGrid";

export function DashboardView() {
  return (
    <BaseView disableBreadcrumbs>
      <h2 className="uppercase tracking-widest text-sm font-medium mb-4">
        Recent collections
      </h2>
      <p className="pb-8 text-black text-opacity-50">No recent collections</p>
      <h2 className="uppercase tracking-widest text-sm font-medium my-4">
        Recent builds
      </h2>
      <p className="pb-8 text-black text-opacity-50">No recent builds</p>
      <h2 className="uppercase tracking-widest text-sm font-medium my-4">
        Browse the database
      </h2>
      <IconTileGrid tiles={databaseTiles} />
    </BaseView>
  );
}
