import { ListChildComponentProps } from "react-window";
import clsx from "clsx";

import { IPart } from "~/types";
import PartImage from "~/components/parts/PartImage";

import { useIsPartSelected } from "./PartsDisplay";

export interface PartItemProps {
  part: IPart;
  compact?: boolean;
  onClick?: (part: IPart) => any;
}

export function PartItem(props: ListChildComponentProps<PartItemProps[]>) {
  const { index, data, style } = props;
  const { part, compact, onClick } = data[index];
  const selected = useIsPartSelected(part);
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
        onClick={() => onClick?.(part)}
      >
        <PartImage
          className={clsx("flex-shrink-0", {
            "w-8 h-8": compact,
            "w-24 h-24": !compact,
          })}
          classes={{ image: "rounded-md" }}
          fade
          part={part}
        />
        {compact ? (
          <h3 className="ml-4 text-lego-navy truncate">
            <span className="font-bold mr-2">
              {part.identifiers?.BrickLink?.[0]}
            </span>
            {part.name}
          </h3>
        ) : (
          <div className="ml-6 text-lego-navy overflow-hidden">
            <p className="font-bold truncate">
              {part.identifiers?.BrickLink?.join(", ")}
            </p>
            <h3 className="text-lg truncate">{part.name}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
