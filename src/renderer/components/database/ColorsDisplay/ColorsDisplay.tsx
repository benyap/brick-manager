import { useMemo, useState, useRef, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { FixedSizeList } from "react-window";
import { useHotkeys } from "react-hotkeys-hook";

import { IColor } from "~/types";
import { useColorSearch } from "~/hooks/data";

import ViewTitle from "~/components/core/ViewTitle";
import VirtualizedList from "~/components/elements/VirtualizedList";
import CompactListSwitch from "~/components/core/CompactListSwitch";
import LiveSearchField from "~/components/core/LiveSearchField";

import { ColorPanel } from "./ColorPanel";
import { ColorItem } from "./ColorItem";

const selectedAtom = atom<IColor | null>(null);
const showAtom = atom<boolean>(false);
const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function useIsColorSelected(id: string) {
  const selected = useAtomValue(selectedAtom);
  const show = useAtomValue(showAtom);
  return show && selected?.id === id;
}

export function ColorsDisplay() {
  const search = useAtomValue(debouncedSearchAtom);
  const colors = useColorSearch(search);

  const [compact, setCompact] = useState(true);

  const setSelected = useUpdateAtom(selectedAtom);
  const setShow = useUpdateAtom(showAtom);

  const listRef = useRef<FixedSizeList>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useHotkeys("cmd+f", () => searchRef.current?.focus());

  const onSearch = useCallback(() => {
    listRef.current?.scrollToItem(0);
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
    <>
      <div className="w-full">
        <ViewTitle className="mb-4">Colors</ViewTitle>
        <div className="flex gap-4 flex-col lg:flex-row items-left justify-between">
          <LiveSearchField
            ref={searchRef}
            searchAtom={searchAtom}
            debouncedSearchAtom={debouncedSearchAtom}
            onSearch={onSearch}
            className="w:full lg:w-96"
            label="Search for a color"
            placeholder="Name or ID"
            clearable
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
          <VirtualizedList
            listRef={listRef}
            data={rows}
            rowHeight={compact ? 72 : 112}
          >
            {ColorItem}
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
      <ColorPanel color={selected} onClose={() => setShow(false)} />
    </Transition>
  );
}
