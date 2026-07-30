"use client";

import { useState, useTransition } from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarDays, ArrowLeftCircleIcon } from "lucide-react";
import { getBrigades, getPodObekti, getProjects, getSMRs } from "@/lib/actions";
import {
  BrigadeWithAll,
  CreateTaskData,
  ProjectWithRelations,
  SMRWithAll,
  TPodObekt,
} from "@/lib/types";

import PrioritySelector from "./PrioritySelector";
import TaskRelationsGrid from "./TaskRelationsGrid";
import SelectProjectModal from "./SelectProjectModal";
import SelectPodObektModal from "./SelectPodObektModal";
import SelectBrigadeModal from "./SelectBrigadeModal";
import SelectBrigadeMemberModal from "./SelectBrigadeMemberModal";
import SelectSMRModal from "./SelectSMRModal";

const emptyTask: CreateTaskData = {
  title: "",
  description: "",
  dueDate: "",
  isAllDay: false,
  priority: "MEDIUM",
  project: null,
  podObekt: null,
  brigade: null,
  brigadeMemberId: null,
  smr: null,
};

type TOpenModal =
  | "none"
  | "selectProject"
  | "selectBrigade"
  | "selectPodObekt"
  | "selectBrigadeMember"
  | "selectSMR";

export default function CreateTask({
  onSaveAction,
}: {
  onSaveAction?: (taskData: CreateTaskData) => Promise<void> | void;
}) {
  const [form, setForm] = useState<CreateTaskData>(emptyTask);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [openModal, setOpenModal] = useState<TOpenModal>("none");
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [podObekti, setPodObekti] = useState<TPodObekt[]>([]);
  const [brigades, setBrigades] = useState<BrigadeWithAll[]>([]);
  const [smrs, setSmrs] = useState<SMRWithAll[]>([]);

  function handleSave() {
    if (!form.title.trim()) {
      setErrors({ title: "Въведете заглавие на задачата" });
      return;
    }

    startTransition(async () => {
      if (onSaveAction) await onSaveAction(form);
    });
  }

  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(9, 0, 0, 0);
    setForm((prev) => ({ ...prev, dueDate: d.toISOString() }));
  };

  const getDisplayDateText = (isoString: string) => {
    if (!isoString) return "Изберете срок...";
    const date = parseISO(isoString);
    return isValid(date)
      ? format(date, "dd.MM.yyyy HH:mm")
      : "Изберете срок...";
  };

  const handleFetchData = async <T,>(
    type: TOpenModal,
    fetcher: () => Promise<T>,
    setter: (data: T) => void,
  ) => {
    setOpenModal(type);
    setIsModalLoading(true);
    const data = await fetcher();
    setter(data);
    setIsModalLoading(false);
  };

  const handleOpenMemberModal = async () => {
    setOpenModal("selectBrigadeMember");
    if (brigades.length === 0) {
      setIsModalLoading(true);
      const data = await getBrigades();
      setBrigades(data);
      setIsModalLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Title & Description */}
        <section className="space-y-3">
          <div>
            <input
              placeholder="Заглавие на задачата"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`w-full rounded-xl bg-well border px-3.5 py-2.5 text-sm text-ink outline-none transition-all ${
                errors.title
                  ? "border-red-500"
                  : "border-line focus:border-line-3"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 pl-1">{errors.title}</p>
            )}
          </div>

          <textarea
            placeholder="Описание..."
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl bg-well border border-line px-3.5 py-2.5 text-sm text-ink resize-none outline-none focus:border-line-3 transition-all"
          />
        </section>

        {/* Due Date */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-ink">Срок</p>
              {form.dueDate && (
                <span className="text-xs text-ink-4">
                  ({getDisplayDateText(form.dueDate)})
                </span>
              )}
            </div>
            <div className="flex gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2 py-0.5 rounded-md bg-well border border-line text-ink-2 hover:bg-lift"
              >
                Днес
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2 py-0.5 rounded-md bg-well border border-line text-ink-2 hover:bg-lift"
              >
                Утре
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-well border border-line px-3.5 focus-within:border-line-3 transition-all">
            <CalendarDays size={16} className="text-ink-4 shrink-0" />
            <input
              type="datetime-local"
              value={
                form.dueDate
                  ? format(parseISO(form.dueDate), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              disabled={form.isAllDay}
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : "",
                })
              }
              className="w-full py-2.5 bg-transparent text-sm text-ink outline-none cursor-pointer disabled:opacity-50"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-2 select-none cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={form.isAllDay}
              onChange={(e) => {
                const isAllDay = e.target.checked;
                setForm((prev) => {
                  if (!prev.dueDate) return { ...prev, isAllDay };
                  const dateObj = parseISO(prev.dueDate);
                  if (isAllDay) dateObj.setHours(0, 0, 0, 0);
                  return { ...prev, isAllDay, dueDate: dateObj.toISOString() };
                });
              }}
              className="rounded border-line text-cta focus:ring-cta w-4 h-4 accent-cta"
            />
            Целодневна задача
          </label>
        </section>

        {/* Priority Selector */}
        <PrioritySelector
          value={form.priority}
          onChange={(priority) => setForm({ ...form, priority })}
        />

        {/* Relations Grid */}
        <TaskRelationsGrid
          form={form}
          onOpenProjects={() =>
            handleFetchData("selectProject", getProjects, setProjects)
          }
          onOpenPodObekti={() =>
            handleFetchData("selectPodObekt", getPodObekti, setPodObekti)
          }
          onOpenBrigades={() =>
            handleFetchData("selectBrigade", getBrigades, setBrigades)
          }
          onOpenBrigadeMembers={handleOpenMemberModal}
          onOpenSMR={() => handleFetchData("selectSMR", getSMRs, setSmrs)}
          onRemove={(key) =>
            setForm((prev) => ({
              ...prev,
              [key]: null,
            }))
          }
        />
      </div>

      {/* Save Button */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleSave}
        className="mt-6 w-full rounded-xl bg-cta text-cta-fg py-3 text-sm font-medium hover:bg-cta-hover active:scale-[0.99] transition-all shadow-sm disabled:opacity-50"
      >
        {isPending ? "Създаване..." : "Създай задача"}
      </button>

      {/* Selection Modals */}
      <SelectProjectModal
        isOpen={openModal === "selectProject"}
        isLoading={isModalLoading}
        projects={projects}
        selectedProjectId={form.project?.id}
        onClose={() => setOpenModal("none")}
        onSelect={(project) => {
          setForm((prev) => ({ ...prev, project }));
          setOpenModal("none");
        }}
      />

      <SelectPodObektModal
        isOpen={openModal === "selectPodObekt"}
        isLoading={isModalLoading}
        podObekti={podObekti}
        selectedPodObektId={form.podObekt?.id}
        selectedProject={form.project}
        onClose={() => setOpenModal("none")}
        onSelect={(podObekt) => {
          setForm((prev) => ({ ...prev, podObekt }));
          setOpenModal("none");
        }}
      />

      <SelectBrigadeModal
        isOpen={openModal === "selectBrigade"}
        isLoading={isModalLoading}
        brigades={brigades}
        selectedBrigadeId={form.brigade?.id}
        selectedProject={form.project}
        selectedPodObekt={form.podObekt}
        onClose={() => setOpenModal("none")}
        onSelect={(brigade) => {
          setForm((prev) => ({ ...prev, brigade }));
          setOpenModal("none");
        }}
      />

      <SelectBrigadeMemberModal
        isOpen={openModal === "selectBrigadeMember"}
        isLoading={isModalLoading}
        brigades={brigades}
        selectedMemberId={form.brigadeMemberId?.id}
        selectedBrigade={form.brigade}
        selectedProject={form.project}
        selectedPodObekt={form.podObekt}
        onClose={() => setOpenModal("none")}
        onSelect={(member, parentBrigade) => {
          setForm((prev) => ({
            ...prev,
            brigadeMemberId: member,
            brigade: prev.brigade || parentBrigade,
          }));
          setOpenModal("none");
        }}
      />

      <SelectSMRModal
        isOpen={openModal === "selectSMR"}
        isLoading={isModalLoading}
        smrs={smrs}
        selectedSmr={form.smr}
        onSelect={(smr) => {
          setForm((prev) => ({
            ...prev,
            smr,
          }));
          setOpenModal("none");
        }}
        onClose={() => setOpenModal("none")}
      />
    </>
  );
}
