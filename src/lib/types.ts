import type {
  Brigade,
  BrigadeMember,
  PodObekt,
  Project,
  SMR,
  SMRNote,
  SMRUpdate,
} from "@/generated/prisma/client";

export type SmrFormData = {
  name: string;
  unit: string;
  quantity: number;
  done: number;
  active: boolean;
  brigadeId?: string | null;
  pricePerUnit: number;
  totalValue: number;
  note: string;
  act?: number | null;
};

export type SMRWithUpdates = SMR & {
  updates: SMRUpdate[];
  notes: SMRNote[];
  brigade: Brigade | null;
};

export type PodObektWithSMR = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  smr: SMRWithUpdates[];
};

export type BrigadeWithAll = Brigade & {
  members: BrigadeMember[];
  smr: (SMR & {
    podObekt: PodObekt & { project: Project };
  })[];
};

export type ProjectWithRelations = Project & {
  podObekti: (PodObekt & { smr: SMR[] })[];
};
