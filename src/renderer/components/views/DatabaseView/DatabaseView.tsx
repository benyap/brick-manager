import { databaseTiles } from "~/config/dashboard";

import BaseView from "~/components/core/BaseView";
import IconTileGrid from "~/components/elements/IconTileGrid";
import ViewTitle from "~/components/core/ViewTitle";

export function DatabaseView() {
  return (
    <BaseView root="/database">
      <main className="px-10">
        <ViewTitle className="mb-4">Database</ViewTitle>
        <p className="text-lego-navy text-lg">
          Search the database for information about your LEGO pieces.
        </p>
        <p className="text-lego-navy-300">
          Data sourced from LEGO, BrickLink and Rebrickable.
        </p>
        <IconTileGrid className="mt-6" tiles={databaseTiles} />
      </main>
    </BaseView>
  );
}
