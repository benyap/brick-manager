import Fuse from "fuse.js";

import { ICategory } from "~/types";
import { loadJSONData } from "~/utils/data";
import { Logger } from "~/utils/logger";
import { Timer } from "~/utils/timer";

export async function loadCategories() {
  const timer = Timer.start();

  const categories = await loadJSONData<ICategory[]>("categories.json");
  const byId = categories.reduce((map, category) => {
    map[category.id] = category;
    return map;
  }, {} as Record<string, ICategory>);

  timer.stop();
  Logger.debug(
    loadCategories.name,
    "Loaded categories data in",
    timer.durationString
  );

  return {
    list: categories,
    byId,
    search: new Fuse(categories, {
      keys: ["id", "name"],
    }),
  };
}
