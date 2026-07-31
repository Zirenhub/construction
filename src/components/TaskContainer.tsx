"use client";

import { useMemo, useState } from "react";

import { TaskStatus, TaskPriority } from "@/generated/prisma/client";

import TaskSort, { TaskSortValue } from "./TaskSort";
import { TaskWithActions } from "@/lib/types";
import TaskSearch from "./TaskSearch";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";
import { completeTask } from "@/lib/actions";

type Props = {
  initialTasks: TaskWithActions[];
};

type Filter = "ALL" | TaskStatus;

export default function TaskContainer({ initialTasks }: Props) {
  const [tasks, setTasks] = useState(initialTasks);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<Filter>("ALL");

  const [sort, setSort] = useState<TaskSortValue>("created");

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const value = search.toLowerCase();

      result = result.filter((task) => {
        return (
          task.title.toLowerCase().includes(value) ||
          task.description?.toLowerCase().includes(value)
        );
      });
    }

    if (filter !== "ALL") {
      result = result.filter((task) => task.status === filter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

        case "priority":
          const priorityOrder: Record<TaskPriority, number> = {
            URGENT: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1,
          };

          return priorityOrder[b.priority] - priorityOrder[a.priority];

        case "created":

        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return result;
  }, [tasks, search, filter, sort]);

  async function markComplete(id: string) {
    await completeTask(id);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "COMPLETED",
            }
          : task,
      ),
    );
  }

  async function deleteTask(id: string) {
    /*
      Prisma action:

      await prisma.task.delete({
        where:{
          id
        }
      })
    */

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return (
    <div className="space-y-5">
      <div
        className="
          flex
          flex-col
          gap-3
          font-light
        "
      >
        <TaskSearch
          value={search}
          onChange={setSearch}
          clearSearch={() => setSearch("")}
        />

        <TaskSort value={sort} onChange={setSort} />
      </div>

      <TaskFilters value={filter} onChange={setFilter} />

      <TaskList
        tasks={filteredTasks}
        onComplete={markComplete}
        onDelete={deleteTask}
      />
    </div>
  );
}
