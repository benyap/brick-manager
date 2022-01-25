import clsx from "clsx";

import { IPartColors } from "~/types";
import { useResource } from "~/components/core/ResourceProvider";
import Tooltip from "~/components/elements/Tooltip";

export interface PartColorSelectorProps {
  partColors?: IPartColors["colors"];
  selectedColorId?: string;
  onClick?: (image: string) => void;
}

export function PartColorSelector(props: PartColorSelectorProps) {
  const { partColors = {}, selectedColorId, onClick } = props;

  const colorsById = useResource("colors").byId;
  const partColorList = Object.keys(partColors);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {partColorList.map((colorId) => {
        const color = colorsById[colorId];
        const image = partColors[colorId] ?? "";
        return (
          <Tooltip key={colorId} title={color.name} position="above">
            <button
              className={clsx("h-8 w-8 rounded border border-slate-200 shadow", {
                "bm-focusable ring-2": image,
                "cursor-none": !image,
                "ring-2 ring-lego-navy ring-opacity-100":
                  selectedColorId === colorId,
              })}
              style={{
                background: color?.rgb,
                opacity: color?.material === "solid" ? "1" : "0.5",
              }}
              onClick={() => onClick?.(colorId)}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
