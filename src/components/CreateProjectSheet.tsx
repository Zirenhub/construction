"use client";

import { useState, useTransition } from "react";

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSaveAction: (project: { name: string; location: string }) => Promise<void>;
};

const empty = { name: "", location: "" };

export default function CreateProjectSheet({
  open,
  onCloseAction,
  onSaveAction,
}: Props) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function reset() {
    setForm(empty);
    setErrors({});
  }

  function handleClose() {
    reset();
    onCloseAction();
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Задължително поле";
    if (!form.location.trim()) e.location = "Задължително поле";
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    startTransition(async () => {
      await onSaveAction({
        name: form.name.trim(),
        location: form.location.trim(),
      });
      reset();
      onCloseAction();
    });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleClose();
  }

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      <div
        onKeyDown={handleKey}
        className={`fixed top-0 right-0 h-full w-full md:max-w-md bg-canvas md:border-l border-line
          z-50 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div>
            <h2 className="text-base font-medium text-ink">Нов обект</h2>
            <p className="text-xs text-ink-4 mt-0.5">
              Попълнете данните за новия обект
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-ink-4 hover:text-ink-2 transition-colors text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">
              Име на обекта <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="напр. Жилищна сграда А1"
              value={form.name}
              autoFocus
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              className={`w-full bg-surface border rounded-lg px-3.5 py-2.5
                text-sm text-ink placeholder:text-ink-5
                focus:outline-none transition-colors
                ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-line focus:border-line-3"}`}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-3 mb-1.5">
              Местоположение <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="напр. София, кв. Младост"
              value={form.location}
              onChange={(e) => {
                setForm({ ...form, location: e.target.value });
                setErrors({ ...errors, location: "" });
              }}
              className={`w-full bg-surface border rounded-lg px-3.5 py-2.5
                text-sm text-ink placeholder:text-ink-5
                focus:outline-none transition-colors
                ${errors.location ? "border-red-500/50 focus:border-red-500" : "border-line focus:border-line-3"}`}
            />
            {errors.location && (
              <p className="text-xs text-red-400 mt-1">{errors.location}</p>
            )}
          </div>

          <div className="bg-surface border border-line rounded-lg p-3.5 space-y-1.5">
            <p className="text-xs font-medium text-ink-3">
              След създаването можете да добавите:
            </p>
            <ul className="space-y-1">
              {[
                "Под обекти (фасади, етажи, секции...)",
                "СМР задачи към всеки под обект",
                "Бригади и аванси",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-ink-5"
                >
                  <span className="w-1 h-1 rounded-full bg-line-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 text-sm border border-line rounded-lg text-ink-3
              hover:bg-surface hover:text-ink-2 transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2.5 text-sm bg-cta text-cta-fg rounded-lg font-medium
              hover:bg-cta-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Запазване..." : "Създай обект"}
          </button>
        </div>
      </div>
    </>
  );
}
