"use client";

import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import CreateTask from "./CreateTask";

type ActiveView = "layout" | "tasks" | "create" | "none";
type LayoutProps = {
  openTasks: (e: React.MouseEvent) => void;
  openCreate: (e: React.MouseEvent) => void;
};

function InitialLayout({ openTasks, openCreate }: LayoutProps) {
  const newTasksCount = 3; // placeholder
  const date = new Date();

  const day = date.toLocaleDateString("bg-BG", {
    day: "2-digit",
  });

  const month = date.toLocaleDateString("bg-BG", {
    month: "short",
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-ink tracking-tight">
            Задачи
          </h2>
          <p className="text-xs text-ink-4 mt-0.5">
            Управление на дневните задачи
          </p>
        </div>

        {/* Date */}
        <div className="flex flex-col items-center rounded-xl bg-lift border border-line px-3 py-2 text-ink-2">
          <span className="text-base font-semibold leading-none">{day}</span>
          <span className="text-[10px] uppercase text-ink-4 mt-1 tracking-wider">
            {month}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {/* Primary */}
        <button
          onClick={openTasks}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-cta text-cta-fg text-sm font-medium hover:bg-cta-hover active:scale-[0.99] transition-all duration-150"
        >
          <CheckSquare size={17} />
          Виж задачи
        </button>

        {/* Secondary */}
        <button
          onClick={openCreate}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-well border border-line text-ink-2 text-sm font-medium hover:bg-lift hover:text-ink active:scale-[0.99] transition-all duration-150"
        >
          <Plus size={17} />
          Създай задача
        </button>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-line text-center text-xs text-ink-4">
        {newTasksCount} нови задачи за днес
      </div>
    </>
  );
}

export function Tasks() {
  const [view, setView] = useState<ActiveView>("none");
  const newTasksCount = 3; // placeholder

  const handleOpenCloseLogic = () => {
    if (view !== "none") {
      setView("none");
    } else {
      setView("layout");
    }
  };

  const openCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView("create");
  };

  const openTasks = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView("tasks");
  };

  return (
    <div className="z-40 fixed bottom-18 right-4 md:bottom-3">
      {/* Floating button */}
      <button
        onClick={handleOpenCloseLogic}
        className="select-none relative flex items-center justify-center h-14 w-14 rounded-full bg-surface border border-line text-ink-2 shadow-xl shadow-black/10 hover:bg-lift hover:text-ink active:scale-95 transition-all duration-200 group"
      >
        <CheckSquare
          size={22}
          strokeWidth={1.8}
          className="group-hover:scale-105 transition-transform"
        />

        {newTasksCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-cta text-cta-fg text-[11px] font-semibold border-2 border-canvas shadow-sm">
            {newTasksCount}
          </span>
        )}
      </button>

      {view !== "none" && (
        <div
          className="
            absolute bottom-20 right-0 
            w-[calc(100vw-3rem)] sm:w-80 max-w-[calc(100vw-2rem)]
            max-h-[calc(100vh-8rem)] 
            overflow-y-auto
            rounded-2xl bg-surface border border-line 
            shadow-2xl shadow-black/15 p-3
            animate-in fade-in slide-in-from-bottom-2 duration-200
          "
        >
          {view === "layout" && (
            <InitialLayout openTasks={openTasks} openCreate={openCreate} />
          )}
          {view === "create" && <CreateTask goBack={() => setView("layout")} />}
        </div>
      )}
    </div>
  );
}
