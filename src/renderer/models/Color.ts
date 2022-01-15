import { VendorMap } from "./Vendor";

/**
 * The color of a LEGO piece.
 * Reference: https://www.mecabricks.com/docs/colour_chart.pdf
 */
export interface IColor {
  id: string;
  name: string;
  material: "solid" | "transparent";
  rgb: string;
  externalNames: VendorMap<string[]>;
  externalIds: VendorMap<string[]>;
}
