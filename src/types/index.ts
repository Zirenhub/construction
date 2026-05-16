export type SMR = {
  id: string;
  name: string;
  active: boolean;
  progress: number; // 0-100
  brigade: string;
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
