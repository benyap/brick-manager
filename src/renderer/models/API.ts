export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Vendor = "LEGO" | "BrickLink" | "LDraw" | "BrickOwl" | "Peeron";

export interface RebrickableColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
  externalIds: Partial<Record<Vendor, RebrickableColorIdentifier>>;
}

export interface RebrickableColorIdentifier {
  ext_ids: (number | null)[];
  ext_descrs: string[][];
}

export interface RebrickablePartCategory {
  id: number;
  name: string;
  part_count: number;
}

export interface RebrickablePart {
  part_num: string;
  name: string;
  part_cat_id: number;
  part_url: string;
  part_img_url: string;
  external_ids: Partial<Record<Vendor, string[]>>;
  print_of: string;
}
