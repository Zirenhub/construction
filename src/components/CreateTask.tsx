"use client";

import { useState, useTransition } from "react";
import { format, parseISO, isValid } from "date-fns";
import {
  CalendarDays,
  Users,
  Building2,
  HardHat,
  ClipboardList,
  ArrowLeftCircleIcon,
  Minus,
  AlertCircle,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { getProjects } from "@/lib/actions";
import { ProjectWithRelations } from "@/lib/types";
import SelectProject from "./SelectProject";
import Modal from "./Modal";

type CreateTaskProps = {
  goBack: () => void;
  onSaveAction?: (taskData: TaskFormValues) => Promise<void> | void;
};

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskFormValues = {
  title: string;
  description: string;
  dueDate: string; // ISO string format for backend consistency
  isAllDay: boolean;
  priority: TaskPriority;
  projectId: ProjectWithRelations | null;
  subObjectId: string;
  brigadeId: string;
  brigadeMemberId: string;
  smrId: string;
};

const emptyTask: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  isAllDay: false,
  priority: "MEDIUM",
  projectId: null,
  subObjectId: "",
  brigadeId: "",
  brigadeMemberId: "",
  smrId: "",
};

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

type TOpenModal = "none" | "selectProject" | "selectBrigade" | "selectPodObekt";

export default function CreateTask({ goBack, onSaveAction }: CreateTaskProps) {
  const [form, setForm] = useState<TaskFormValues>(emptyTask);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const [openModal, setOpenModal] = useState<TOpenModal>("none");
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Въведете заглавие на задачата";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    startTransition(async () => {
      if (onSaveAction) {
        await onSaveAction(form);
      }
      goBack();
    });
  }

  // Quick preset handlers using standard Date objects
  const setQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(9, 0, 0, 0);
    setForm((prev) => ({ ...prev, dueDate: d.toISOString() }));
  };

  // Format ISO string to display safely as dd.MM.yyyy HH:mm to user
  const getDisplayDateText = (isoString: string) => {
    if (!isoString) return "Изберете срок...";
    const date = parseISO(isoString);
    if (!isValid(date)) return "Изберете срок...";
    return format(date, "dd.MM.yyyy HH:mm");
  };

  const handleGetProjects = async () => {
    setOpenModal("selectProject");
    setIsModalLoading(true);
    // check if we have projects dont bother fetching ?
    const projects = await getProjects();
    setProjects(projects);
    setIsModalLoading(false);
  };

  const handleGetPodObekti = async () => {
    setOpenModal("selectPodObekt");
  };

  const handleSelectProject = (project: ProjectWithRelations) => {
    setForm((prev) => ({ ...prev, projectId: project }));
    setOpenModal("none");
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          type="button"
          className="p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors"
        >
          <ArrowLeftCircleIcon size={24} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-ink tracking-tight">
            Създаване на нова задача
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic */}
        <section className="space-y-3">
          <div>
            <input
              placeholder="Заглавие на задачата"
              value={form.title}
              onChange={(e) => {
                setForm({ ...form, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              className={`w-full rounded-xl bg-well border px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 outline-none transition-all ${
                errors.title
                  ? "border-red-500"
                  : "border-line focus:border-line-3 focus:ring-1 focus:ring-line-3"
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
            className="w-full rounded-xl bg-well border border-line px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 resize-none outline-none focus:border-line-3 focus:ring-1 focus:ring-line-3 transition-all"
          />
        </section>

        {/* Date & Time Section */}
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
                className="px-2 py-0.5 rounded-md bg-well border border-line text-ink-2 hover:bg-lift transition-colors"
              >
                Днес
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2 py-0.5 rounded-md bg-well border border-line text-ink-2 hover:bg-lift transition-colors"
              >
                Утре
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-well border border-line px-3.5 focus-within:border-line-3 focus-within:ring-1 focus-within:ring-line-3 transition-all">
            <CalendarDays size={16} className="text-ink-4 shrink-0" />
            <input
              type="datetime-local"
              value={
                form.dueDate
                  ? format(parseISO(form.dueDate), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              disabled={form.isAllDay}
              onChange={(e) => {
                const val = e.target.value;
                setForm({
                  ...form,
                  dueDate: val ? new Date(val).toISOString() : "",
                });
              }}
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
                  return {
                    ...prev,
                    isAllDay,
                    dueDate: dateObj.toISOString(),
                  };
                });
              }}
              className="rounded border-line text-cta focus:ring-cta w-4 h-4 accent-cta"
            />
            Целодневна задача
          </label>
        </section>

        {/* Priority */}
        <section>
          <p className="text-sm font-medium text-ink mb-2">Приоритет</p>

          <div className="grid grid-cols-4 gap-2">
            {[
              { key: "LOW" as TaskPriority, label: "Ниска", icon: Minus },
              {
                key: "MEDIUM" as TaskPriority,
                label: "Средна",
                icon: AlertCircle,
              },
              {
                key: "HIGH" as TaskPriority,
                label: "Висока",
                icon: AlertTriangle,
              },
              { key: "URGENT" as TaskPriority, label: "Спешна", icon: Flame },
            ].map(({ key, label, icon: Icon }) => {
              const isSelected = form.priority === key;
              const styles = priorityStyles[key];

              return (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onClick={() => setForm({ ...form, priority: key })}
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

        {/* Relations */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-ink">Свързване</p>

          <div className="grid gap-2">
            {[
              {
                key: "projectId",
                icon: Building2,
                selected: form.projectId,
                label: form.projectId ? form.projectId.name : "Избери проект",
                onClick: () => handleGetProjects(),
              },
              {
                key: "subObjectId",
                icon: Building2,
                label: form.subObjectId ? "Избран подобект" : "Избери подобект",
                onClick: () => handleGetPodObekti(),
              },
              {
                key: "brigadeId",
                icon: Users,
                label: form.brigadeId ? "Избрана бригада" : "Избери бригада",
                onClick: () => handleGetProjects(),
              },
              {
                key: "brigadeMemberId",
                icon: HardHat,
                label: form.brigadeMemberId
                  ? "Избран член"
                  : "Избери член на бригада",
                onClick: () => handleGetProjects(),
              },
              {
                key: "smrId",
                icon: ClipboardList,
                label: form.smrId ? "Избрано СМР" : "Избери СМР",
                onClick: () => handleGetProjects(),
              },
            ].map(({ icon: Icon, label, onClick, selected }, idx) => (
              <button
                key={idx}
                onClick={onClick}
                type="button"
                className={`${selected ? "bg-green-300" : "bg-red-300"} w-full flex items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-sm text-ink-2 hover:bg-lift hover:text-ink active:scale-[0.99] transition-all`}
              >
                <Icon size={17} className="text-ink-4 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleSave}
        className="mt-6 w-full rounded-xl bg-cta text-cta-fg py-3 text-sm font-medium hover:bg-cta-hover active:scale-[0.99] transition-all shadow-sm disabled:opacity-50"
      >
        {isPending ? "Създаване..." : "Създай задача"}
      </button>

      <Modal
        isLoading={isModalLoading}
        title="Избери проект"
        onClose={() => {
          setOpenModal("none");
        }}
        isOpen={openModal === "selectProject"}
      >
        <SelectProject
          projects={projects}
          handleSelectProject={handleSelectProject}
        />
      </Modal>

      <Modal
        isLoading={isModalLoading}
        title="Избери подобект"
        onClose={() => {
          setOpenModal("none");
        }}
        isOpen={openModal === "selectPodObekt"}
      >
        <p>test</p>
      </Modal>
    </div>
  );
}
