export type Vendor = "LEGO" | "BrickLink" | "BrickOwl" | "Rebrickable" | "LDraw";

export type VendorMap<T> = Partial<Record<Vendor, T>>;
