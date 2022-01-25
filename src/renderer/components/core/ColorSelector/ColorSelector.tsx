import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";

import { useResource } from "~/components/core/ResourceProvider";
import { DownChevronIcon } from "~/components/icons/DownChevronIcon";

import { IColor } from "~/types";

export interface ColorSelectorProps {
  className?: string;
  options?: IColor[] | null;
  selected?: IColor;
  onSelect?: (color?: IColor) => any;
  label?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  disabled?: boolean;
}

export function ColorSelector(props: ColorSelectorProps) {
  const {
    className,
    onSelect,
    options,
    selected,
    label,
    emptyLabel = "Default",
    disabled,
  } = props;
  const colors = useResource("colors").list;
  return (
    <Listbox
      as="div"
      className={clsx("relative", className, { "opacity-60": disabled })}
      value={selected}
      onChange={(color) => onSelect?.(color)}
      disabled={disabled}
    >
      <Listbox.Label className="block text-sm font-medium text-lego-navy-300">
        {label}
      </Listbox.Label>
      <div className="mt-1 relative">
        <Listbox.Button
          className={clsx(
            "relative w-full text-left pl-3 pr-10 py-2",
            "bg-white border border-slate-300 rounded-md shadow-sm",
            "focus:outline-none focus:ring-1 focus:ring-lego-navy focus:border-lego-navy",
            "flex gap-2 items-center"
          )}
        >
          <div
            className="w-4 h-4 rounded border border-lego-navy border-opacity-10"
            style={{ background: selected?.rgb }}
          />
          <span className="block truncate text-lego-navy">
            {selected?.name ?? emptyLabel}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <DownChevronIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-48 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <ColorOption emptyLabel={emptyLabel} />
            {(options ?? colors).map((color) => (
              <ColorOption key={color.id} color={color} emptyLabel={emptyLabel} />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

interface ColorOptionsProps {
  color?: IColor;
  emptyLabel?: React.ReactNode;
}

function ColorOption(props: ColorOptionsProps) {
  const { color, emptyLabel = "Default" } = props;
  return (
    <Listbox.Option
      value={color}
      className={({ active }) =>
        clsx(
          "cursor-default select-none relative text-base py-2 px-4 flex gap-3 items-center",
          {
            "text-white bg-lego-navy bg-opacity-90": active,
            "text-lego-navy": !active,
          }
        )
      }
    >
      {({ selected }) => (
        <>
          <div
            className="w-4 h-4 rounded border border-lego-navy border-opacity-10"
            style={{ background: color?.rgb }}
          />
          <span className={clsx("block truncate", { "font-bold": selected })}>
            {color?.name ?? emptyLabel}
          </span>
        </>
      )}
    </Listbox.Option>
  );
}
