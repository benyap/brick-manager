/**
 * The color of a LEGO piece.
 * Reference: https://www.mecabricks.com/docs/colour_chart.pdf
 */
export interface IColor {
  id: string;
  name: string;
  alternateName?: string;
  material: string;
  rgb?: string;
  externalIds: {
    bricklink?: string;
    ldraw?: string;
  };
}
