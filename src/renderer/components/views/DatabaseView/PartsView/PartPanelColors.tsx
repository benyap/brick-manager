import clsx from "clsx";

import { IPartColors } from "~/models";
import { useResource } from "~/components/core/ResourceProvider";
import Tooltip from "~/components/elements/Tooltip";

export interface PartPanelColorsProps {
  partColors?: IPartColors["colors"];
  currentImage?: string;
  onClick?: (image: string) => void;
}

export function PartPanelColors(props: PartPanelColorsProps) {
  const { partColors = {}, currentImage, onClick } = props;

  const colors = useResource("colors");
  const partColorList = Object.keys(partColors);

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {partColorList.map((colorId) => {
        const color = colors.byId[colorId];
        const image = partColors[colorId] ?? "";
        return (
          <Tooltip key={colorId} title={color.name} position="above">
            <button
              className={clsx("h-8 w-8 rounded border border-slate-200", {
                "bm-focusable ring-2": image,
                "cursor-none": !image,
                "ring-2 ring-lego-navy ring-opacity-100": currentImage === image,
              })}
              style={{
                background: color?.rgb,
                opacity: color?.material === "solid" ? "1" : "0.5",
              }}
              onClick={() => onClick?.(image)}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
