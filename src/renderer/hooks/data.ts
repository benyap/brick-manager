import { IColor, ICategory, IPartWithColors } from "~/models";
import { useDebouncedValue } from "~/hooks/debounce";
import { useResource } from "~/components/core/ResourceProvider";

export function useParts(query?: string): IPartWithColors[] {
  const { data, search } = useResource("parts");
  const debouncedQuery = useDebouncedValue(query, 500) ?? "";
  return debouncedQuery
    ? search.search(debouncedQuery).map((result) => result.item)
    : data;
}

export function useColors(query?: string): IColor[] {
  const { data, search } = useResource("colors");
  const debouncedQuery = useDebouncedValue(query, 500) ?? "";
  return debouncedQuery
    ? search.search(debouncedQuery).map((result) => result.item.color)
    : data;
}

export function useCategoryById(id: string): ICategory | undefined {
  const { byId } = useResource("categories");
  return byId[id];
}
