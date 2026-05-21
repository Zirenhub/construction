'use client';

import CreateSmrSheet from '@/components/CreateSmrSheet';
import SmrSection from '@/components/SmrSection';
import { Project } from '@/generated/prisma/client';
import { createSMR, createSMRNote, toggleSMRPaid, updateSMRProgress } from '@/lib/actions';
import { PodObektWithSMR, SmrFormData } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

export default function PodObektiClient({
  pod,
  projectId,
  project,
  brigades,
}: {
  pod: PodObektWithSMR;
  projectId: string;
  project: Project;
  brigades: { id: string; name: string }[];
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const active = pod.smr.filter((s) => s.active);
  const inactive = pod.smr.filter((s) => !s.active);

  async function handleCreate(data: SmrFormData) {
    await createSMR({
      podObektId: pod.id,
      projectId,
      name: data.name,
      unit: data.unit,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      totalValue: data.totalValue,
      brigadeId: data.brigadeId,
      note: data.note,
      act: data.act,
    });
  }

  async function handleUpdate(smrId: string, added: number, note: string) {
    const smr = pod.smr.find((s) => s.id === smrId);
    if (!smr) return;
    await updateSMRProgress({
      smrId,
      podObektId: pod.id,
      projectId,
      added,
      note,
      currentDone: smr.done,
      quantity: smr.quantity,
    });
  }

  async function handleAddNote(smrId: string, content: string) {
    await createSMRNote({ smrId, podObektId: pod.id, projectId, content });
  }

  async function handleTogglePaid(smrId: string, paid: boolean) {
    await toggleSMRPaid({ smrId, podObektId: pod.id, projectId, paid });
  }

  return (
    <>
      {/* Topbar */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-800 md:px-6 md:py-5">
        <Link
          href="/obekti"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors shrink-0 hidden sm:inline"
        >
          Обекти
        </Link>
        <span className="text-zinc-700 hidden sm:inline">/</span>
        <Link
          href={`/obekti/${project.id}`}
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors shrink-0"
        >
          <span className="sm:hidden">← </span>
          {project.name}
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="text-sm font-medium text-zinc-100 truncate md:text-base">{pod.name}</h1>
        <button
          onClick={() => setSheetOpen(true)}
          className="ml-auto shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs border border-zinc-700
            rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors md:gap-1.5 md:px-3.5 md:text-sm"
        >
          <span>+</span>
          <span className="hidden sm:inline">Нова СМР</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 md:p-6 md:space-y-8">
        <SmrSection
          title="Активни СМР"
          smr={active}
          active
          onUpdateAction={handleUpdate}
          onAddNoteAction={handleAddNote}
          onTogglePaidAction={handleTogglePaid}
        />
        <hr className="border-zinc-800" />
        <SmrSection
          title="Неактивни СМР"
          smr={inactive}
          active={false}
          onUpdateAction={handleUpdate}
          onAddNoteAction={handleAddNote}
          onTogglePaidAction={handleTogglePaid}
        />
      </div>

      <CreateSmrSheet
        open={sheetOpen}
        brigades={brigades}
        onCloseAction={() => setSheetOpen(false)}
        onSaveAction={handleCreate}
      />
    </>
  );
}
