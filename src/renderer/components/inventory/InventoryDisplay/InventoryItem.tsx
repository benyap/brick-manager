import clsx from "clsx";
import { ListChildComponentProps } from "react-window";

import { useResource } from "~/components/core/ResourceProvider";
import PartImage from "~/components/parts/PartImage";
import PartColorSwatch from "~/components/parts/PartColorSwatch";

import { IInventoryItem, IPart } from "~/types";

import { useIsItemSelected } from "./InventoryDisplay";

export interface InventoryItemProps {
  item: IInventoryItem;
  compact?: boolean;
  onClick?: (part: IPart) => any;
}

export function InventoryItem(props: ListChildComponentProps<InventoryItemProps[]>) {
  const { index, data, style } = props;
  const { item, compact, onClick } = data[index];

  const selected = useIsItemSelected(item);
  const partsById = useResource("parts").byId;
  const colorsById = useResource("colors").byId;

  const { part, colors } = partsById[item.partId] ?? {};

  const name = part?.name ?? (
    <span className="opacity-50 font-semibold">Unknown part</span>
  );

  const color = item.colorId ? colorsById[item.colorId] : null;

  return (
    <div style={style} className="p-2">
      <div
        className={clsx(
          "flex bg-white shadow-md w-full text-left transition",
          "hover:opacity-90 hover:cursor-pointer bm-clickable",
          {
            "p-5 rounded-lg": !compact,
            "px-4 py-3 rounded items-center": compact,
            "ring ring-lego-navy": selected,
          }
        )}
        onClick={() => part && onClick?.(part)}
      >
        <PartImage
          className={clsx("flex-shrink-0", {
            "w-8 h-8": compact,
            "w-24 h-24": !compact,
          })}
          classes={{ image: "rounded-md" }}
          fade
          part={part}
          partColors={colors}
          selectedColorId={item.colorId}
        />
        {compact ? (
          <h3 className="ml-4 text-lego-navy flex items-center overflow-hidden">
            <span className="font-bold mr-2">
              {part?.identifiers?.BrickLink?.[0] ?? item?.partId}
            </span>
            <span className="truncate">{name}</span>
          </h3>
        ) : (
          <div className="ml-6 text-lego-navy overflow-hidden">
            <p className="font-bold truncate">
              {part?.identifiers?.BrickLink?.join(", ") ?? item?.partId}
            </p>
            <h3 className="text-lg truncate">{name}</h3>
          </div>
        )}
        <div
          className={clsx("text-lego-navy ml-auto hidden sm:flex", {
            "text-base lg:text-lg flex-col items-end": !compact,
            "items-center": compact,
          })}
        >
          <span className="pl-2 whitespace-nowrap">&times; {item?.count}</span>
          <PartColorSwatch
            className={clsx("rounded", {
              "w-4 h-4 ml-2 rounded-sm": compact,
              "w-6 h-6 mt-2 rounded": !compact,
            })}
            color={color}
            tooltip
            tooltipProps={{ position: compact ? "above" : "left" }}
          />
        </div>
      </div>
    </div>
  );
}
