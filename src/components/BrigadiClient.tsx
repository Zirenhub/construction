'use client';

import {
  addBrigadeMember,
  createBrigade,
  deleteBrigade,
  removeBrigadeMember,
} from '@/lib/actions';
import { BrigadeWithAll } from '@/lib/types';
import Link from 'next/link';
import { useState, useTransition } from 'react';

// ── Create Brigade Sheet ───────────────────────────────────

function CreateBrigadeSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!name.trim()) return;
    const n = name.trim();
    setName('');
    startTransition(async () => {
      await createBrigade(n);
      onClose();
    });
  }

  function handleClose() {
    setName('');
    onClose();
  }

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full md:max-w-sm bg-canvas md:border-l border-line
          z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="text-base font-medium text-ink">Нова бригада</h2>
          <button onClick={handleClose} className="text-ink-4 hover:text-ink-2 transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="flex-1 px-6 py-6">
          <label className="block text-xs font-medium text-ink-3 mb-1.5">Наименование</label>
          <input
            type="text"
            placeholder="напр. Бригада Иванов"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-surface border border-line rounded-lg px-3.5 py-2.5
              text-sm text-ink placeholder:text-ink-5
              focus:outline-none focus:border-line-3 transition-colors"
          />
        </div>
        <div className="px-6 py-4 border-t border-line flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm border border-line rounded-lg text-ink-3
              hover:bg-surface hover:text-ink-2 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="flex-1 py-2.5 text-sm bg-cta text-cta-fg rounded-lg font-medium
              hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Запазване...' : 'Създай'}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Add Member Inline Form ─────────────────────────────────

function AddMemberForm({ brigadeId, onDone }: { brigadeId: string; onDone: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!name.trim()) return;
    const n = name.trim();
    const r = role.trim();
    setName('');
    setRole('');
    startTransition(async () => {
      await addBrigadeMember({ brigadeId, name: n, role: r });
      onDone();
    });
  }

  return (
    <div className="pt-3 border-t border-line space-y-2">
      <p className="text-[10px] font-medium uppercase tracking-widest text-ink-5">Нов член</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Имe"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 min-w-0 bg-well border border-line rounded-lg px-3 py-2
            text-sm text-ink placeholder:text-ink-5
            focus:outline-none focus:border-line-3 transition-colors"
        />
        <input
          type="text"
          placeholder="Роля"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="w-28 bg-well border border-line rounded-lg px-3 py-2
            text-sm text-ink placeholder:text-ink-5
            focus:outline-none focus:border-line-3 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onDone}
          className="flex-1 py-2 text-xs border border-line rounded-lg text-ink-4
            hover:bg-lift hover:text-ink-2 transition-colors"
        >
          Отказ
        </button>
        <button
          onClick={handleAdd}
          disabled={isPending || !name.trim()}
          className="flex-1 py-2 text-xs bg-cta text-cta-fg rounded-lg font-medium
            hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Запазване...' : 'Добави'}
        </button>
      </div>
    </div>
  );
}

// ── Brigade Card ───────────────────────────────────────────

function BrigadeCard({ brigade }: { brigade: BrigadeWithAll }) {
  const [addingMember, setAddingMember] = useState(false);
  const [removePending, startRemoveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  function handleRemoveMember(memberId: string) {
    startRemoveTransition(async () => {
      await removeBrigadeMember(memberId);
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteBrigade(brigade.id);
    });
  }

  return (
    <div className="border border-line rounded-xl bg-surface overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div>
          <p className="text-sm font-medium text-ink">{brigade.name}</p>
          <p className="text-xs text-ink-5 mt-0.5">{brigade.members.length} члена</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deletePending}
          title="Изтрий бригада"
          className="text-ink-ghost hover:text-red-400 transition-colors shrink-0 disabled:opacity-50 mt-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* Members */}
        <div className="space-y-1.5">
          {brigade.members.length === 0 && !addingMember ? (
            <p className="text-xs text-ink-5">Няма добавени членове.</p>
          ) : (
            brigade.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 py-1.5 px-2.5 bg-well rounded-lg"
              >
                <div className="min-w-0">
                  <span className="text-xs text-ink-2">{m.name}</span>
                  {m.role && (
                    <span className="ml-2 text-[10px] text-ink-4">{m.role}</span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveMember(m.id)}
                  disabled={removePending}
                  className="text-ink-ghost hover:text-red-400 transition-colors shrink-0 disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}

          {addingMember ? (
            <AddMemberForm brigadeId={brigade.id} onDone={() => setAddingMember(false)} />
          ) : (
            <button
              onClick={() => setAddingMember(true)}
              className="flex items-center gap-1.5 text-xs text-ink-5 hover:text-ink-2 transition-colors mt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Добави член
            </button>
          )}
        </div>

        {/* Active SMR assignments */}
        {brigade.smr.length > 0 && (
          <div className="border-t border-line pt-3 space-y-1.5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-ink-5 mb-2">
              Активни СМР
            </p>
            {brigade.smr.map((s) => (
              <Link
                key={s.id}
                href={`/obekti/${s.podObekt.project.id}/${s.podObekt.id}`}
                className="flex items-start justify-between gap-3 py-2 px-2.5 bg-well rounded-lg
                  hover:bg-lift transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-xs text-ink-2 truncate group-hover:text-ink">{s.name}</p>
                  <p className="text-[10px] text-ink-5 mt-0.5">
                    {s.podObekt.name}
                    <span className="mx-1 text-ink-ghost">›</span>
                    {s.podObekt.project.name}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-ink-4 tabular-nums">
                    {Math.round((s.done / s.quantity) * 100)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Client ────────────────────────────────────────────

export default function BrigadiClient({ initialBrigades }: { initialBrigades: BrigadeWithAll[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-line md:px-6 md:py-5">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-medium text-ink md:text-lg">Бригади</h1>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lift text-ink-4">
            {initialBrigades.length}
          </span>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-line-2 rounded-lg
            text-ink-2 hover:bg-lift hover:text-ink transition-colors md:px-3.5 md:text-sm"
        >
          + Нова бригада
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {initialBrigades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-ink-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-sm text-ink-4">Няма създадени бригади.</p>
            <p className="text-xs text-ink-5 mt-1">Създайте първата бригада, за да я назначите на СМР.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialBrigades.map((b) => (
              <BrigadeCard key={b.id} brigade={b} />
            ))}
          </div>
        )}
      </div>

      <CreateBrigadeSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
