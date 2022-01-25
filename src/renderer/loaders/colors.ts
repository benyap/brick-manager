import Fuse from "fuse.js";

import { IColor } from "~/types";
import { loadJSONData } from "~/utils/data";
import { Logger } from "~/utils/logger";
import { Timer } from "~/utils/timer";
import { keyBy } from "~/utils/transform";

function getTags({ identifiers = {} }: IColor) {
  const { BrickLink = [], LEGO = [] } = identifiers;
  return {
    BrickLinkIds: BrickLink.map(({ id }) => id),
    BricklinkNames: BrickLink.map(({ name }) => name),
    LEGOIds: LEGO.map(({ id }) => id),
    LEGONames: LEGO.map(({ name }) => name),
  };
}

export async function loadColors() {
  const timer = Timer.start();

  const colors = await loadJSONData<IColor[]>("colors.json");
  const colorsById = keyBy(colors, "id");

  timer.stop();
  Logger.debug(loadColors.name, "Loaded color data in", timer.durationString);

  return {
    list: colors,
    byId: colorsById,
    search: new Fuse(
      colors.map((color) => ({ color, tags: getTags(color) })),
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
