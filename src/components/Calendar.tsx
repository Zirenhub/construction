"use client";

import React, { useState, useMemo } from "react";
import { Task } from "@/generated/prisma/client";
import {
  format,
  isSameDay,
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
  Building2,
  MapPin,
  Users,
  User,
  Hammer,
  Filter,
} from "lucide-react";
import smrPct from "@/helpers/smrPct";
import { TaskWithRelations } from "@/lib/types";

type Props = {
  tasks: TaskWithRelations[];
};

export default function Calendar({ tasks }: Props) {
  const today = new Date();

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Filter States
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");
  const [selectedBrigadeId, setSelectedBrigadeId] = useState<string>("ALL");

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

  // Distinct list of projects & brigades for filter dropdowns
  const uniqueProjects = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach((t) => {
      if (t.project) map.set(t.project.id, t.project.name);
    });
    return Array.from(map.entries());
  }, [tasks]);

  const uniqueBrigades = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach((t) => {
      if (t.brigade) map.set(t.brigade.id, t.brigade.name);
    });
    return Array.from(map.entries());
  }, [tasks]);

  // Filter tasks based on active project/brigade selections
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchProject =
        selectedProjectId === "ALL" || t.projectId === selectedProjectId;
      const matchBrigade =
        selectedBrigadeId === "ALL" || t.brigadeId === selectedBrigadeId;
      return matchProject && matchBrigade;
    });
  }, [tasks, selectedProjectId, selectedBrigadeId]);

  // Date grid calculations using date-fns
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  // Group filtered tasks by date string (YYYY-MM-DD) for fast lookup
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskWithRelations[]>();
    filteredTasks.forEach((task) => {
      const taskDate = new Date(task.dueDate);
      const key = format(taskDate, "yyyy-MM-dd");
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(task);
    });
    return map;
  }, [filteredTasks]);

  // Tasks belonging to the selected day
  const selectedDayTasks = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  // Handlers
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

  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => currentYear - 10 + i,
  );

  // Styling Helpers
  const getPriorityBadgeStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500 text-white font-semibold";
      case "HIGH":
        return "bg-amber-500 text-white font-semibold";
      case "MEDIUM":
        return "bg-blue-500 text-white font-semibold";
      default:
        return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium";
    }
  };

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
    <div className="w-full max-w-md mx-auto bg-surface/90 backdrop-blur-md border border-line rounded-2xl p-5 shadow-xl shadow-black/5 transition-all">
      {/* Calendar Navigation Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors cursor-pointer"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
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

      {/* Quick Filters Toolbar */}
      {(uniqueProjects.length > 0 || uniqueBrigades.length > 0) && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-line text-xs">
          <Filter className="w-3.5 h-3.5 text-ink-4 shrink-0" />

          {uniqueProjects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-lift/60 border border-line rounded-lg px-2 py-1 text-ink-3 focus:outline-none w-full truncate cursor-pointer"
            >
              <option value="ALL">All Projects</option>
              {uniqueProjects.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {uniqueBrigades.length > 0 && (
            <select
              value={selectedBrigadeId}
              onChange={(e) => setSelectedBrigadeId(e.target.value)}
              className="bg-lift/60 border border-line rounded-lg px-2 py-1 text-ink-3 focus:outline-none w-full truncate cursor-pointer"
            >
              <option value="ALL">All Brigades</option>
              {uniqueBrigades.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

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

              {/* Option 3 Counter Badge */}
              {hasTasks && (
                <span
                  className={`absolute -top-1 -right-1 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none shadow-sm ${getBadgeBg()}`}
                >
                  {dayTasks.length}
                </span>
              )}

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

      {/* Expanded Task Details Drawer */}
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
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {selectedDayTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-lift/60 border border-line hover:border-line-2 transition-all space-y-2.5"
                >
                  {/* Title & Priority */}
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

                  {/* Description */}
                  {task.description && (
                    <p className="text-xs text-ink-4 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Construction Context Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {/* Project & Sub-object */}
                    {task.project && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-3 border border-line">
                        <Building2 className="w-3 h-3 text-blue-500" />
                        <span>{task.project.name}</span>
                        {task.podObekt && (
                          <span className="text-ink-5 font-mono">
                            / {task.podObekt.name}
                          </span>
                        )}
                      </span>
                    )}

                    {/* Location */}
                    {task.project?.location && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-4 border border-line">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>{task.project.location}</span>
                      </span>
                    )}

                    {/* Brigade & Member */}
                    {task.brigade && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-3 border border-line">
                        <Users className="w-3 h-3 text-amber-500" />
                        <span>{task.brigade.name}</span>
                        {task.brigadeMember && (
                          <span className="text-ink-4 flex items-center gap-0.5">
                            (<User className="w-2.5 h-2.5" />{" "}
                            {task.brigadeMember.name})
                          </span>
                        )}
                      </span>
                    )}

                    {/* SMR Work Type */}
                    {task.smr && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-3 border border-line">
                        <Hammer className="w-3 h-3 text-emerald-500" />
                        <span>{task.smr.name}</span>
                      </span>
                    )}
                  </div>

                  {/* SMR Progress Bar */}
                  {task.smr && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-ink-4">
                        <span>Work Progress (SMR)</span>
                        <span className="font-mono">
                          {task.smr.done} / {task.smr.quantity} {task.smr.unit}{" "}
                          ({smrPct(task.smr)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-lift rounded-full overflow-hidden border border-line/50">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(0, smrPct(task.smr)))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status & Time Footer */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-line/60">
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
              );
            })}
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
