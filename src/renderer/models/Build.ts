export interface IBuild {
  id: string;
  description: string;
  created: string;
  requirements: IBuildRequirement[];
}

export interface IBuildRequirement {
  partRef: string;
  colorRef?: string;
  amount: number;
  optional?: boolean;
  fulfilments: IBuildRequirementFulfilment[];
}

export type IBuildRequirementFulfilment =
  | IBuildFulfilmentFromInventory
  | IBuildFulfilmentIgnored;

export interface IBuildFulfilmentFromInventory {
  type: "inventory";
  collectionRef: string;
  updated: string;
  amount: number;
}

export interface IBuildFulfilmentIgnored {
  type: "ignore";
  updated: string;
  amount: number;
}
