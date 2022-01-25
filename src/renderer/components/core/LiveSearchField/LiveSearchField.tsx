import { useEffect, forwardRef } from "react";
import { useAtom, WritableAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

import { useDebouncedValue } from "~/hooks/debounce";
import SearchField, { SearchFieldProps } from "~/components/elements/SearchField";

export interface LiveSearchFieldProps
  extends Omit<SearchFieldProps, "value" | "onChange"> {
  searchAtom: WritableAtom<string, string>;
  debouncedSearchAtom: WritableAtom<string, string>;
  onSearch?: (value: string) => void;
  clearable?: boolean;
}

export const LiveSearchField = forwardRef<HTMLInputElement, LiveSearchFieldProps>(
  (props, ref) => {
    const {
      searchAtom,
      debouncedSearchAtom,
      onSearch,
      clearable,
      onClear = () => setSearch(""),
      ...searchFieldProps
    } = props;

    const [search, setSearch] = useAtom(searchAtom);
    const debouncedSearch = useDebouncedValue(search, 500);
    const setDebouncedSearch = useUpdateAtom(debouncedSearchAtom);

    useEffect(() => {
      setDebouncedSearch(debouncedSearch ?? "");
      if (debouncedSearch) onSearch?.(debouncedSearch);
    }, [debouncedSearch, setDebouncedSearch, onSearch]);

    return (
      <SearchField
        {...searchFieldProps}
        ref={ref}
        value={search}
        onChange={setSearch}
        onClear={clearable ? onClear : undefined}
      />
    );
  }
);
