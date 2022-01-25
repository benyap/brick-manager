import { ICategory, IPart, Vendor } from "~/types";

import { unique } from "./utils/list";
import { writeData } from "./utils/data";
import { RebrickableAPI } from "./rebrickable/api";
import { BrickLinkCSV } from "./bricklink/csv";
import { BrickLinkPart } from "./bricklink/interfaces";

const categoriesToSkip = new Set([
  "143", // Other
  "534", // Brick, Promotional
  "490", // Clikits
  "575", // Clickits, Icon
  "1059", // Clikits, Icon Accent
  "506", // Duplo, Brick, Promotional
  "437", // Explore
  "1078", // Felt
  "234", // Foam
  "444", // Galidor
  "424", // HO 1:87 Vehicles
  "394", // Minitalia
  "727", // Modulex
  "729", // Module, Brick
  "728", // Module, Tile, Decorated
  "730", // Modulex, Window
  "237", // Monorail
  "246", // Paper
  "294", // Primo
  "537", // Quarto
  "102", // Scala
  "413", // Scala, Figure Accessory
  "439", // Soft Bricks
  "961", // Special Assembly
  "582", // Stickered Assembly
  "514", // Throwing disk
  "1039", // Tile, Promotional
  "600", // Town Plan
  "152", // Znap
  "160", // Sticker sheets
]);

const patternsToIgnore: RegExp[] = [
  /brick built/gi,
  /\(sticker\)/gi,
  /\(stickers\)/gi,
];

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
  const rebrickableParts = await api.getAllPages(api.parts);
  const rawCategoriesData = await new BrickLinkCSV().categories();

  const parts: IPart[] = [];
  const categories: Record<string, ICategory> = {};
  const seenBrickLinkIds: Set<string> = new Set();

  const filteredRebrickableParts = rebrickableParts.filter(
    ({ external_ids }) => external_ids.BrickLink || external_ids.LEGO
  );

  function addToCategory(id: string, source: Vendor, defaultName?: string) {
    if (!categories[id]) {
      const category = rawCategoriesData.find((category) => category.id === id);
      categories[id] = {
        id,
        name: category?.name ?? category?.id ?? defaultName ?? "Unknown",
        count: 0,
        sources: {},
      };
    }
    categories[id].count++;
    categories[id].sources[source] = (categories[id].sources[source] ?? 0) + 1;
  }

  let skipped = 0;

  // Get part data
  for (const {
    part_num,
    name,
    part_img_url,
    external_ids,
  } of filteredRebrickableParts) {
    const { BrickLink = [], LEGO } = external_ids;

    // See if BrickLink also has the part
    const brickLinkId = BrickLink.find((id) => id in brickLinkPartsById);
    const brickLinkPart = brickLinkPartsById[brickLinkId ?? part_num];

    if (brickLinkPart) {
      if (categoriesToSkip.has(brickLinkPart.categoryId)) {
        skipped++;
        continue;
      }

      if (
        patternsToIgnore.some((pattern) => name.match(pattern)) ||
        patternsToIgnore.some((pattern) => brickLinkPart.name.match(pattern))
      ) {
        skipped++;
        continue;
      }

      const brickLinkIds = unique([...BrickLink, brickLinkId ?? part_num]);
      brickLinkIds?.forEach((id) => seenBrickLinkIds.add(id));

      addToCategory(brickLinkPart.categoryId, "Rebrickable");

      parts.push({
        id: part_num,
        name,
        categoryId: brickLinkPart.categoryId,
        image: part_img_url,
        source: "Rebrickable",
        identifiers: {
          BrickLink: brickLinkIds,
          LEGO: unique(LEGO),
        },
      });
    }
  }

  // Add any BrickLink parts that we haven't seen from Rebrickable
  const brickLinkPartsToAdd = brickLinkParts.filter((part) => {
    if (seenBrickLinkIds.has(part.id)) return false;
    if (categoriesToSkip.has(part.categoryId)) {
      skipped++;
      return false;
    }
    if (patternsToIgnore.some((pattern) => part.name.match(pattern))) {
      skipped++;
      return false;
    }
    return true;
  });

  for (const part of brickLinkPartsToAdd) {
    addToCategory(part.categoryId, "BrickLink");
    parts.push({
      id: part.id,
      categoryId: part.categoryId,
      name: part.name,
      source: "BrickLink",
      identifiers: {
        BrickLink: [part.id],
      },
    });
  }

  const sortedParts = parts.sort((a, b) => {
    try {
      return categories[a.categoryId].name.localeCompare(
        categories[b.categoryId].name
      );
    } catch (error) {
      console.log(a, b);
      throw error;
    }
  });

  const sortedCategories = Object.values(categories).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  writeData("parts.json", sortedParts);
  writeData("categories.json", sortedCategories);

  console.log("Skipped", skipped, "parts");
  console.log(
    "Saved",
    sortedParts.length,
    "parts,",
    sortedCategories.length,
    "categories"
  );
}

main();
