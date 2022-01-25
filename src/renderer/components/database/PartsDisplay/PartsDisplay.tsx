import { useCallback, useMemo, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { FixedSizeList } from "react-window";
import { useHotkeys } from "react-hotkeys-hook";

import { ICategory, IPart, IPartWithColors } from "~/types";
import { usePartSearch } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import CompactListSwitch from "~/components/core/CompactListSwitch";
import PartCategoryFilter from "~/components/parts/PartCategoryFilter";
import LiveSearchField from "~/components/core/LiveSearchField";

import { PartItem } from "./PartItem";
import { PartPanel } from "./PartPanel";

const selectedAtom = atom<IPartWithColors | null>(null);
const showAtom = atom<boolean>(false);
const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function useIsPartSelected(part: IPart) {
  const selected = useAtomValue(selectedAtom);
  const show = useAtomValue(showAtom);
  return show && selected?.part === part;
}

export function PartsDisplay() {
  const search = useAtomValue(debouncedSearchAtom);
  const parts = usePartSearch(search);

  const [compact, setCompact] = useState(true);
  const [category, setCategory] = useState<ICategory>();

  const setSelected = useUpdateAtom(selectedAtom);
  const setShow = useUpdateAtom(showAtom);

  const listRef = useRef<FixedSizeList>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys("cmd+f", () => searchRef.current?.focus());

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToItem(0);
  }, []);

  const setCategoryAndScrollToTop = useCallback((category?: ICategory) => {
    setCategory(category);
    listRef.current?.scrollToItem(0);
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
    <>
      <div>
        <ViewTitle className="mb-4">Parts</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <LiveSearchField
            ref={searchRef}
            searchAtom={searchAtom}
            debouncedSearchAtom={debouncedSearchAtom}
            onSearch={scrollToTop}
            className="w:full lg:w-96"
            label="Search for a part"
            placeholder="Name or ID"
            clearable
          />
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
            <p className="px-3 text-lego-navy-300">No parts found.</p>
          )}
          <VirtualizedList
            listRef={listRef}
            data={rows}
            rowHeight={compact ? 72 : 144}
          >
            {PartItem}
          </VirtualizedList>
        </div>
        <PanelWrapper />
      </div>
    </>
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
      enter="transition ease-out duration-75"
      enterFrom="opacity-0 translate-x-80"
      enterTo="opacity-100 translate-x-0"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-80"
    >
      <PartPanel
        className="mb-9"
        part={selected?.part}
        partColors={selected?.colors}
        onClose={() => setShow(false)}
      />
    </Transition>
  );
}
