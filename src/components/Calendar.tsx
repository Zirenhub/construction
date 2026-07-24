"use client";

import React, { useState } from "react";

export default function Calendar() {
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

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Days in current month
  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
  // Day of week the 1st of the month falls on (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (y: number, m: number) =>
    new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Navigation Handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(year, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), month, 1));
  };

  const handleReset = () => {
    setSelectedDate(new Date());
    setViewDate(new Date());
  };

  // Helper checks
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day: number) =>
    day === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  // Generate dynamic year options (e.g., 10 years back and forward)
  const yearOptions = Array.from({ length: 21 }, (_, i) => year - 10 + i);

  return (
    <div
      className="
      w-full max-w-sm mx-auto
      bg-surface/90
      backdrop-blur-md
      border border-line
      rounded-2xl
      p-5
      shadow-xl shadow-black/5
      transition-all
    "
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="
          p-1.5
          rounded-lg
          text-ink-4
          hover:text-ink
          hover:bg-lift
          transition-colors
        "
          aria-label="Previous Month"
        >
          &#x276E;
        </button>

        <div className="flex items-center gap-1">
          {/* Month Dropdown */}
          <select
            value={month}
            onChange={handleMonthChange}
            className="
            bg-transparent
            text-sm
            font-semibold
            text-ink
            cursor-pointer
            focus:outline-none
            hover:bg-lift
            rounded-md
            p-1
            transition-colors
          "
          >
            {months.map((m, index) => (
              <option key={m} value={index}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={year}
            onChange={handleYearChange}
            className="
            bg-transparent
            text-sm
            font-semibold
            text-ink-3
            cursor-pointer
            focus:outline-none
            hover:bg-lift
            rounded-md
            p-1
            transition-colors
          "
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
          className="
          p-1.5
          rounded-lg
          text-ink-4
          hover:text-ink
          hover:bg-lift
          transition-colors
        "
          aria-label="Next Month"
        >
          &#x276F;
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center mb-2">
        {weekDays.map((day) => (
          <span
            key={day}
            className="
            text-xs
            font-medium
            text-ink-5
          "
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const dayNumber = index + 1;

          const currentIsToday = isToday(dayNumber);
          const currentIsSelected = isSelected(dayNumber);

          return (
            <button
              key={dayNumber}
              onClick={() => setSelectedDate(new Date(year, month, dayNumber))}
              className={`
              h-9 w-9 mx-auto
              flex items-center justify-center
              rounded-full
              text-sm
              font-medium
              transition-all
              relative

              ${
                currentIsSelected
                  ? `
                    bg-cta
                    text-cta-fg
                    shadow-md
                  `
                  : currentIsToday
                    ? `
                      bg-lift
                      text-ink
                      font-bold
                      border border-line-2
                    `
                    : `
                      text-ink-2
                      hover:bg-lift
                    `
              }
            `}
            >
              {dayNumber}

              {currentIsToday && !currentIsSelected && (
                <span
                  className="
                  absolute
                  bottom-1
                  w-1
                  h-1
                  bg-ink
                  rounded-full
                "
                />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="
        mt-4
        text-sm
        text-ink-4
        hover:text-ink
        hover:bg-lift
        cursor-pointer
        p-3
        rounded-lg
        transition-all
      "
      >
        Reset
      </button>
    </div>
  );
}
