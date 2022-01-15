import Fuse from "fuse.js";

import { ICategory } from "~/models";

export async function loadCategories() {
  const data = (await import("~/data/categories.json")) as ICategory[];
  const byId = data.reduce((map, category) => {
    map[category.id] = category;
    return map;
  }, {} as Record<string, ICategory>);
  return {
    data,
    byId,
    search: new Fuse(data, {
      keys: ["id", "name"],
    }),
  };
}
