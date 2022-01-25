import clsx from "clsx";
import { useMemo, useState } from "react";
import { formatRelative } from "date-fns";
import { useHotkeys } from "react-hotkeys-hook";

import { useResource } from "~/components/core/ResourceProvider";

import Button from "~/components/elements/Button";
import PartImageWithIdentifiers from "~/components/parts/PartImageWithIdentifiers";
import PartCategoryHeading from "~/components/parts/PartCategoryHeading";
import PartColorSwatch from "~/components/parts/PartColorSwatch";
import ManageInventoryItemDialog from "~/components/inventory/ManageInventoryItemDialog";
import PanelProperty from "~/components/core/PanelProperty";

import { Inventory } from "~/models";
import { IInventoryItem, IPart } from "~/types";

export interface InventoryPanelProps {
  className?: string;
  item?: IInventoryItem;
  part?: IPart;
  inventory?: Inventory;
  onSave?: (
    item: Pick<IInventoryItem, "colorId" | "count" | "comment" | "partId">
  ) => any;
  onClose?: () => void;
}

export function InventoryPanel(props: InventoryPanelProps) {
  const { className, item, part, inventory, onSave, onClose } = props;

  const partsById = useResource("parts").byId;
  const colorsById = useResource("colors").byId;

  const [open, setOpen] = useState(false);

  const partColors = useMemo(() => {
    if (!part) return null;
    return partsById[part.id]?.colors;
  }, [part, partsById]);

  const color = useMemo(() => {
    if (!item?.colorId) return null;
    return colorsById[item.colorId];
  }, [item, colorsById]);

  useHotkeys("cmd+o", () => setOpen(true));

  return (
    <div
      className={clsx(
        className,
        "bg-white p-6 rounded-md shadow-md h-full flex flex-col justify-between",
        "overflow-y-auto overflow-x-hidden"
      )}
    >
      <div>
        <PartImageWithIdentifiers
          part={part}
          partColors={partColors}
          selectedColorId={item?.colorId}
        />
        <div className="flex justify-between items-end gap-4 mb-4">
          <div>
            <PartCategoryHeading part={part} />
            <h2 className="text-lego-navy font-bold text-2xl lg:text-3xl">
              {part?.name}
            </h2>
          </div>
          <span className="text-lego-navy font-bold text-4xl lg:text-5xl whitespace-nowrap">
            &times; {item?.count}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <PanelProperty title="Color" hiddenIf={!color}>
            <div className="text-lego-navy text-lg flex items-center">
              <PartColorSwatch
                className="rounded shadow w-6 h-6 mr-2"
                color={color}
              />
              {color?.name}
            </div>
          </PanelProperty>
          <PanelProperty title="Comments" hiddenIf={!item?.comment}>
            <pre className="font-sans text-lego-navy">{item?.comment}</pre>
          </PanelProperty>
          <PanelProperty title="Last updated" hiddenIf={!item?.updated}>
            <p className="text-lego-navy">
              {formatRelative(new Date(item?.updated ?? ""), new Date())}
            </p>
          </PanelProperty>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={() => setOpen(true)}>Update</Button>
        {onClose && <Button onClick={onClose}>Close</Button>}
      </div>
      <ManageInventoryItemDialog
        open={open}
        onClose={() => setOpen(false)}
        inventory={inventory}
        onSave={onSave}
        initialPart={part}
        initialColor={color ?? undefined}
        initialCount={item?.count}
        initialComment={item?.comment}
      />
    </div>
  );
}

export function VendorIDs(props: { name: string; ids: string[] }) {
  const { name, ids } = props;
  return (
    <div>
      <p className="text-sm font-medium text-lego-navy-300">{name} ID</p>
      <ul>
        {ids.map((id) => (
          <li key={id} className="text-xl lg:text-2xl text-lego-navy font-bold">
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
}
