import { useMemo, useState } from "react";

import { ICategory, IPart } from "~/models";
import { useParts } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import SearchField from "~/components/elements/SearchField";
import CompactListSwitch from "~/components/core/CompactListSwitch";

import { PartItem } from "./PartItem";
import { PartPanel } from "./PartPanel";
import { PartCategoryFilter } from "./PartCategoryFilter";

export function PartsView() {
  const [search, setSearch] = useState("");

  const parts = useParts(search);

  const [compact, setCompact] = useState(true);
  const [selected, setSelected] = useState<IPart>();
  const [category, setCategory] = useState<ICategory>();

  const rows = useMemo(
    () =>
      parts
        .filter((part) => !category || part.categoryId == category.id)
        .map((part) => ({ part, compact, onClick: setSelected })),
    [parts, compact, category]
  );

  return (
    <main className="px-10">
      <div>
        <ViewTitle className="mb-4">Parts</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <SearchField
            className="w:full lg:w-96"
            label="Search for a part"
            placeholder="Name or ID"
            value={search}
            onChange={setSearch}
          />
          <PartCategoryFilter
            className="w:full lg:w-96"
            selected={category}
            onSelect={setCategory}
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
          <VirtualizedList data={rows} rowHeight={compact ? 72 : 144}>
            {PartItem}
          </VirtualizedList>
        </div>
        {selected && <PartPanel className="mb-9" part={selected} />}
      </div>
    </main>
  );
}
