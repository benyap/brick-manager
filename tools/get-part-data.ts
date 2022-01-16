import { ICategory, IPart } from "~/models";

import { unique } from "./utils/list";
import { writeData } from "./utils/data";
import { RebrickableAPI } from "./rebrickable/api";
import { BrickLinkCSV } from "./bricklink/csv";
import { BrickLinkPart } from "./bricklink/interfaces";

/**
 * Construct a list of parts and categories using data from Rebrickable and BrickLink.
 */
async function main() {
  const brickLinkParts = await new BrickLinkCSV().parts();
  const brickLinkPartsById = brickLinkParts.reduce((map, part) => {
    map[part.id] = part;
    return map;
  }, {} as Record<string, BrickLinkPart>);

  const api = RebrickableAPI.create();
  const rawPartsData = await api.getAllPages(api.parts);
  const rawCategoriesData = await new BrickLinkCSV().categories();

  const parts: IPart[] = [];
  const categories: Record<string, ICategory> = {};

  const filteredPartsData = rawPartsData.filter(
    ({ external_ids }) => external_ids.BrickLink || external_ids.LEGO
  );

  function addToCategory(id: string) {
    if (id in categories) {
      categories[id].count++;
    } else {
      const category = rawCategoriesData.find((category) => category.id === id);
      if (category) {
        categories[id] = {
          id,
          name: category.name,
          count: 1,
        };
      }
    }
  }

  // Get part data
  for (const { part_num, name, part_img_url, external_ids } of filteredPartsData) {
    const { BrickLink = [], LEGO } = external_ids;
    const match = Object.keys(BrickLink).find((id) => id in brickLinkPartsById);
    if (match) {
      const categoryId = brickLinkPartsById[match].categoryId;
      addToCategory(categoryId);
      parts.push({
        id: part_num,
        name,
        categoryId,
        image: part_img_url,
        externalIds: {
          BrickLink: unique(BrickLink),
          LEGO: unique(LEGO),
        },
      });
    } else if (part_num in brickLinkPartsById) {
      const categoryId = brickLinkPartsById[part_num].categoryId;
      addToCategory(categoryId);
      parts.push({
        id: part_num,
        name,
        categoryId,
        image: part_img_url,
        externalIds: {
          BrickLink: unique([part_num, ...BrickLink]),
          LEGO: unique(LEGO),
        },
      });
    }
  }
  const sortedParts = parts.sort((a, b) =>
    categories[a.categoryId].name.localeCompare(categories[b.categoryId].name)
  );

  const sortedCategories = Object.values(categories).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  writeData("parts.json", sortedParts);
  writeData("categories.json", sortedCategories);
}

main();
