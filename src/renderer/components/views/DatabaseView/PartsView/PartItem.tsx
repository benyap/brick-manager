import clsx from "clsx";
import { ListChildComponentProps } from "react-window";

import { IPart } from "~/models";

import { CubeIcon } from "~/components/icons/CubeIcon";

export interface PartItemProps {
  part: IPart;
  compact?: boolean;
  onClick?: (part: IPart) => any;
}

export function PartItem(props: ListChildComponentProps<PartItemProps[]>) {
  const { index, data, style } = props;

  const { part, onClick, compact } = data[index];

  return (
    <div style={style} className="p-2">
      <button
        className={clsx(
          "flex bg-white shadow-md w-full overflow-scroll text-left transition-all",
          "hover:opacity-90 hover:cursor-pointer bm-clickable ring bm-focusable",
          {
            "p-5 rounded-lg": !compact,
            "px-4 py-3 rounded items-center": compact,
          }
        )}
        onClick={() => onClick?.(part)}
      >
        <div
          className={clsx("flex-shrink-0", {
            "w-8 h-8": compact,
            "w-24 h-24": !compact,
          })}
        >
          {part.image ? (
            <img
              className="opacity-0 transition-opacity"
              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              src={part.image}
              alt={part.name}
            />
          ) : (
            <CubeIcon className="text-lego-navy opacity-25" />
          )}
        </div>
        {compact ? (
          <h3 className="ml-4 text-lego-navy truncate">
            <span className="font-bold mr-2">{part.externalIds.BrickLink?.[0]}</span>{" "}
            {part.name}
          </h3>
        ) : (
          <div className="ml-6 text-lego-navy overflow-hidden">
            <p className="font-bold truncate">
              {part.externalIds.BrickLink?.join(", ")}
            </p>
            <h3 className="text-lg truncate">{part.name}</h3>
          </div>
        )}
      </button>
    </div>
  );
}
