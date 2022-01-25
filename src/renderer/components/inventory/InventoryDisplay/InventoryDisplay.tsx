import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { FixedSizeList } from "react-window";
import { Transition } from "@headlessui/react";
import { useHotkeys } from "react-hotkeys-hook";
import clsx from "clsx";
import Fuse from "fuse.js";

import { getPartTags } from "~/loaders";
import { countString } from "~/utils/text";
import { useInventory } from "~/hooks/models/inventory";
import { useResource } from "~/components/core/ResourceProvider";

import ViewTitle from "~/components/core/ViewTitle";
import ManageInventoryItemDialog, {
  ManageInventoryItemDialogProps,
} from "~/components/inventory/ManageInventoryItemDialog";
import Tooltip from "~/components/elements/Tooltip";
import LiveSearchField from "~/components/core/LiveSearchField";
import PartCategoryFilter from "~/components/parts/PartCategoryFilter";
import CompactListSwitch from "~/components/core/CompactListSwitch";
import VirtualizedList from "~/components/elements/VirtualizedList";
import { AddIcon } from "~/components/icons/AddIcon";

import { ICategory, IInventoryItem, IPart } from "~/types";

import { InventoryItem } from "./InventoryItem";
import { InventoryPanel, InventoryPanelProps } from "./InventoryPanel";

const selectedAtom = atom<{ item: IInventoryItem; part: IPart } | null>(null);
const showAtom = atom<boolean>(false);
const searchAtom = atom<string>("");
const debouncedSearchAtom = atom<string>("");

export function useIsItemSelected(item: IInventoryItem) {
  const selected = useAtomValue(selectedAtom);
  const show = useAtomValue(showAtom);
  return show && selected?.item === item;
}

export interface InventoryDisplayProps {
  id?: string;
}

