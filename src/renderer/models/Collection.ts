export interface ICollection {
  id: string;
  description: string;
  created: string;
  items: ICollectionItem[];
}

export type ICollectionItem = ICollectionItemPart;

export interface ICollectionItemPart {
  type: "part";
  id: string;
  created: string;
  instances: ICollectionItemPartInstance[];
}

export interface ICollectionItemPartInstance {
  colorRef: string;
  count: number;
  comment?: string;
  missing?: boolean;
  buildRef?: string;
}
