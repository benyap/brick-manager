import Fuse from "fuse.js";

import { ICategory } from "~/models";
import { loadJSONData } from "~/utils/data";

export async function loadCategories() {
  const categories = await loadJSONData<ICategory[]>("categories.json");

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
