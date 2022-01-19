import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { FixedSizeList } from "react-window";

import { IColor } from "~/models";
import { useDebouncedValue } from "~/hooks/debounce";
import { useColors } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import SearchField from "~/components/elements/SearchField";
import CompactListSwitch from "~/components/core/CompactListSwitch";

import { ColorPanel } from "./ColorPanel";
import { ColorItem } from "./ColorItem";

const selectedAtom = atom<IColor | null>(null);
const showAtom = atom<boolean>(false);
const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function ColorsView() {
  const search = useAtomValue(debouncedSearchAtom);
  const colors = useColors(search);

  const [compact, setCompact] = useState(true);

  const setSelected = useUpdateAtom(selectedAtom);
  const setShow = useUpdateAtom(showAtom);

  const ref = useRef<FixedSizeList>(null);
  const onSearch = useCallback(() => {
    ref.current?.scrollToItem(0);
  }, []);

  const rows = useMemo(
    () =>
      colors.map((color) => ({
        color,
        compact,
        onClick: () => {
          setSelected(color);
          setShow(true);
        },
      })),
    [colors, compact, setSelected, setShow]
  );

  return (
    <main className="px-10">
      <div className="w-full">
        <ViewTitle className="mb-4">Colors</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <SearchWrapper onSearch={onSearch} />
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
          <VirtualizedList listRef={ref} data={rows} rowHeight={compact ? 72 : 112}>
            {ColorItem}
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
      label="Search for a color"
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
      <ColorPanel color={selected} onClose={() => setShow(false)} />
    </Transition>
  );
}
