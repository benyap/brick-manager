import { useMemo, useState } from "react";

import { IColor } from "~/models";
import { useColors } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import SearchField from "~/components/elements/SearchField";
import CompactListSwitch from "~/components/core/CompactListSwitch";

import { ColorPanel } from "./ColorPanel";
import { ColorItem } from "./ColorItem";

export function ColorsView() {
  const [search, setSearch] = useState("");

  const colors = useColors(search);

  const [compact, setCompact] = useState(true);
  const [selected, setSelected] = useState<IColor>();

  const rows = useMemo(
    () => colors.map((color) => ({ color, compact, onClick: setSelected })),
    [colors, compact]
  );

  return (
    <main className="px-10">
      <div className="w-full">
        <ViewTitle className="mb-4">Colors</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <SearchField
            className="w:full lg:w-96"
            label="Search for a color"
            placeholder="Name or ID"
            value={search}
            onChange={setSearch}
          />
          <CompactListSwitch
            className="mt-2 lg:mt-5 lg:ml-auto"
            label="Compact list"
            compact={compact}
            onChange={setCompact}
          />
        </div>
      </div>
      <div className="flex gap-8">
        <div className="my-5 -mx-4 overflow-scroll h-[calc(100vh-246px)] w-[calc(100%+32px)] p-2">
          <VirtualizedList data={rows} rowHeight={compact ? 72 : 112}>
            {ColorItem}
          </VirtualizedList>
        </div>
        <ColorPanel className="mb-9" color={selected} />
      </div>
    </main>
  );
}
