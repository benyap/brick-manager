import Fuse from "fuse.js";

import { IPart, IPartColors } from "~/types";
import { loadJSONData } from "~/utils/data";
import { Logger } from "~/utils/logger";
import { Timer } from "~/utils/timer";
import { keyBy } from "~/utils/transform";

export function getPartTags({ name, identifiers = {} }: IPart) {
  const { BrickLink = [], LEGO = [] } = identifiers;
  return {
    name,
    BrickLinkIds: BrickLink,
    LEGOIds: LEGO,
  };
}

export async function loadParts() {
  const timer = Timer.start();

  const parts = await loadJSONData<IPart[]>("parts.json");
  const colors = await loadJSONData<IPartColors[]>("part-colors.json");
  const colorsByPartId = keyBy(colors, "partId");

  const partsWithColors = parts.map((part) => ({
    part,
    colors: colorsByPartId[part.id]?.colors,
  }));

  timer.stop();
  Logger.debug(loadParts.name, "Loaded parts data in", timer.durationString);

  return {
    list: partsWithColors,
    byId: keyBy(partsWithColors, ({ part }) => part.id),
    search: new Fuse(
      partsWithColors.map(({ part, colors }) => ({
        part,
        colors,
        tags: getPartTags(part),
      })),
      {
        keys: ["tags.BrickLinkIds", "tags.LEGOIds", "tags.name"],
        ignoreLocation: true,
      }
    ),
  };
}
