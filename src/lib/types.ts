import {
  Brigade,
  BrigadeMember,
  PodObekt,
  Project,
  SMR,
  SMRNote,
  SMRUpdate,
  Task,
  TaskStatus,
} from "@/generated/prisma/client";

export { TaskStatus };

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

export type SMRWithAll = SMR & {
  updates: SMRUpdate[];
  notes: SMRNote[];
  brigade: Brigade | null;
  podObekt: PodObekt & { project: Project };
};

export type TPodObekt = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
};

export type PodObektWithSMR = TPodObekt & { smr: SMRWithUpdates[] };

export type BrigadeWithAll = Brigade & {
  members: BrigadeMember[];
  smr: (SMR & {
    podObekt: PodObekt & { project: Project };
  })[];
};

export type ProjectWithRelations = Project & {
  podObekti: (PodObekt & { smr: SMR[] })[];
};

export type CreateTaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type CreateTaskData = {
  title: string;
  description: string;
  dueDate: string;
  isAllDay: boolean;
  priority: CreateTaskPriority;
  project: ProjectWithRelations | null;
  podObekt: TPodObekt | null;
  brigade: BrigadeWithAll | null;
  brigadeMemberId: BrigadeMember | null;
  smr: SMRWithAll | null;
};

export type TaskWithActions = Task & {
  project?: {
    name: string;
  } | null;

  podObekt?: {
    name: string;
  } | null;

  brigade?: {
    name: string;
  } | null;

  brigadeMember?: {
    name: string;
  } | null;

  smr?: {
    name: string;
  } | null;
};

export type TaskAction = "complete" | "delete";
