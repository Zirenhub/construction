'use client';

import CreateSmrSheet from '@/components/CreateSmrSheet';
import SmrSection from '@/components/SmrSection';
import { getPodObekt, getProject } from '@/lib/data';
import { SMR } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useState } from 'react';

export default function PodObektPage({
  params,
}: {
  params: Promise<{ projectId: string; podId: string }>;
}) {
  const { projectId, podId } = use(params);
  const project = getProject(projectId);
  const pod = getPodObekt(projectId, podId);
  if (!project || !pod) notFound();

  const [smrList, setSmrList] = useState<SMR[]>(pod.smr);
  const [sheetOpen, setSheetOpen] = useState(false);

  const active = smrList.filter((s) => s.active);
  const inactive = smrList.filter((s) => !s.active);

  function handleCreate(data: Omit<SMR, 'id' | 'progress'>) {
    setSmrList((prev) => [
      ...prev,
      { ...data, id: `smr-${Date.now()}`, progress: 0 },
    ]);
  }

  function handleUpdate(id: string, done: number, note: string) {
    setSmrList((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newDone = done;
        const pct =
          s.quantity > 0 ? Math.round((newDone / s.quantity) * 100) : 0;
        const update = {
          id: `u-${Date.now()}`,
          done: newDone,
          note,
          timestamp: new Date().toISOString(),
        };
        return {
          ...s,
          done: newDone,
          progress: pct,
          active: pct < 100,
          updates: [...s.updates, update],
        };
      })
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800 flex-wrap">
          <Link
            href="/obekti"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Обекти
          </Link>
          <span className="text-zinc-700">/</span>
          <Link
            href={`/obekti/${project.id}`}
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            {project.name}
          </Link>
          <span className="text-zinc-700">/</span>
          <h1 className="text-lg font-medium text-zinc-100">{pod.name}</h1>
          <button
            onClick={() => setSheetOpen(true)}
            className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 text-sm border border-zinc-700
              rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            + Нова СМР
          </button>
        </div>

        <div className="p-6 space-y-8">
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
      </div>

      <CreateSmrSheet
        open={sheetOpen}
        onCloseAction={() => setSheetOpen(false)}
        onSaveAction={handleCreate}
      />
    </>
  );
}
