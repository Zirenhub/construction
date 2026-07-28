"use client";

import { Minus, AlertCircle, AlertTriangle, Flame } from "lucide-react";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

const priorityStyles: Record<
  TaskPriority,
  { selected: string; icon: string; hover: string }
> = {
  LOW: {
    selected:
      "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    icon: "text-emerald-500",
    hover:
      "hover:bg-emerald-500/5 hover:border-emerald-300 hover:text-emerald-600",
  },
  MEDIUM: {
    selected:
      "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300",
    icon: "text-amber-500",
    hover: "hover:bg-amber-400/5 hover:border-amber-300 hover:text-amber-600",
  },
  HIGH: {
    selected:
      "border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    icon: "text-orange-500",
    hover:
      "hover:bg-orange-500/5 hover:border-orange-300 hover:text-orange-600",
  },
  URGENT: {
    selected: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300",
    icon: "text-red-500",
    hover: "hover:bg-red-500/5 hover:border-red-300 hover:text-red-600",
  },
};

const priorities = [
  { key: "LOW" as TaskPriority, label: "Ниска", icon: Minus },
  { key: "MEDIUM" as TaskPriority, label: "Средна", icon: AlertCircle },
  { key: "HIGH" as TaskPriority, label: "Висока", icon: AlertTriangle },
  { key: "URGENT" as TaskPriority, label: "Спешна", icon: Flame },
];

export default function PrioritySelector({
  value,
  onChange,
}: PrioritySelectorProps) {
  return (
    <section>
      <p className="text-sm font-medium text-ink mb-2">Приоритет</p>
      <div className="grid grid-cols-4 gap-2">
        {priorities.map(({ key, label, icon: Icon }) => {
          const isSelected = value === key;
          const styles = priorityStyles[key];

          return (
            <button
              key={key}
              type="button"
              title={label}
              onClick={() => onChange(key)}
              className={`cursor-pointer flex flex-col items-center justify-center rounded-xl border p-2 text-xs font-medium transition-all ${
                isSelected
                  ? styles.selected
                  : `border-line bg-well text-ink-2 ${styles.hover}`
              } active:scale-95`}
            >
              <Icon
                size={16}
                className={isSelected ? styles.icon : "text-ink-4"}
              />
              <span className="hidden sm:inline mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
