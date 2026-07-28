"use client";

import { Info } from "lucide-react";

type Props = {
  unit: string;
  pricePerUnit: number;
  totalValue: number;
  note?: string | null;
};

export function SmrMetaGrid({ unit, pricePerUnit, totalValue, note }: Props) {
  const metaItems = [
    { label: "Мярка", value: unit },
    {
      label: "Ед. цена",
      value:
        pricePerUnit > 0 ? `${pricePerUnit.toLocaleString("bg-BG")} лв` : "—",
    },
    {
      label: "Обща стойност",
      value: totalValue > 0 ? `${totalValue.toLocaleString("bg-BG")} лв` : "—",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        {metaItems.map(({ label, value }) => (
          <div
            key={label}
            className="bg-well/60 border border-line/50 rounded-xl p-2.5 transition-colors hover:bg-well"
          >
            <p className="text-[10px] font-medium tracking-wide uppercase text-ink-5 mb-0.5">
              {label}
            </p>
            <p className="text-xs font-semibold text-ink-2 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* Creation Note Callout */}
      {note && (
        <div className="flex gap-2.5 bg-well/40 border border-line/40 rounded-xl p-3 text-xs">
          <Info className="w-4 h-4 text-ink-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-5">
              Бележка при създаване
            </p>
            <p className="text-ink-3 leading-relaxed break-words">{note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
