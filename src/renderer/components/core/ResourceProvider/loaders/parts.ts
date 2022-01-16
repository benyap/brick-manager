import Fuse from "fuse.js";

import { IPart, IPartColors } from "~/models";
import { keyBy } from "~/utils/transform";

export function getTags({ name, externalIds }: IPart) {
  const { BrickLink: BrickLinkIds = [], LEGO: LEGOIds = [] } = externalIds;
  return {
    name,
    BrickLinkIds,
    LEGOIds,
  };
}

export async function loadParts() {
  const partData = await import("~/data/parts.json");
  const colorData = await import("~/data/part-colors.json");

  const parts = partData.default as IPart[];
  const colors = colorData.default as IPartColors[];
  const colorsByPartId = keyBy(colors, "partId");

  const partsWithColors = parts.map((part) => ({
    part,
    colors: colorsByPartId[part.id]?.colors,
  }));

  return {
    data: partsWithColors,
    search: new Fuse(
      partsWithColors.map(({ part, colors }) => ({
        part,
        colors,
        tags: getTags(part),
      })),
      {
        keys: [
          { name: "tags.BrickLinkIds", weight: 1.0 },
          { name: "tags.LEGOIds", weight: 0.8 },
          { name: "tags.name", weight: 0.5 },
        ],
      }
    ),
  };
}
