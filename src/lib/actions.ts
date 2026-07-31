"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { CreateTaskData } from "./types";

const smrInclude = {
  updates: { orderBy: { createdAt: "asc" as const } },
  notes: { orderBy: { createdAt: "asc" as const } },
  brigade: true,
};

// ── Projects ──────────────────────────────────────────────

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      podObekti: {
        include: { smr: { include: smrInclude } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProject(data: { name: string; location: string }) {
  await prisma.project.create({ data });
  revalidatePath("/obekti");
}

// ── Pod Obekti ────────────────────────────────────────────

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      podObekti: {
        include: { smr: { include: smrInclude } },
      },
    },
  });
}

export async function createPodObekt(data: {
  name: string;
  projectId: string;
}) {
  await prisma.podObekt.create({ data });
  revalidatePath(`/obekti/${data.projectId}`);
}

// ── SMR ───────────────────────────────────────────────────

export async function getPodObekt(id: string) {
  return prisma.podObekt.findUnique({
    where: { id },
    include: { smr: { include: smrInclude } },
  });
}

export async function getPodObekti() {
  return prisma.podObekt.findMany({});
}

export async function createSMRNote(data: {
  smrId: string;
  podObektId: string;
  projectId: string;
  content: string;
}) {
  await prisma.sMRNote.create({
    data: { smrId: data.smrId, content: data.content },
  });
  revalidatePath(`/obekti/${data.projectId}/${data.podObektId}`);
}

export async function createSMR(data: {
  podObektId: string;
  projectId: string;
  name: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  brigadeId?: string | null;
  note: string;
  act?: number | null;
}) {
  const { projectId, ...smrData } = data;
  await prisma.sMR.create({ data: smrData });
  revalidatePath(`/obekti/${projectId}/${data.podObektId}`);
}

export async function getSMRs() {
  return prisma.sMR.findMany({
    include: { ...smrInclude, podObekt: { include: { project: true } } },
  });
}

export async function updateSMRProgress(data: {
  smrId: string;
  podObektId: string;
  projectId: string;
  added: number;
  note: string;
  currentDone: number;
  quantity: number;
}) {
  const newDone = Math.min(data.currentDone + data.added, data.quantity);
  const isComplete = newDone >= data.quantity;

  await prisma.sMR.update({
    where: { id: data.smrId },
    data: {
      done: newDone,
      active: !isComplete,
      updates: { create: { done: newDone, note: data.note } },
    },
  });

  revalidatePath(`/obekti/${data.projectId}/${data.podObektId}`);
}

export async function toggleSMRPaid(data: {
  smrId: string;
  podObektId: string;
  projectId: string;
  paid: boolean;
}) {
  await prisma.sMR.update({
    where: { id: data.smrId },
    data: { paid: data.paid },
  });
  revalidatePath(`/obekti/${data.projectId}/${data.podObektId}`);
}

// ── Brigades ──────────────────────────────────────────────

export async function getBrigades() {
  return prisma.brigade.findMany({
    include: {
      members: { orderBy: { createdAt: "asc" } },
      smr: {
        where: { active: true },
        include: {
          podObekt: { include: { project: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBrigadesList() {
  return prisma.brigade.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function createBrigade(name: string) {
  await prisma.brigade.create({ data: { name } });
  revalidatePath("/brigadi");
}

export async function deleteBrigade(id: string) {
  await prisma.brigade.delete({ where: { id } });
  revalidatePath("/brigadi");
}

export async function addBrigadeMember(data: {
  brigadeId: string;
  name: string;
  role: string;
}) {
  await prisma.brigadeMember.create({ data });
  revalidatePath("/brigadi");
}

export async function removeBrigadeMember(id: string) {
  await prisma.brigadeMember.delete({ where: { id } });
  revalidatePath("/brigadi");
}

export async function createTask(data: CreateTaskData) {
  const {
    title,
    description,
    dueDate,
    isAllDay,
    priority,
    project,
    podObekt,
    brigade,
    brigadeMemberId,
    smr,
  } = data;

  const date = dueDate === "" ? new Date().toISOString() : dueDate;

  await prisma.task.create({
    data: {
      title,
      status: "IN_PROGRESS",
      priority,
      isAllDay,
      dueDate: date,
      description,
      projectId: project?.id,
      podObektId: podObekt?.id,
      brigadeId: brigade?.id,
      brigadeMemberId: brigadeMemberId?.id,
      smrId: smr?.id,
    },
  });

  revalidatePath("/");
}

export async function getTasks() {
  return prisma.task.findMany({
    include: {
      project: true,
      podObekt: true,
      brigade: true,
      brigadeMember: true,
      smr: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
