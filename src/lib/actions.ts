'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';

// ── Projects ──────────────────────────────────────────────

export async function getProjects() {
  return prisma.project.findMany({
    include: { podObekti: { include: { smr: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createProject(data: { name: string; location: string }) {
  await prisma.project.create({ data });
  revalidatePath('/obekti');
}

// ── Pod Obekti ────────────────────────────────────────────

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { podObekti: { include: { smr: true } } },
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
    include: {
      smr: { include: { updates: { orderBy: { createdAt: 'asc' } } } },
    },
  });
}

export async function createSMR(data: {
  podObektId: string;
  projectId: string;
  name: string;
  unit: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  brigade: string;
  note: string;
}) {
  const { projectId, ...smrData } = data;
  await prisma.sMR.create({ data: smrData });
  revalidatePath(`/obekti/${projectId}/${data.podObektId}`);
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
      updates: {
        create: { done: newDone, note: data.note },
      },
    },
  });

  revalidatePath(`/obekti/${data.projectId}/${data.podObektId}`);
}
