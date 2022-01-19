import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { FixedSizeList } from "react-window";

import { ICategory, IPartWithColors } from "~/models";
import { useDebouncedValue } from "~/hooks/debounce";
import { useParts } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import SearchField from "~/components/elements/SearchField";
import CompactListSwitch from "~/components/core/CompactListSwitch";

import { PartItem } from "./PartItem";
import { PartPanel } from "./PartPanel";
import { PartCategoryFilter } from "./PartCategoryFilter";

const selectedAtom = atom<IPartWithColors | null>(null);
const showAtom = atom<boolean>(false);
const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function PartsView() {
  const search = useAtomValue(debouncedSearchAtom);
  const parts = useParts(search);

  const [compact, setCompact] = useState(true);
  const [category, setCategory] = useState<ICategory>();

  const setSelected = useUpdateAtom(selectedAtom);
  const setShow = useUpdateAtom(showAtom);

  const ref = useRef<FixedSizeList>(null);

  const scrollToTop = useCallback(() => {
    ref.current?.scrollToItem(0);
  }, []);

  const setCategoryAndScrollToTop = useCallback((category?: ICategory) => {
    setCategory(category);
    ref.current?.scrollToItem(0);
  }, []);

  const rows = useMemo(
    () =>
      parts
        .filter(({ part }) => !category || part.categoryId == category.id)
        .map((data) => ({
          part: data.part,
          compact,
          onClick: () => {
            setSelected(data);
            setShow(true);
          },
        })),
    [parts, compact, category, setSelected, setShow]
  );

  return (
    <main className="px-10">
      <div>
        <ViewTitle className="mb-4">Parts</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <SearchWrapper onSearch={scrollToTop} />
          <PartCategoryFilter
            className="w:full lg:w-96"
            selected={category}
            onSelect={setCategoryAndScrollToTop}
          />
          <CompactListSwitch
            className="mt-2 lg:mt-5 lg:ml-auto"
            label="Compact list"
            compact={compact}
            onChange={setCompact}
          />
        </div>
      </div>
      <div className="flex gap-8 h-[calc(100vh-206px)]">
        <div className="my-5 -mx-4 p-2 w-[calc(100%+32px)]">
          {rows.length === 0 && (
            <p className="px-3 text-lego-navy text-opacity-70">No parts found.</p>
          )}
          <VirtualizedList listRef={ref} data={rows} rowHeight={compact ? 72 : 144}>
            {PartItem}
          </VirtualizedList>
        </div>
        <PanelWrapper />
      </div>
    </main>
  );
}

function SearchWrapper(props: { onSearch?: () => any }) {
  const { onSearch } = props;

  const [search, setSearch] = useAtom(searchAtom);
  const debouncedSearch = useDebouncedValue(search, 500);
  const setDebouncedSearch = useUpdateAtom(debouncedSearchAtom);

  useEffect(() => {
    setDebouncedSearch(debouncedSearch ?? "");
    if (debouncedSearch) onSearch?.();
  }, [debouncedSearch, setDebouncedSearch, onSearch]);

  return (
    <SearchField
      className="w:full lg:w-96"
      label="Search for a part"
      placeholder="Name or ID"
      value={search}
      onChange={setSearch}
    />
  );
}

function PanelWrapper() {
  const [show, setShow] = useAtom(showAtom);
  const selected = useAtomValue(selectedAtom);
  return (
    <Transition
      appear
      show={show}
      className="mt-8 mb-9 w-1/2 flex-shrink-0 lg:flex-shrink lg:w-2/3 max-w-[50%] self-stretch"
      enter="transition-all ease-out duration-75"
      enterFrom="opacity-0 translate-x-80"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all ease-in duration-75"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-80"
    >
      <PartPanel
        className="mb-9"
        part={selected?.part}
        colors={selected?.colors}
        onClose={() => setShow(false)}
      />
    </Transition>
  );
}
