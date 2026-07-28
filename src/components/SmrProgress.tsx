"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  done: number;
  quantity: number;
  unit: string;
  earned: number;
  totalValue: number;
  act?: number | null;
  paid: boolean;
  isPaidPending: boolean;
  onTogglePaid: (e: React.MouseEvent) => void;
};

export function SmrProgress({
  done,
  quantity,
  unit,
  earned,
  totalValue,
  act,
  paid,
  isPaidPending,
  onTogglePaid,
}: Props) {
  const pct =
    quantity > 0 ? Math.min(100, Math.round((done / quantity) * 100)) : 0;

  return (
    <>
      {/* Progress Bar */}
      <div className="w-full bg-line rounded-full h-1 mb-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            pct === 100 ? "bg-line-3" : "bg-green-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Quantities & Financials */}
      <div className="flex items-center justify-between text-xs text-ink-4 tabular-nums mb-3">
        <span>
          {done} / {quantity} {unit}
        </span>
        {totalValue > 0 && (
          <span>
            {earned.toLocaleString("bg-BG")} /{" "}
            {totalValue.toLocaleString("bg-BG")} лв
          </span>
        )}
      </div>

      {/* Act & Paid Controls */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {act != null && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lift text-ink-3">
            Акт №{act}
          </span>
        )}

        <button
          type="button"
          onClick={onTogglePaid}
          disabled={isPaidPending}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors disabled:opacity-50 ${
            paid
              ? "border-green-800 bg-green-950 text-green-400 hover:bg-green-900"
              : "border-line-2 bg-lift text-ink-4 hover:border-line-3 hover:text-ink-2"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              paid ? "bg-green-400" : "bg-line-3"
            }`}
          />
          Платено
        </button>
      </div>
    </>
  );
}
