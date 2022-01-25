import { Switch } from "@headlessui/react";
import clsx from "clsx";

export interface CompactListSwitchProps {
  className?: string;
  compact?: boolean;
  onChange?: (compact: boolean) => void;
  label?: string;
}

export function CompactListSwitch(props: CompactListSwitchProps) {
  const { className, compact, onChange, label = "" } = props;
  return (
    <Switch.Group as="div" className={clsx("flex items-center", className)}>
      {label && (
        <Switch.Label
          as="span"
          className={clsx(
            "mr-3 text-sm font-medium text-right select-none whitespace-nowrap cursor-pointer",
            "text-lego-navy-300  hover:text-lego-navy-200 transition-opacity"
          )}
        >
          {label}
        </Switch.Label>
      )}
      <Switch
        checked={Boolean(compact)}
        onChange={(compact) => onChange?.(compact)}
        className={clsx(
          "relative inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer",
          "transition-colors ease-in-out duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lego-navy",
          { "bg-lego-navy": compact, "bg-slate-300": !compact }
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
            { "translate-x-5": compact, "translate-x-0": !compact }
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
