import Fuse from "fuse.js";

import { ICategory } from "~/models";

export async function loadCategories() {
  const data = await import("~/data/categories.json");
  const categories = data.default as ICategory[];

  const byId = categories.reduce((map, category) => {
    map[category.id] = category;
    return map;
  }, {} as Record<string, ICategory>);

  return {
    data: categories,
    byId,
    search: new Fuse(categories, {
      keys: ["id", "name"],
    }),
  };
}
