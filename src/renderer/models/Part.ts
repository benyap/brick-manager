import { VendorMap, Vendor } from "./Vendor";

export interface IPart {
  id: string;
  name: string;
  image?: string;
  categoryId: string;
  source?: Vendor;
  identifiers?: VendorMap<string[]>;
}

export interface IPartWithColors {
  part: IPart;
  colors?: IPartColors["colors"];
}

export interface ICategory {
  id: string;
  name: string;
  count: number;
  sources: VendorMap<number>;
}

export interface IPartColors {
  partId: string;
  colors: { [colorId: string]: string | null | undefined };
}

export type IPartColorMap = { [partId: string]: IPartColors | undefined };
