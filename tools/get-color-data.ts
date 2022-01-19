import { Vendor, IColor, VendorMap } from "~/models";

import { writeData } from "./utils/data";
import { RebrickableAPI } from "./rebrickable/api";
import { RebrickableColorIdentifier } from "./rebrickable/interfaces";

function getVendorColorInfo(
  vendor: Vendor,
  data: VendorMap<RebrickableColorIdentifier> = {}
): { ids: string[]; names: string[] } | undefined {
  if (vendor in data) {
    const ids = data[vendor]?.ext_ids;
    const names = data[vendor]?.ext_descrs.map((desc) => desc[0]);
    if (ids && names) return { ids: ids.map((id) => String(id)), names };
  }
  return undefined;
}

/**
 * Get color data from the Rebrickable API.
 */
async function main() {
  const api = RebrickableAPI.create();
  const rawData = await api.getAllPages(api.colors);

  const data = rawData
    .filter(({ id }) => id >= 0)
    .filter(({ external_ids }) => external_ids.BrickLink || external_ids.LEGO)
    .map<IColor>(({ id, name, external_ids, is_trans, rgb }) => {
      const BrickLink = getVendorColorInfo("BrickLink", external_ids);
      const brickLinkIdentifiers = BrickLink?.ids?.reduce((map, id, index) => {
        const name = BrickLink?.names?.[index];
        if (name) map[id] = name;
        return map;
      }, {} as Record<string, string>);

      const LEGO = getVendorColorInfo("LEGO", external_ids);
      const legoIdentifiers = LEGO?.ids?.reduce((map, id, index) => {
        const name = LEGO?.names?.[index];
        if (name) map[id] = name;
        return map;
      }, {} as Record<string, string>);

      return {
        id: String(id),
        name: BrickLink?.names[0] ?? LEGO?.names[0] ?? name,
        material: is_trans ? "transparent" : "solid",
        rgb: `#${rgb}`,
        identifiers: {
          BrickLink: brickLinkIdentifiers
            ? Object.entries(brickLinkIdentifiers).map(([id, name]) => ({
                id,
                name,
              }))
            : undefined,
          LEGO: legoIdentifiers
            ? Object.entries(legoIdentifiers).map(([id, name]) => ({ id, name }))
            : undefined,
        },
      };
    })
    .sort((a, b) => Number(a.id) - Number(b.id));

  writeData("colors.json", data);
}

main();
