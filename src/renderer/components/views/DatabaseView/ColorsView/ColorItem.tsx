import { ListChildComponentProps } from "react-window";
import clsx from "clsx";

import { IColor, Vendor } from "~/models";

export interface ColorItemProps {
  color: IColor;
  onClick?: (color: IColor) => any;
  compact?: boolean;
}

export function ColorItem(props: ListChildComponentProps<ColorItemProps[]>) {
  const { index, data, style } = props;

  const { color, onClick, compact } = data[index];
  const { name, material, rgb, externalNames, externalIds } = color;

  const bestName = externalNames.BrickLink?.[0] ?? externalNames.LEGO?.[0] ?? name;
  const brickLinkId = externalIds.BrickLink?.[0];
  const legoId = externalIds.LEGO?.[0];

  return (
    <div style={style} className="p-2">
      <button
        className={clsx(
          "flex bg-white shadow-md w-full text-left transition-all",
          "hover:opacity-90 hover:cursor-pointer bm-clickable ring bm-focusable",
          {
            "p-4 rounded-lg": !compact,
            "px-4 py-3 rounded items-center": compact,
          }
        )}
        onClick={() => onClick?.(color)}
      >
        <div
          className={clsx("flex-shrink-0 border border-gray-200", {
            "w-16 h-16 rounded-lg": !compact,
            "w-8 h-8 rounded": compact,
          })}
          style={{ background: rgb, opacity: material === "solid" ? 1 : 0.8 }}
        />
        <div
          className={clsx("w-full overflow-hidden", {
            "ml-4": !compact,
            "ml-3": compact,
          })}
        >
          <h3
            className={clsx("font-semibold text-lego-navy truncate", {
              "text-2xl": !compact,
              "text-lg flex justify-between items-center": compact,
            })}
          >
            <span>{bestName}</span>
            {compact && (
              <span className="text-base font-normal text-lego-navy text-opacity-70 hidden lg:block">
                {brickLinkId && (
                  <span className="last:pr-0 pr-4">
                    <b>BrickLink</b> {brickLinkId}
                  </span>
                )}
                {legoId && (
                  <span>
                    <b>LEGO</b> {legoId}
                  </span>
                )}
              </span>
            )}
          </h3>
          {!compact && (
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-x-6 mt-1">
              {["BrickLink", "LEGO"].map((vendor: Vendor) => (
                <div
                  key={vendor}
                  className="text-lego-navy text-opacity-80 text-sm lg:text-base"
                >
                  <b>{vendor}</b>&nbsp;{externalIds[vendor]?.[0]}
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
