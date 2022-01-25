import { IPart, IPartColors } from "~/types";

import { getData, writeData } from "./utils/data";
import { RebrickableAPI } from "./rebrickable/api";

/**
 * Get the colors for each part from Rebrickable.
 */
async function main() {
  const api = RebrickableAPI.create();

  const partsList = getData<IPart[]>("parts.json");
  const colors: IPartColors[] = [];

  // For each part, get color data
  let count = 0;
  for (const part of partsList) {
    try {
      count++;

      const partColors = (await api.partColors(part.id)).results;

      const colorMap = partColors.reduce((map, color) => {
        if (color.part_img_url) map[color.color_id] = color.part_img_url;
        return map;
      }, {} as Record<string, string | undefined>);

      if (Object.keys(colorMap).length > 0) {
        colors.push({
          partId: part.id,
          colors: colorMap,
        });
      }

      if (count % 10 === 0)
        console.log(
          "Fetched colors for",
          count,
          "out of",
          partsList.length,
          "parts"
        );
    } catch (error) {
      console.log("Failed to fetch colors for part", part.id);
    }
  }

  writeData("part-colors.json", colors);
}

main();
