'use client';

import CreateSmrSheet, { SmrFormData } from '@/components/CreateSmrSheet';
import SmrSection from '@/components/SmrSection';
import { createSMR, updateSMRProgress } from '@/lib/actions';
import { PodObekt } from '@/types';
import { useState } from 'react';

export default function PodObektClient({
  pod,
  projectId,
}: {
  pod: PodObekt;
  projectId: string;
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
      brigade: data.brigade,
      note: data.note,
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

  return (
    <>
      <div className="p-4 space-y-6 md:p-6 md:space-y-8">
        <div className="flex justify-end">
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs border border-zinc-700
              rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors md:gap-1.5 md:px-3.5 md:text-sm"
          >
            <span className="text-base leading-none md:text-sm">+</span>
            <span className="hidden sm:inline">Нова СМР</span>
          </button>
        </div>

        <SmrSection
          title="Активни СМР"
          smr={active}
          active
          onUpdateAction={handleUpdate}
        />
        <hr className="border-zinc-800" />
        <SmrSection
          title="Неактивни СМР"
          smr={inactive}
          active={false}
          onUpdateAction={handleUpdate}
        />
      </div>

      <CreateSmrSheet
        open={sheetOpen}
        onCloseAction={() => setSheetOpen(false)}
        onSaveAction={handleCreate}
      />
    </>
  );
}