export function InventoryDisplay(props: InventoryDisplayProps) {
  const { id = "default" } = props;

  const partsById = useResource("parts").byId;
  const colorsById = useResource("colors").byId;
  const categoriesList = useResource("categories").list;
  const inventory = useInventory(id);

  const setSelected = useUpdateAtom(selectedAtom);
  const setShow = useUpdateAtom(showAtom);

  const [items, setItems] = useState<IInventoryItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();

  const [compact, setCompact] = useState(true);
  const [category, setCategory] = useState<ICategory>();

  const listRef = useRef<FixedSizeList>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);

  useHotkeys("cmd+f", () => searchRef.current?.focus());
  useHotkeys("cmd+n", () => addRef.current?.click());

  const query = useAtomValue(debouncedSearchAtom);
  const searcher = useMemo(() => {
    const searchItems = items.map((item) => {
      const { part } = partsById[item.partId] ?? {};
      const tags = part ? getPartTags(part) : [];
      const color = item.colorId ? colorsById[item.colorId] : null;
      return { item, part, color, tags };
    });
    return new Fuse(searchItems, {
      keys: ["tags.BrickLinkIds", "tags.LEGOIds", "tags.name", "color.name"],
    });
  }, [items, partsById, colorsById]);

  const itemsToShow = useMemo(() => {
    return query
      ? searcher.search(query).map((result) => result.item.item)
      : items.sort(
          (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
  }, [items, searcher, query]);

  const rows = useMemo(
    () =>
      itemsToShow
        .map((item) => ({
          item,
          part: partsById[item.partId]?.part,
        }))
        .filter(({ part }) => !category || part?.categoryId == category.id)
        .map((data) => ({
          item: data.item,
          compact,
          onClick: () => {
            setSelected(data);
            setShow(true);
          },
        })),
    [itemsToShow, partsById, compact, category, setSelected, setShow]
  );

  useEffect(() => {
    if (!inventory) return;
    setItems(inventory.getItems());
  }, [inventory]);

  useEffect(() => {
    const itemCategories: Record<string, number> = {};
    for (const item of items) {
      const match = partsById[item.partId];
      const category = match?.part.categoryId;
      if (!category) continue;
      if (category in itemCategories) itemCategories[category] += 1;
      else itemCategories[category] = 1;
    }
    setCategories(
      categoriesList
        .filter((category) => category.id in itemCategories)
        .map((category) => ({
          ...category,
          count: itemCategories[category.id],
        }))
    );
  }, [items, partsById, categoriesList]);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToItem(0);
  }, []);

  const setCategoryAndScrollToTop = useCallback((category?: ICategory) => {
    setCategory(category);
    listRef.current?.scrollToItem(0);
  }, []);

  function saveItem(
    item: Pick<IInventoryItem, "partId" | "colorId" | "count" | "comment">
  ) {
    inventory?.upsertItem(item).then(() => {
      setItems(inventory.getItems());
      setSelected((previous) => {
        if (!previous) return previous;
        if (
          previous.item.partId === item.partId &&
          previous.item.colorId === item.colorId
        )
          return { ...previous, item: { ...previous.item, ...item } };
        return previous;
      });
    });
  }

  return (
    <main className="px-10">
      <div className="flex gap-4 justify-between mb-4">
        <div>
          <ViewTitle className="mb-1">Inventory</ViewTitle>
          <p className="text-lego-navy-300">{inventory?.get("description")}</p>
        </div>
        <div className="flex gap-6 justify-between items-center">
          <div className="text-right text-sm font-semibold text-lego-navy-300">
            <p>{countString(items.length, "unique part")}</p>
            <p>
              {countString(
                items.reduce((total, item) => total + item.count, 0),
                "total piece"
              )}
            </p>
          </div>
          <AddInventoryItemDialogButton
            ref={addRef}
            onSave={saveItem}
            inventory={inventory}
          />
        </div>
      </div>
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
        {categories && (
          <PartCategoryFilter
            className="w:full lg:w-96"
            categories={categories}
            selected={category}
            onSelect={setCategoryAndScrollToTop}
          />
        )}
        <CompactListSwitch
          className="mt-2 lg:mt-5 lg:ml-auto"
          label="Compact list"
          compact={compact}
          onChange={setCompact}
        />
      </div>
      <div className="flex gap-8 h-[calc(100vh-234px)]">
        <div className="my-5 -mx-4 p-2 w-[calc(100%+32px)]">
          {rows.length === 0 && (
            <p className="px-3 text-lego-navy-300">No parts found.</p>
          )}
          <VirtualizedList
            listRef={listRef}
            data={rows}
            rowHeight={compact ? 72 : 144}
          >
            {InventoryItem}
          </VirtualizedList>
        </div>
        <PanelWrapper inventory={inventory} onSave={saveItem} />
      </div>
    </main>
  );
}

interface AddInventoryItemDialogButtonProps
  extends Pick<ManageInventoryItemDialogProps, "onSave" | "inventory"> {}

const AddInventoryItemDialogButton = forwardRef<
  HTMLButtonElement,
  AddInventoryItemDialogButtonProps
>((props, ref) => {
  const { onSave, inventory } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title="Add a part to your inventory" position="left">
        <button
          ref={ref}
          className={clsx(
            "self-center shadow bg-lego-navy bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30 p-1",
            "bm-focusable rounded-full ring-2 transition"
          )}
          onClick={() => setOpen(true)}
        >
          <AddIcon className="w-8 h-8 text-lego-navy" />
        </button>
      </Tooltip>
      <ManageInventoryItemDialog
        title="Add part to inventory"
        open={open}
        onClose={() => setOpen(false)}
        inventory={inventory}
        onSave={onSave}
      />
    </>
  );
});

interface PanelWrapperProps
  extends Pick<InventoryPanelProps, "inventory" | "onSave"> {}

function PanelWrapper(props: PanelWrapperProps) {
  const { inventory, onSave } = props;

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
      <InventoryPanel
        className="mb-9"
        item={selected?.item}
        part={selected?.part}
        inventory={inventory}
        onSave={onSave}
        onClose={() => setShow(false)}
      />
    </Transition>
  );
}
