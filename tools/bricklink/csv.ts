import { existsSync } from "fs";

import { readFromStream } from "../utils/stream";

import { BrickLinkCategory, BrickLinkPart } from "./interfaces";

export class BrickLinkCSV {
  constructor(
    private readonly partsCSVPath: string = "tools/bricklink/data/parts.csv"
  ) {
    if (!existsSync(partsCSVPath))
      throw new Error(
        `Parts CSV file not found at ${partsCSVPath}, please download from https://www.bricklink.com/catalogDownload.asp`
      );
  }

  async parts(): Promise<BrickLinkPart[]> {
    const parts: BrickLinkPart[] = [];
    const data = await readFromStream(this.partsCSVPath);
    const rows = data.split("\n").splice(1); // splice 1 to skip header row
    for (const row of rows) {
      const [categoryId, categoryName, id, name] = row
        .replace(/\r/g, "")
        .split("\t");
      if (id && name) parts.push({ id, name, categoryId, categoryName });
    }
    return parts;
  }

  async categories(): Promise<BrickLinkCategory[]> {
    const parts = await this.parts();
    const categories: Record<string, BrickLinkCategory> = {};
    for (const { categoryId, categoryName } of parts) {
      if (categoryId in categories) {
        categories[categoryId].count++;
      } else {
        categories[categoryId] = {
          id: categoryId,
          name: categoryName,
          count: 1,
        };
      }
    }
    return Object.values(categories);
  }
}
