"use client";

import React, { useState, useMemo } from "react";
import { Task } from "@/generated/prisma/client";
import {
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  setMonth,
  setYear,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  ListTodo,
} from "lucide-react";

type Props = {
  tasks: Task[];
};

export default function Calendar({ tasks }: Props) {
  const today = new Date();

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Date grid calculations using date-fns
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  // Group tasks by formatted date key (YYYY-MM-DD) for O(1) grid rendering lookup
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      const key = format(taskDate, "yyyy-MM-dd");
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(task);
    });
    return map;
  }, [tasks]);

  // Tasks belonging to the selected day
  const selectedDayTasks = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  // Navigation Handlers
  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(setMonth(viewDate, parseInt(e.target.value, 10)));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(setYear(viewDate, parseInt(e.target.value, 10)));
  };

  const handleReset = () => {
    const now = new Date();
    setSelectedDate(now);
    setViewDate(now);
  };

  // 21-year range centered on viewDate
  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i,
  );

  // Badge styles based on priority
  const getPriorityBadgeStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "HIGH":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  // Badge styles based on task status
  const getStatusBadgeStyle = (status: Task["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "IN_PROGRESS":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "CANCELLED":
        return "bg-slate-500/10 text-slate-400 border-slate-300 dark:border-slate-700 line-through";
      default:
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-surface/90 backdrop-blur-md border border-line rounded-2xl p-5 shadow-xl shadow-black/5 transition-all">
      {/* Calendar Navigation Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors cursor-pointer"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {/* Month Selector */}
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="bg-transparent text-sm font-semibold text-ink cursor-pointer focus:outline-none hover:bg-lift rounded-md p-1 transition-colors"
          >
            {months.map((m, index) => (
              <option key={m} value={index}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={currentYear}
            onChange={handleYearChange}
            className="bg-transparent text-sm font-semibold text-ink-3 cursor-pointer focus:outline-none hover:bg-lift rounded-md p-1 transition-colors"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors cursor-pointer"
          aria-label="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center mb-2">
        {weekDays.map((day) => (
          <span key={day} className="text-xs font-medium text-ink-5">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Leading empty slots for starting day padding */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {daysInMonth.map((day) => {
          const dayNumber = day.getDate();
          const currentIsToday = isSameDay(day, today);
          const currentIsSelected = isSameDay(day, selectedDate);

          const dateKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate.get(dateKey) || [];
          const hasTasks = dayTasks.length > 0;

          // Determine badge color based on highest priority present
          const getBadgeBg = () => {
            if (
              dayTasks.some(
                (t) => t.priority === "URGENT" || t.priority === "HIGH",
              )
            ) {
              return "bg-red-500 text-white";
            }
            if (dayTasks.some((t) => t.priority === "MEDIUM")) {
              return "bg-blue-500 text-white";
            }
            return "bg-slate-400 text-white";
          };

          let buttonStyle = "text-ink-2 hover:bg-lift";

          if (currentIsSelected) {
            buttonStyle = "bg-cta text-cta-fg shadow-md";
          } else if (currentIsToday) {
            buttonStyle = "bg-lift text-ink font-bold border border-line-2";
          }

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all relative hover:scale-105 cursor-pointer ${buttonStyle}`}
            >
              {dayNumber}

              {/* Task Counter Badge (Top-Right) */}
              {hasTasks && (
                <span
                  className={`absolute -top-1 -right-1 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none shadow-sm ${getBadgeBg()}`}
                >
                  {dayTasks.length}
                </span>
              )}

              {/* Today indicator dot (only shown when no tasks exist) */}
              {currentIsToday && !currentIsSelected && !hasTasks && (
                <span className="absolute bottom-1 w-1 h-1 bg-ink rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-3 w-full text-xs font-medium text-ink-4 hover:text-ink hover:bg-lift cursor-pointer p-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
      >
        <CalendarIcon className="w-3.5 h-3.5" />
        Reset to Today
      </button>

      {/* Expandable Selected Day Detail Drawer */}
      <div className="mt-4 pt-4 border-t border-line transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-3 uppercase tracking-wider">
            <ListTodo className="w-3.5 h-3.5" />
            <span>{format(selectedDate, "MMM d, yyyy")}</span>
          </div>
          <span className="text-xs font-medium text-ink-4">
            {selectedDayTasks.length}{" "}
            {selectedDayTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {selectedDayTasks.length > 0 ? (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {selectedDayTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-xl bg-lift/60 border border-line hover:border-line-2 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-ink leading-snug">
                    {task.title}
                  </h4>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${getPriorityBadgeStyle(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="text-xs text-ink-4 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span
                    className={`px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${getStatusBadgeStyle(
                      task.status,
                    )}`}
                  >
                    {task.status === "COMPLETED" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {task.status.replace("_", " ")}
                  </span>

                  <span className="text-ink-4 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.isAllDay
                      ? "All day"
                      : format(new Date(task.dueDate), "p")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-ink-5 bg-lift/30 rounded-xl border border-dashed border-line">
            No tasks scheduled for this day
          </div>
        )}
      </div>
    </div>
  );
}
