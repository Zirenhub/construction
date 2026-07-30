import { MoreHorizontal } from "lucide-react";

import TaskMeta from "./TaskMeta";
import TaskStatus from "./TaskStatus";
import TaskPriority from "./TaskPriority";
import TaskActions from "./TaskActions";
import { TaskWithActions } from "@/lib/types";

type Props = {
  task: TaskWithActions;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function TaskRow({ task, onComplete, onDelete }: Props) {
  return (
    <div
      className="
        group
        relative
        flex
        gap-4
        p-5
        transition-all
        hover:bg-surface/40
      "
    >
      <TaskPriority priority={task.priority} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-ink-1">
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <TaskStatus status={task.status} />

            <TaskActions
              task={task}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          </div>
        </div>

        <TaskMeta task={task} />
      </div>
    </div>
  );
}
