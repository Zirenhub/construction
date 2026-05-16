'use client';

import { SMR, SmrUpdate } from '@/types';
import { useState } from 'react';

type Props = {
  smr: SMR;
  onUpdateAction: (id: string, done: number, note: string) => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SmrCard({ smr, onUpdateAction }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [updateDone, setUpdateDone] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [updateError, setUpdateError] = useState('');

  const pct =
    smr.quantity > 0 ? Math.round((smr.done / smr.quantity) * 100) : 0;
  const earned = smr.pricePerUnit * smr.done;

  function handleUpdate() {
    const val = Number(updateDone);
    if (!updateDone || isNaN(val) || val < 0) {
      setUpdateError('Въведете валидно количество');
      return;
    }
    if (val > smr.quantity) {
      setUpdateError(`Максимум ${smr.quantity} ${smr.unit}`);
      return;
    }
    onUpdateAction(smr.id, val, updateNote.trim());
    setUpdateDone('');
    setUpdateNote('');
    setUpdateError('');
  }

  return (
    <div
      className={`border rounded-xl bg-zinc-900 transition-all ${
        !smr.active
          ? 'border-zinc-800 opacity-50'
          : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Card header — always visible */}
      <div
        className="p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">
              {smr.name}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{smr.brigade}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-medium text-zinc-400 tabular-nums">
              {pct}%
            </span>
            <svg
              className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-1 mb-2">
          <div
            className={`h-1 rounded-full transition-all ${pct === 100 ? 'bg-zinc-500' : 'bg-green-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-600 tabular-nums">
          <span>
            {smr.done} / {smr.quantity} {smr.unit}
          </span>
          {smr.totalValue > 0 && (
            <span className="text-zinc-500">
              {earned.toLocaleString('bg-BG')} /{' '}
              {smr.totalValue.toLocaleString('bg-BG')} лв
            </span>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-4 space-y-4">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: 'Мярка', value: smr.unit },
              {
                label: 'Цена/ед.',
                value: smr.pricePerUnit > 0 ? `${smr.pricePerUnit} лв` : '—',
              },
              {
                label: 'Обща стойност',
                value:
                  smr.totalValue > 0
                    ? `${smr.totalValue.toLocaleString('bg-BG')} лв`
                    : '—',
              },
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
              <p className="text-[10px] text-zinc-600 mb-1">
                Бележка при създаване
              </p>
              <p className="text-xs text-zinc-400">{smr.note}</p>
            </div>
          )}

          {/* Update log */}
          {smr.updates.length > 0 && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600 mb-2">
                История
              </p>
              <div className="space-y-2">
                {[...smr.updates].reverse().map((u: SmrUpdate) => (
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
                          {formatDate(u.timestamp)}
                        </span>
                      </div>
                      {u.note && (
                        <p className="text-zinc-500 mt-0.5">{u.note}</p>
                      )}
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
                  placeholder={`Свършено (${smr.unit})`}
                  value={updateDone}
                  onChange={(e) => {
                    setUpdateDone(e.target.value);
                    setUpdateError('');
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2
                    text-sm text-zinc-100 placeholder:text-zinc-600
                    focus:outline-none focus:border-zinc-600 transition-colors pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600">
                  {smr.unit}
                </span>
              </div>
              {updateError && (
                <p className="text-xs text-red-400">{updateError}</p>
              )}
              <textarea
                rows={2}
                placeholder="Бележка (по желание)..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2
                  text-sm text-zinc-100 placeholder:text-zinc-600
                  focus:outline-none focus:border-zinc-600 transition-colors resize-none"
              />
              <button
                onClick={handleUpdate}
                className="w-full py-2 text-sm bg-white text-zinc-950 rounded-lg font-medium
                  hover:bg-zinc-200 transition-colors"
              >
                Запази
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
