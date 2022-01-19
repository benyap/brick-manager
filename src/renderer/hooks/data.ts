import { IColor, ICategory, IPartWithColors } from "~/models";
import { useResource } from "~/components/core/ResourceProvider";

export function useParts(query?: string): IPartWithColors[] {
  const { data, search } = useResource("parts");
  return query ? search.search(query).map((result) => result.item) : data;
}

export function useColors(query?: string): IColor[] {
  const { data, search } = useResource("colors");
  return query ? search.search(query).map((result) => result.item.color) : data;
}

export function useCategoryById(id: string): ICategory | undefined {
  const { byId } = useResource("categories");
  return byId[id];
}
