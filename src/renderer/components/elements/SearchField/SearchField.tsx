import clsx from "clsx";
import { useRef } from "react";

import { CloseIcon } from "~/components/icons/CloseIcon";
import { SearchIcon } from "~/components/icons/SearchIcon";

export interface SearchFieldProps {
  className?: string;
  id?: string;
  name?: string;
  label?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value?: string) => void;
}

export function SearchField(props: SearchFieldProps) {
  const {
    className,
    id,
    name = id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onSearch,
  } = props;
  const ref = useRef<HTMLInputElement>(null);
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(value);
      }}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-lego-navy text-opacity-80"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          id={id}
          name={name}
          type={type}
          ref={ref}
          className="text-lego-navy focus:ring-lego-navy focus:border-lego-navy block w-full pr-16 border-slate-300 rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {value && (
          <button
            onClick={() => {
              onChange?.("");
              ref.current?.focus();
            }}
            className={clsx(
              "absolute inset-y-0 right-10 flex items-center self-center",
              "rounded-full bm-focusable ring-2 m-auto h-fit"
            )}
          >
            <CloseIcon
              className="h-5 w-5 text-slate-500 hover:text-opacity-80 active:text-opacity-60 transition-colors"
              aria-hidden="true"
            />
          </button>
        )}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
      </div>
    </form>
  );
}
