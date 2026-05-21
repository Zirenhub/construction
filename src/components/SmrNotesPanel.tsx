'use client';

import { SMRNote } from '@/generated/prisma/client';
import { useState, useTransition } from 'react';

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = {
  smrName: string;
  notes: SMRNote[];
  onAddNoteAction: (content: string) => Promise<void>;
  onClose: () => void;
};

export default function SmrNotesPanel({
  smrName,
  notes,
  onAddNoteAction,
  onClose,
}: Props) {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!text.trim()) return;
    const content = text.trim();
    setText('');
    startTransition(async () => {
      await onAddNoteAction(content);
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center md:justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full md:max-w-lg bg-canvas border-t border-line
          md:border md:rounded-2xl rounded-t-2xl
          max-h-[75vh] md:max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">Бележки</p>
            <p className="text-xs text-ink-4 truncate mt-0.5">{smrName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-4 hover:text-ink-2 transition-colors text-xl leading-none ml-4 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {notes.length === 0 ? (
            <p className="text-sm text-ink-5">Няма добавени бележки.</p>
          ) : (
            [...notes].reverse().map((note) => (
              <div key={note.id} className="bg-surface border border-line rounded-xl p-3.5 space-y-1.5">
                <p className="text-sm text-ink-2 whitespace-pre-wrap">{note.content}</p>
                <p className="text-[11px] text-ink-5">{formatDate(note.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        {/* Add note */}
        <div className="px-5 py-4 border-t border-line space-y-2.5 shrink-0">
          <textarea
            rows={3}
            placeholder="Нова бележка..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-surface border border-line rounded-xl px-3.5 py-2.5
              text-sm text-ink placeholder:text-ink-5
              focus:outline-none focus:border-line-3 transition-colors resize-none"
          />
          <button
            onClick={handleAdd}
            disabled={isPending || !text.trim()}
            className="w-full py-2.5 text-sm bg-cta text-cta-fg rounded-xl font-medium
              hover:bg-cta-hover transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Запазване...' : 'Добави бележка'}
          </button>
        </div>
      </div>
    </div>
  );
}
