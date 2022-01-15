import Fuse from "fuse.js";

import { IColor } from "~/models";

export function getTags({ externalIds, externalNames }: IColor) {
  const { BrickLink: BrickLinkIds = [], LEGO: LEGOIds = [] } = externalIds;
  const { BrickLink: BricklinkNames = [], LEGO: LEGONames = [] } = externalNames;
  return {
    BrickLinkIds,
    BricklinkNames,
    LEGOIds,
    LEGONames,
  };
}

export async function loadColors() {
  const data = (await import("~/data/colors.json")) as IColor[];
  return {
    data,
    search: new Fuse(
      data.map((item) => ({ item, tags: getTags(item) })),
      {
        keys: [
          { name: "tags.BrickLinkIds", weight: 1.0 },
          { name: "tags.BricklinkNames", weight: 0.8 },
          { name: "tags.LEGOIds", weight: 0.6 },
          { name: "tags.LEGONames", weight: 0.5 },
        ],
      }
    ),
  };
}
