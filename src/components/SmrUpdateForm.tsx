"use client";

import { Check, Plus, Loader2 } from "lucide-react";

type Props = {
  unit: string;
  quantity: number;
  done: number;
  updateDone: string;
  updateNote: string;
  updateError: string;
  isPending: boolean;
  onDoneChange: (val: string) => void;
  onNoteChange: (val: string) => void;
  onSubmit: () => void;
  onCompleteAll: () => void;
};

export function SmrUpdateForm({
  unit,
  quantity,
  done,
  updateDone,
  updateNote,
  updateError,
  isPending,
  onDoneChange,
  onNoteChange,
  onSubmit,
  onCompleteAll,
}: Props) {
  const remaining = quantity - done;

  return (
    <div className="bg-surface/50 border border-line/80 rounded-xl p-3.5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-5">
          Обнови напредък
        </span>
        <span className="text-[11px] text-ink-4 font-medium tabular-nums">
          Остават:{" "}
          <strong className="text-ink-2">
            {remaining} {unit}
          </strong>
        </span>
      </div>

      {/* Primary Input & Action Group */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <input
              type="number"
              min="0"
              max={quantity}
              placeholder="0"
              value={updateDone}
              onChange={(e) => onDoneChange(e.target.value)}
              className="w-full bg-well border border-line rounded-lg pl-3 pr-10 py-2 text-sm font-medium text-ink placeholder:text-ink-5 focus:outline-none focus:border-line-3 focus:ring-1 focus:ring-line-3 transition-all tabular-nums"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-4 pointer-events-none select-none">
              {unit}
            </span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isPending}
            className="px-4 py-2 bg-cta hover:bg-cta-hover text-cta-fg text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5 shrink-0"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Запази</span>
              </>
            )}
          </button>
        </div>

        {updateError && (
          <p className="text-xs text-red-400 font-medium px-1">{updateError}</p>
        )}

        <textarea
          rows={2}
          placeholder="Бележка към обновяването (по желание)..."
          value={updateNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full bg-well border border-line rounded-lg px-3 py-1.5 text-xs text-ink placeholder:text-ink-5 focus:outline-none focus:border-line-3 focus:ring-1 focus:ring-line-3 transition-all resize-none"
        />
      </div>

      {/* Secondary Quick Action: Complete Remaining */}
      {remaining > 0 && (
        <button
          type="button"
          onClick={onCompleteAll}
          disabled={isPending}
          className="w-full py-1.5 px-3 text-xs font-medium border border-line/60 rounded-lg text-ink-3 hover:border-green-600/50 hover:bg-green-500/5 hover:text-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span>
            Декларирай завършено ({remaining} {unit})
          </span>
        </button>
      )}
    </div>
  );
}
