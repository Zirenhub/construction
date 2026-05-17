export type SmrUpdate = {
  id: string;
  done: number;
  note: string;
  smrId: string;
  createdAt: Date;
};

export type SMR = {
  id: string;
  name: string;
  active: boolean;
  brigade: string;
  unit: string;
  quantity: number;
  done: number;
  pricePerUnit: number;
  totalValue: number;
  note: string;
  podObektId: string;
  createdAt: Date;
  updatedAt: Date;
  updates: SmrUpdate[];
};

export type PodObekt = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  smr: SMR[];
};

export type Project = {
  id: string;
  name: string;
  location: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  podObekti: PodObekt[];
};
