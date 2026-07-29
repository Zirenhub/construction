"use client";

import { MessageSquare, ChevronDown } from "lucide-react";

type Props = {
  name: string;
  brigadeName?: string;
  pct?: number;
  notesCount: number;
  expanded?: boolean;
  onOpenNotes: (e: React.MouseEvent) => void;
};

export function SmrHeader({
  name,
  brigadeName,
  pct,
  notesCount,
  expanded,
  onOpenNotes,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="min-w-0">
        <h4 className="text-sm font-medium text-ink truncate">{name}</h4>
        {brigadeName && (
          <p className="text-xs text-ink-4 mt-0.5">{brigadeName}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
        <span className="text-xs font-medium text-ink-3 tabular-nums">
          {pct}%
        </span>

        <button
          type="button"
          onClick={onOpenNotes}
          className="flex items-center gap-1 text-ink-5 hover:text-ink-2 transition-colors p-1 rounded hover:bg-well"
          title="Бележки"
          aria-label={`Бележки (${notesCount})`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {notesCount > 0 && (
            <span className="text-[10px] font-medium">{notesCount}</span>
          )}
        </button>

        <ChevronDown
          className={`w-4 h-4 text-ink-5 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>
    </div>
  );
}
