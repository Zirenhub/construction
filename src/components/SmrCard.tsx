'use client';

import { SMRUpdate } from '@/generated/prisma/client';
import { SMRWithUpdates } from '@/lib/types';
import { useState, useTransition } from 'react';
import SmrNotesPanel from './SmrNotesPanel';

type Props = {
  smr: SMRWithUpdates;
  onUpdateAction: (id: string, done: number, note: string) => Promise<void>;
  onAddNoteAction: (smrId: string, content: string) => Promise<void>;
  onTogglePaidAction: (smrId: string, paid: boolean) => Promise<void>;
};

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SmrCard({ smr, onUpdateAction, onAddNoteAction, onTogglePaidAction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [updateDone, setUpdateDone] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isPaidPending, startPaidTransition] = useTransition();

  const pct = smr.quantity > 0 ? Math.round((smr.done / smr.quantity) * 100) : 0;
  const earned = smr.pricePerUnit * smr.done;

  function handleUpdate() {
    const val = Number(updateDone);
    if (!updateDone || isNaN(val) || val < 0) {
      setUpdateError('Въведете валидно количество');
      return;
    }
    if (smr.done + val > smr.quantity) {
      setUpdateError(`Максимум ${smr.quantity - smr.done} ${smr.unit} остават`);
      return;
    }
    const capturedNote = updateNote.trim();
    setUpdateDone('');
    setUpdateNote('');
    setUpdateError('');
    startTransition(async () => {
      await onUpdateAction(smr.id, val, capturedNote);
    });
  }

  function handleTogglePaid(e: React.MouseEvent) {
    e.stopPropagation();
    startPaidTransition(async () => {
      await onTogglePaidAction(smr.id, !smr.paid);
    });
  }

  return (
    <>
      <div
        className={`border rounded-xl bg-zinc-900 transition-all ${
          !smr.active
            ? 'border-zinc-800 opacity-50'
            : 'border-zinc-800 hover:border-zinc-700'
        }`}
      >
        {/* Always-visible header */}
        <div
          className="p-4 cursor-pointer select-none"
          onClick={() => setExpanded((v) => !v)}
        >
          {/* Row 1: name + action icons */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">{smr.name}</p>
              {smr.brigade && (
                <p className="text-xs text-zinc-500 mt-0.5">{smr.brigade.name}</p>
              )}
            </div>
            <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
              <span className="text-xs font-medium text-zinc-400 tabular-nums">{pct}%</span>
              {/* Notes button */}
              <button
                onClick={(e) => { e.stopPropagation(); setNotesOpen(true); }}
                className="flex items-center gap-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                title="Бележки"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                {smr.notes.length > 0 && (
                  <span className="text-[10px] font-medium">{smr.notes.length}</span>
                )}
              </button>
              {/* Chevron */}
              <svg
                className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-1 mb-2">
            <div
              className={`h-1 rounded-full transition-all ${pct === 100 ? 'bg-zinc-500' : 'bg-green-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Row 2: quantities + value */}
          <div className="flex items-center justify-between text-xs text-zinc-500 tabular-nums mb-3">
            <span>{smr.done} / {smr.quantity} {smr.unit}</span>
            {smr.totalValue > 0 && (
              <span>{earned.toLocaleString('bg-BG')} / {smr.totalValue.toLocaleString('bg-BG')} лв</span>
            )}
          </div>

          {/* Row 3: act + paid — always visible */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {smr.act != null && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                Акт №{smr.act}
              </span>
            )}
            <button
              onClick={handleTogglePaid}
              disabled={isPaidPending}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50
                ${smr.paid
                  ? 'border-green-800 bg-green-950 text-green-400 hover:bg-green-900'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${smr.paid ? 'bg-green-400' : 'bg-zinc-600'}`} />
              Платено
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { label: 'Мярка', value: smr.unit },
                { label: 'Цена/ед.', value: smr.pricePerUnit > 0 ? `${smr.pricePerUnit} лв` : '—' },
                { label: 'Обща стойност', value: smr.totalValue > 0 ? `${smr.totalValue.toLocaleString('bg-BG')} лв` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-zinc-950 rounded-lg p-2.5">
                  <p className="text-[10px] text-zinc-600 mb-0.5">{label}</p>
                  <p className="text-xs font-medium text-zinc-300">{value}</p>
                </div>
              ))}
            </div>

            {/* Creation note */}
            {smr.note && (
              <div className="bg-zinc-950 rounded-lg p-3">
                <p className="text-[10px] text-zinc-600 mb-1">Бележка при създаване</p>
                <p className="text-xs text-zinc-400">{smr.note}</p>
              </div>
            )}

            {/* Update history */}
            {smr.updates.length > 0 && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 mb-2">
                  История
                </p>
                <div className="space-y-2">
                  {[...smr.updates].reverse().map((u: SMRUpdate) => (
                    <div key={u.id} className="flex gap-3 text-xs">
                      <div className="shrink-0 pt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-zinc-300 tabular-nums font-medium">
                            {u.done} {smr.unit}
                          </span>
                          <span className="text-zinc-600 text-[10px] shrink-0">
                            {formatDate(u.createdAt)}
                          </span>
                        </div>
                        {u.note && <p className="text-zinc-500 mt-0.5">{u.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update form — only for active */}
            {smr.active && (
              <div className="border border-zinc-800 rounded-lg p-3 space-y-2.5">
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                  Обнови напредък
                </p>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={smr.quantity}
                    placeholder={`Добавено сега (${smr.unit})`}
                    value={updateDone}
                    onChange={(e) => { setUpdateDone(e.target.value); setUpdateError(''); }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2
                      text-sm text-zinc-100 placeholder:text-zinc-600
                      focus:outline-none focus:border-zinc-600 transition-colors pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                    {smr.unit}
                  </span>
                </div>
                {updateError && <p className="text-xs text-red-400">{updateError}</p>}
                <textarea
                  rows={2}
                  placeholder="Бележка (по желание)..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2
                    text-sm text-zinc-100 placeholder:text-zinc-600
                    focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                />
                {smr.done < smr.quantity && (
                  <button
                    onClick={() => {
                      const remaining = smr.quantity - smr.done;
                      const capturedNote = updateNote.trim();
                      setUpdateNote('');
                      startTransition(async () => {
                        await onUpdateAction(smr.id, remaining, capturedNote || 'Завършено');
                      });
                    }}
                    disabled={isPending}
                    className="w-full py-2 text-sm border border-zinc-700 rounded-lg text-zinc-400
                      hover:border-green-700 hover:text-green-400 hover:bg-green-950/30 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✓ Декларирай завършено — остават {smr.quantity - smr.done} {smr.unit}
                  </button>
                )}
                <button
                  onClick={handleUpdate}
                  disabled={isPending}
                  className="w-full py-2 text-sm bg-white text-zinc-950 rounded-lg font-medium
                    hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? 'Запазване...' : 'Запази'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {notesOpen && (
        <SmrNotesPanel
          smrName={smr.name}
          notes={smr.notes}
          onAddNoteAction={(content) => onAddNoteAction(smr.id, content)}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </>
  );
}
