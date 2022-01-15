import { databaseTiles } from "~/config/dashboard";

import BaseView from "~/components/core/BaseView";
import IconTileGrid from "~/components/elements/IconTileGrid";

export function DashboardView() {
  return (
    <BaseView className="px-10 py-8" disableBreadcrumbs>
      <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold mb-4">
        Recent collections
      </h2>
      <p className="pb-8 text-lego-navy text-opacity-50">No recent collections</p>
      <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold my-4">
        Recent builds
      </h2>
      <p className="pb-8 text-lego-navy text-opacity-50">No recent builds</p>
      <h2 className="uppercase text-lego-navy tracking-widest text-sm font-semibold my-4">
        Browse the database
      </h2>
      <IconTileGrid tiles={databaseTiles} />
    </BaseView>
  );
}
