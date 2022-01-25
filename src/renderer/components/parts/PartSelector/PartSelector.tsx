import { Fragment, useEffect, useMemo } from "react";
import { Transition } from "@headlessui/react";
import { ListChildComponentProps } from "react-window";
import { atom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import clsx from "clsx";

import { usePartSearch } from "~/hooks/data";

import LiveSearchField from "~/components/core/LiveSearchField";
import VirtualizedList from "~/components/elements/VirtualizedList";
import SearchField from "~/components/elements/SearchField";
import PartImage from "~/components/parts/PartImage";
import { IPart } from "~/types";

export interface PartSelectorProps {
  className?: string;
  selected?: IPart;
  label?: React.ReactNode;
  onSelect?: (part?: IPart) => any;
  disabled?: boolean;
}

const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function PartSelector(props: PartSelectorProps) {
  const { className, label = "Select a part", selected, onSelect, disabled } = props;

  const setSearch = useUpdateAtom(searchAtom);
  const setDebouncedSearch = useUpdateAtom(debouncedSearchAtom);

  useEffect(() => {
    setSearch(selected?.name ?? "");
    setDebouncedSearch("");
  }, [selected, setSearch, setDebouncedSearch]);

  return (
    <div className={clsx("relative", className)}>
      {selected ? (
        <SearchField
          className="w:full"
          label={label}
          value={selected?.name}
          onClear={disabled ? undefined : () => onSelect?.()}
          disabled={disabled}
          clearButtonFocusable
          readOnly
        />
      ) : (
        // TODO: replace this with Combobox component when ready
        // https://github.com/tailwindlabs/headlessui/pull/1047
        <>
          <LiveSearchField
            searchAtom={searchAtom}
            debouncedSearchAtom={debouncedSearchAtom}
            className="w:full"
            label={label}
            placeholder="Name or ID"
            disabled={disabled}
            readOnly={selected}
            clearable
          />
          <PartSearchResultsField {...props} />
        </>
      )}
    </div>
  );
}

function PartSearchResultsField(props: PartSelectorProps) {
  const { selected, onSelect } = props;

  const query = useAtomValue(debouncedSearchAtom);
  const showResults = query.length > 0;
  const parts = usePartSearch(selected ? "" : query);

  const rows = useMemo<PartListItemProps[]>(
    () =>
      parts.map((data) => ({
        part: data.part,
        onClick: () => {
          onSelect?.(data.part);
        },
      })),
    [parts, onSelect]
  );

  return (
    <Transition
      appear
      as={Fragment}
      show={showResults && !selected}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={clsx(
          "h-80 w-96 mt-1 overflow-hidden absolute top-full z-10",
          "rounded bg-white border border-slate-300"
        )}
      >
        <VirtualizedList data={rows} rowHeight={64}>
          {PartListItem}
        </VirtualizedList>
      </div>
    </Transition>
  );
}

interface PartListItemProps {
  part: IPart;
  onClick?: () => any;
}

function PartListItem(props: ListChildComponentProps<PartListItemProps[]>) {
  const { index, data, style } = props;
  const { part, onClick } = data[index];
  const { BrickLink = [], LEGO = [] } = part.identifiers ?? {};
  return (
    <button
      style={style}
      className={clsx(
        "flex gap-4 p-2 items-center transition",
        "hover:bg-lego-navy hover:bg-opacity-5 active:bg-opacity-10",
        "focus:bg-lego-navy focus:bg-opacity-10 focus:outline-none"
      )}
      onClick={onClick}
    >
      <PartImage
        className="flex-shrink-0 w-10 h-10 flex items-center"
        classes={{ image: "rounded" }}
        part={part}
      />
      <div className="text-left truncate">
        <p className="text-lego-navy truncate">{part.name}</p>
        <p className="text-lego-navy-200 text-sm font-medium">
          {BrickLink[0] ? (
            <>BrickLink ID {BrickLink[0]}</>
          ) : LEGO[0] ? (
            <>LEGO ID {LEGO[0]}</>
          ) : (
            ""
          )}
        </p>
      </div>
    </button>
  );
}
