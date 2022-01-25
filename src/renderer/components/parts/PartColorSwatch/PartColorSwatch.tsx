import clsx from "clsx";
import Tooltip, { TooltipProps } from "~/components/elements/Tooltip";
import { ColorPaletteIcon } from "~/components/icons/ColorPaletteIcon";
import { IColor } from "~/types";

export interface PartColorSwatchProps {
  className?: string;
  color?: IColor | null;
  tooltip?: boolean;
  tooltipProps?: Omit<TooltipProps, "title">;
}

export function PartColorSwatch(props: PartColorSwatchProps) {
  const { className, color, tooltip, tooltipProps } = props;
  return (
    <Tooltip title={tooltip ? color?.name ?? "Default color" : ""} {...tooltipProps}>
      <div
        className={clsx(className, {
          "border border-slate-200 shadow": Boolean(color),
        })}
        style={{ background: color?.rgb }}
      >
        {!color && <ColorPaletteIcon className="text-slate-400" />}
      </div>
    </Tooltip>
  );
}
