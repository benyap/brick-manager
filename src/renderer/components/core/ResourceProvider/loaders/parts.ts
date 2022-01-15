import Fuse from "fuse.js";

import { IPart } from "~/models";

export function getTags({ name, externalIds }: IPart) {
  const { BrickLink: BrickLinkIds = [], LEGO: LEGOIds = [] } = externalIds;
  return {
    name,
    BrickLinkIds,
    LEGOIds,
  };
}

export async function loadParts() {
  const data = (await import("~/data/parts.json")) as IPart[];
  return {
    data,
    search: new Fuse(
      data.map((item) => ({ item, tags: getTags(item) })),
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
