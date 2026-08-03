"use client";

import React, { useState, useMemo } from "react";
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
  Filter,
} from "lucide-react";
import { TaskWithRelations } from "@/lib/types";
import CalendarTaskDetails from "./CalendarTaskDetails";

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
  const tasksByDate: Map<string, TaskWithRelations[]> = useMemo(() => {
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
      <CalendarTaskDetails
        selectedDate={selectedDate}
        tasksByDate={tasksByDate}
      />
    </div>
  );
}
