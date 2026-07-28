"use client";

import { ReactNode } from "react";

interface SelectionCardProps<T> {
  item: T;
  onSelect: (item: T) => void;
  selected?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}

export default function SelectionCard<T>({
  item,
  onSelect,
  selected = false,
  disabled = false,
  isActive = true,
  title,
  subtitle,
  meta,
}: SelectionCardProps<T>) {
  const selectionStyles = selected
    ? "border border-ink-5 bg-lift shadow-sm"
    : "border-line bg-surface hover:border-line-2 hover:bg-lift/70";

  const disabledStyles = disabled
    ? "opacity-40 cursor-not-allowed"
    : "cursor-pointer active:scale-[0.992]";

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onSelect(item)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className={`group relative w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-line-3 ${selectionStyles} ${disabledStyles}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span
          className={`w-2 h-2 rounded-full shrink-0 transition-all ${
            isActive
              ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              : "bg-ink-ghost"
          }`}
          title={isActive ? "Активен" : "Неактивен"}
        />

        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <span className="text-sm font-medium text-ink truncate group-hover:text-ink transition-colors">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-ink-4 truncate mt-0.5 font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pl-1">
        {meta}

        <div
          className={`flex items-center justify-center w-5 h-5 rounded-full text-xs transition-all ${
            selected
              ? "bg-cta text-cta-fg font-semibold"
              : "text-ink-5 group-hover:text-ink-2 group-hover:translate-x-0.5"
          }`}
        >
          {selected ? "✓" : "→"}
        </div>
      </div>
    </div>
  );
}
