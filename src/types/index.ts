export type SmrUpdate = {
  id: string;
  done: number;
  note: string;
  timestamp: string; // ISO string
};

export type SMR = {
  id: string;
  name: string;
  active: boolean;
  progress: number;
  brigade: string;
  unit: string;
  quantity: number;
  done: number;
  pricePerUnit: number;
  totalValue: number;
  note: string; // creation note
  updates: SmrUpdate[];
};

export type PodObekt = {
  id: string;
  name: string;
  smr: SMR[];
};

export type Project = {
  id: string;
  name: string;
  location: string;
  active: boolean;
  podObekti: PodObekt[];
};
