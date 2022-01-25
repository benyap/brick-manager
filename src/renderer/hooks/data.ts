import { IColor, IPartWithColors } from "~/types";
import { useResource } from "~/components/core/ResourceProvider";

export function usePartSearch(query?: string): IPartWithColors[] {
  const { list, search } = useResource("parts");
  return query ? search.search(query).map((result) => result.item) : list;
}

export function useColorSearch(query?: string): IColor[] {
  const { list, search } = useResource("colors");
  return query ? search.search(query).map((result) => result.item.color) : list;
}
