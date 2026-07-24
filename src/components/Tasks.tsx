"use client";

import { useState } from "react";
import { Plus, CheckSquare, ArrowLeftCircleIcon } from "lucide-react";

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
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2
            className="
                  text-lg
                  font-semibold
                  text-ink
                "
          >
            Задачи
          </h2>

          <p
            className="
                  text-xs
                  text-ink-4
                  mt-1
                "
          >
            Управление на дневните задачи
          </p>
        </div>

        {/* Date */}
        <div
          className="
                flex flex-col items-center
                rounded-xl
                bg-lift
                border border-line
                px-3 py-2
                text-ink-2
              "
        >
          <span
            className="
                  text-base
                  font-semibold
                  leading-none
                "
          >
            {day}
          </span>

          <span
            className="
                  text-[10px]
                  uppercase
                  text-ink-4
                  mt-1
                "
          >
            {month}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {/* Primary */}
        <button
          onClick={openTasks}
          className="
                w-full
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                bg-cta
                text-cta-fg
                text-sm
                font-medium
                hover:bg-cta-hover
                transition
              "
        >
          <CheckSquare size={17} />
          Виж задачи
        </button>

        {/* Secondary */}
        <button
          onClick={openCreate}
          className="
                w-full
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                bg-well
                border border-line
                text-ink-2
                text-sm
                font-medium
                hover:bg-lift
                transition
              "
        >
          <Plus size={17} />
          Създай задача
        </button>
      </div>

      {/* Footer */}
      <div
        className="
              mt-4
              pt-3
              border-t border-line
              text-center
              text-xs
              text-ink-4
            "
      >
        {newTasksCount} нови задачи за днес
      </div>
    </>
  );
}

import {
  CalendarDays,
  Users,
  Building2,
  HardHat,
  ClipboardList,
} from "lucide-react";

function CreateTask({ goBack }: { goBack: () => void }) {
  return (
    <div
      className="
      w-full
      max-w-lg
      bg-surface
      border border-line
      rounded-2xl
      shadow-xl shadow-black/5
      p-5
    "
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={goBack}
          className="
            p-1.5
            rounded-lg
            text-ink-4
            hover:text-ink
            hover:bg-lift
            transition
          "
        >
          <ArrowLeftCircleIcon size={24} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-ink">
            Създаване на нова задача
          </h2>

          <p className="text-xs text-ink-4">
            Задача към проект, екип или дейност
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-ink">Основна информация</p>

          <input
            placeholder="Заглавие на задачата"
            className="
              w-full
              rounded-xl
              bg-well
              border border-line
              px-3 py-2.5
              text-sm
              text-ink
              outline-none
              focus:border-line-3
            "
          />

          <textarea
            placeholder="Описание..."
            rows={3}
            className="
              w-full
              rounded-xl
              bg-well
              border border-line
              px-3 py-2.5
              text-sm
              text-ink
              resize-none
              outline-none
              focus:border-line-3
            "
          />
        </section>

        {/* Date */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-ink">Срок</p>

          <div
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-well
            border border-line
            px-3
          "
          >
            <CalendarDays size={16} className="text-ink-4" />

            <input
              type="datetime-local"
              className="
                w-full
                py-2.5
                bg-transparent
                text-sm
                text-ink
                outline-none
              "
            />
          </div>

          <label
            className="
            flex
            items-center
            gap-2
            text-sm
            text-ink-2
          "
          >
            <input type="checkbox" />
            Целодневна задача
          </label>
        </section>

        {/* Priority */}
        <section>
          <p className="text-sm font-medium text-ink mb-2">Приоритет</p>

          <div className="grid grid-cols-4 gap-2">
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((item) => (
              <button
                key={item}
                className="
                  rounded-lg
                  border border-line
                  bg-well
                  px-2 py-2
                  text-xs
                  text-ink-2
                  hover:bg-lift
                  transition
                "
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Relations */}
        <section className="space-y-3">
          <p className="text-sm font-medium text-ink">Свързване</p>

          <div className="grid gap-2">
            <button
              className="
              flex items-center gap-3
              rounded-xl
              border border-line
              bg-well
              px-3 py-3
              text-sm
              text-ink-2
              hover:bg-lift
              transition
            "
            >
              <Building2 size={17} />
              Избери проект
            </button>

            <button
              className="
              flex items-center gap-3
              rounded-xl
              border border-line
              bg-well
              px-3 py-3
              text-sm
              text-ink-2
              hover:bg-lift
              transition
            "
            >
              <Building2 size={17} />
              Избери подобект
            </button>

            <button
              className="
              flex items-center gap-3
              rounded-xl
              border border-line
              bg-well
              px-3 py-3
              text-sm
              text-ink-2
              hover:bg-lift
              transition
            "
            >
              <Users size={17} />
              Избери бригада
            </button>

            <button
              className="
              flex items-center gap-3
              rounded-xl
              border border-line
              bg-well
              px-3 py-3
              text-sm
              text-ink-2
              hover:bg-lift
              transition
            "
            >
              <HardHat size={17} />
              Избери член на бригада
            </button>

            <button
              className="
              flex items-center gap-3
              rounded-xl
              border border-line
              bg-well
              px-3 py-3
              text-sm
              text-ink-2
              hover:bg-lift
              transition
            "
            >
              <ClipboardList size={17} />
              Избери СМР
            </button>
          </div>
        </section>
      </div>

      <button
        className="
          mt-6
          w-full
          rounded-xl
          bg-cta
          text-cta-fg
          py-3
          text-sm
          font-medium
          hover:bg-cta-hover
          transition
        "
      >
        Създай задача
      </button>
    </div>
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
    <div className="z-40 fixed bottom-18 right-4">
      {/* Floating button */}
      <button
        onClick={handleOpenCloseLogic}
        className="
        select-none
          relative
          flex items-center justify-center
          h-12 w-12
          rounded-full
          bg-surface
          border border-line
          text-ink-2
          shadow-lg
          shadow-black/5
          hover:bg-lift
          hover:text-ink
          transition-all duration-200
        "
      >
        <CheckSquare size={20} strokeWidth={1.8} />

        {newTasksCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              flex items-center justify-center
              h-5 w-5
              rounded-full
              bg-cta
              text-cta-fg
              text-[11px]
              font-medium
              border-2 border-canvas
            "
          >
            {newTasksCount}
          </span>
        )}
      </button>

      {view !== "none" && (
        <div
          className="
            absolute bottom-15 right-5
            w-72
            rounded-2xl
            bg-surface
            border border-line
            shadow-xl
            shadow-black/10
            p-5
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
