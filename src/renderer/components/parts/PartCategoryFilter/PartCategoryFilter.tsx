import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";

import { ICategory } from "~/types";
import { countString } from "~/utils/text";

import { useResource } from "~/components/core/ResourceProvider";
import { FilterIcon } from "~/components/icons/FilterIcon";
import { CheckIcon } from "~/components/icons/CheckIcon";

export interface PartCategoryFilterProps {
  className?: string;
  selected?: ICategory;
  categories?: ICategory[];
  onSelect?: (category?: ICategory) => any;
}

export function PartCategoryFilter(props: PartCategoryFilterProps) {
  const { className, selected, onSelect, categories } = props;
  const allCategories = useResource("categories").list;
  return (
    <Listbox
      as="div"
      className={clsx("relative", className)}
      value={selected}
      onChange={(category) => onSelect?.(category)}
    >
      <Listbox.Label className="block text-sm font-medium text-lego-navy-300">
        Filter by category
      </Listbox.Label>
      <div className="mt-1 relative">
        <Listbox.Button
          className={clsx(
            "relative w-full text-left pl-3 pr-10 py-2",
            "bg-white border border-slate-300 rounded-md shadow-sm",
            "focus:outline-none focus:ring-1 focus:ring-lego-navy focus:border-lego-navy"
          )}
        >
          <span className="block truncate text-lego-navy">
            {selected?.name ?? "All"}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <PartCategoryOption />
            {(categories ?? allCategories).map((category) => (
              <PartCategoryOption key={category.id} category={category} />
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

interface PartCategoryOptionProps {
  category?: ICategory;
}

function PartCategoryOption(props: PartCategoryOptionProps) {
  const { category } = props;
  return (
    <Listbox.Option
      value={category}
      className={({ active }) =>
        clsx("cursor-default select-none relative text-base py-2 pl-10 pr-4", {
          "text-white bg-lego-navy bg-opacity-90": active,
          "text-lego-navy": !active,
        })
      }
    >
      {({ selected, active }) => (
        <>
          <span className={clsx("block truncate", { "font-bold": selected })}>
            {category
              ? `${category.name} (${countString(category.count, "part")})`
              : "All"}
          </span>
          {selected && (
            <span
              className={clsx("absolute inset-y-0 left-0 flex items-center pl-3", {
                "text-white": active,
                "text-lego-navy": !active,
              })}
            >
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
}
