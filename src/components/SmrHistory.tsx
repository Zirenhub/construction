"use client";

import { SMRUpdate } from "@/generated/prisma/client";
import { History } from "lucide-react";

type Props = {
  updates: SMRUpdate[];
  unit: string;
};

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("bg-BG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SmrHistory({ updates, unit }: Props) {
  if (updates.length === 0) return null;

  const reversedUpdates = [...updates].reverse();

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-5">
        <History className="w-3 h-3 text-ink-4" />
        <span>История на напредъка</span>
      </div>

      {/* Visual Vertical Timeline */}
      <div className="relative pl-3 space-y-3 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-line/80">
        {reversedUpdates.map((u, idx) => (
          <div key={u.id} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[11px] top-1.5 w-2 h-2 rounded-full border-2 border-surface transition-transform group-hover:scale-125 ${
                idx === 0
                  ? "bg-green-500 ring-2 ring-green-500/20"
                  : "bg-line-3"
              }`}
            />

            <div className="bg-well/30 border border-line/40 rounded-lg p-2.5 text-xs transition-colors group-hover:bg-well/60">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-ink-2 tabular-nums">
                  +{u.done} {unit}
                </span>
                <time className="text-[10px] font-medium text-ink-5 tabular-nums">
                  {formatDate(u.createdAt)}
                </time>
              </div>

              {u.note && (
                <p className="text-ink-4 text-[11px] mt-1 leading-snug break-words">
                  {u.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
