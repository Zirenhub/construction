"use client";

import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import CreateTask from "./CreateTask";
import { CreateTaskData } from "@/lib/types";
import { createTask, getTasks } from "@/lib/actions";
import TasksLayoutHeader from "./TasksLayoutHeader";
import { Task } from "@/generated/prisma/client";
import TaskContainer from "./TaskContainer";

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
      <div className="flex items-start justify-between mb-5 gap-3">
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
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const openTasks = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const tasks = await getTasks();
    setTasks(tasks);
    setView("tasks");
  };

  const handleSaveAction = async (data: CreateTaskData) => {
    await createTask(data);
    setView("none");
  };

  return (
    <div className="z-40 fixed bottom-18 right-4 md:bottom-3 text-nowrap">
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
          bg-canvas
            absolute bottom-20 right-0 
            min-w-[30%] max-w-lg w-fit
            max-h-[calc(100vh-8rem)] 
            overflow-y-auto
            rounded-2xl border border-line 
            shadow-2xl shadow-black/15 p-3
            animate-in fade-in slide-in-from-bottom-2 duration-200
          "
        >
          {view === "layout" && (
            <InitialLayout openTasks={openTasks} openCreate={openCreate} />
          )}
          {view === "create" && (
            <>
              <TasksLayoutHeader
                goBack={() => setView("layout")}
                title="Създаване на нова задача"
              />
              <CreateTask onSaveAction={(data) => handleSaveAction(data)} />
            </>
          )}
          {view === "tasks" && (
            <>
              <TasksLayoutHeader
                goBack={() => setView("layout")}
                title="Всички задачи"
              />
              <TaskContainer initialTasks={tasks} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
