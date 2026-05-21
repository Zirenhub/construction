'use client';

import { createPodObekt } from '@/lib/actions';
import { useState, useTransition } from 'react';

export default function CreatePodObektButton({
  projectId,
}: {
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!name.trim()) return;
    startTransition(async () => {
      await createPodObekt({ name: name.trim(), projectId });
      setName('');
      setOpen(false);
    });
  }

  function handleClose() {
    setName('');
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 text-xs border border-zinc-700 rounded-lg
          text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors md:gap-1.5 md:px-3.5 md:text-sm"
      >
        + Нов под обект
      </button>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:max-w-md bg-zinc-950 md:border-l border-zinc-800
        z-50 flex flex-col transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-base font-medium text-zinc-100">Нов под обект</h2>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 px-6 py-6">
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Име <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="напр. Фасада Изток, Етаж 1, Секция А..."
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleClose();
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5
              text-sm text-zinc-100 placeholder:text-zinc-600
              focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm border border-zinc-800 rounded-lg text-zinc-400
              hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2.5 text-sm bg-white text-zinc-950 rounded-lg font-medium
              hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Запазване...' : 'Създай'}
          </button>
        </div>
      </div>
    </>
  );
}
