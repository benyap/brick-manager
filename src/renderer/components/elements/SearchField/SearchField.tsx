import clsx from "clsx";
import { forwardRef, MutableRefObject, useRef } from "react";

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
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
  clearButtonFocusable?: boolean;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (props, forwardedRef) => {
    const {
      className,
      id,
      name = id,
      label,
      type = "text",
      placeholder,
      value,
      readOnly,
      disabled,
      onChange,
      onClear,
      clearButtonFocusable,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef as MutableRefObject<HTMLInputElement>) ?? inputRef;

    return (
      <div className={clsx(className, { "opacity-70": disabled })}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-lego-navy-300"
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
            readOnly={readOnly}
            disabled={disabled}
            className="text-lego-navy focus:ring-lego-navy focus:border-lego-navy block w-full pr-16 border-slate-300 rounded-md"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          />
          {value && onClear && !disabled && (
            <button
              tabIndex={clearButtonFocusable ? undefined : -1}
              type="reset"
              onClick={() => {
                onClear();
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
      </div>
    );
  }
);
