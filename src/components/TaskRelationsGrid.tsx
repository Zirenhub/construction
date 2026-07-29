"use client";

import { Building2, Users, HardHat, ClipboardList, X } from "lucide-react";
import type { TaskFormValues } from "./CreateTask";

interface TaskRelationsGridProps {
  form: TaskFormValues;
  onOpenProjects: () => void;
  onOpenPodObekti: () => void;
  onOpenBrigades: () => void;
  onOpenBrigadeMembers: () => void;
  onOpenSMR?: () => void;
  onRemove: (key: keyof TaskFormValues) => void;
}

export default function TaskRelationsGrid({
  form,
  onOpenProjects,
  onOpenPodObekti,
  onOpenBrigades,
  onOpenBrigadeMembers,
  onOpenSMR,
  onRemove,
}: TaskRelationsGridProps) {
  const relationFields = [
    {
      key: "project" as keyof TaskFormValues,
      icon: Building2,
      selected: form.project,
      label: form.project ? form.project.name : "Избери проект",
      onClick: onOpenProjects,
    },
    {
      key: "podObekt" as keyof TaskFormValues,
      icon: Building2,
      selected: form.podObekt,
      label: form.podObekt ? form.podObekt.name : "Избери подобект",
      onClick: onOpenPodObekti,
    },
    {
      key: "brigade" as keyof TaskFormValues,
      icon: Users,
      selected: form.brigade,
      label: form.brigade ? form.brigade.name : "Избери бригада",
      onClick: onOpenBrigades,
    },
    {
      key: "brigadeMemberId" as keyof TaskFormValues,
      icon: HardHat,
      selected: form.brigadeMemberId,
      label: form.brigadeMemberId
        ? form.brigadeMemberId.name
        : "Избери член на бригада",
      onClick: onOpenBrigadeMembers,
    },
    {
      key: "smr" as keyof TaskFormValues,
      icon: ClipboardList,
      selected: form.smr,
      label: form.smr ? form.smr.name : "Избери СМР",
      onClick: onOpenSMR,
    },
  ];

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-ink">Свързване</p>

      <div className="grid gap-2">
        {relationFields.map(({ key, icon: Icon, label, onClick, selected }) => {
          const isSelected = Boolean(selected);

          return (
            <div key={key} className="flex gap-2">
              <button
                onClick={onClick}
                type="button"
                className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 text-sm transition-all active:scale-[0.99] ${
                  isSelected
                    ? "border-line-3 bg-lift font-medium text-ink shadow-sm"
                    : "border-line bg-surface text-ink-2 hover:bg-lift hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={17} className="text-ink-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>

                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                )}
              </button>

              {isSelected && (
                <button
                  type="button"
                  onClick={() => onRemove(key)}
                  title="Премахни избора"
                  className="flex items-center justify-center w-11 shrink-0 rounded-xl border border-line bg-surface text-ink-4 hover:border-line-2 hover:bg-lift hover:text-ink transition-colors active:scale-95"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
