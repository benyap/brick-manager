import Fuse from "fuse.js";

import { IPart, IPartColors } from "~/models";
import { loadJSONData } from "~/utils/data";
import { keyBy } from "~/utils/transform";

export function getTags({ name, identifiers = {} }: IPart) {
  const { BrickLink = [], LEGO = [] } = identifiers;
  return {
    name,
    BrickLinkIds: BrickLink,
    LEGOIds: LEGO,
  };
}

export async function loadParts() {
  const parts = await loadJSONData<IPart[]>("parts.json");
  const colors = await loadJSONData<IPartColors[]>("part-colors.json");
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
