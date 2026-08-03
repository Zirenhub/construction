"use client";

import { CheckCircle2, MoreVertical, RotateCcw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { TaskWithRelations } from "@/lib/types";

type TaskCardActionsProps = {
  task: TaskWithRelations;
  onToggleStatus?: (task: TaskWithRelations) => void;
  onDelete?: (task: TaskWithRelations) => void;
};

export function TaskCardActions({
  task,
  onToggleStatus,
  onDelete,
}: TaskCardActionsProps) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 rounded-lg text-ink-4 hover:text-ink hover:bg-well/60 transition-colors outline-none focus:ring-1 focus:ring-line"
          aria-label="Task options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 text-xs">
        {/* Toggle Status Option */}
        <DropdownMenuItem
          onClick={() => onToggleStatus?.(task)}
          className="gap-2.5 text-ink focus:bg-well/60"
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Mark as Pending</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark Complete</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-t border-line/40" />

        {/* Delete Option */}
        <DropdownMenuItem
          onClick={() => onDelete?.(task)}
          className="gap-2.5 text-red-600 dark:text-red-400 focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
