import { VendorMap } from "./Vendor";

export interface IPart {
  id: string;
  name: string;
  image?: string;
  categoryId: string;
  externalIds: VendorMap<string[]>;
}

export interface ICategory {
  id: string;
  name: string;
  count: number;
}
