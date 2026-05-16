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
        const pct = s.quantity > 0 ? Math.round((done / s.quantity) * 100) : 0;
        const update = {
          id: `u-${Date.now()}`,
          done,
          note,
          timestamp: new Date().toISOString(),
        };
        return {
          ...s,
          done,
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
        {/* Breadcrumb header */}
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
          <h1 className="text-sm font-medium text-zinc-100 truncate md:text-base">
            {pod.name}
          </h1>
          <button
            onClick={() => setSheetOpen(true)}
            className="ml-auto shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs border border-zinc-700
              rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors md:gap-1.5 md:px-3.5 md:text-sm"
          >
            <span className="text-base leading-none md:text-sm">+</span>
            <span className="hidden sm:inline">Нова СМР</span>
          </button>
        </div>

        <div className="p-4 space-y-6 md:p-6 md:space-y-8">
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
