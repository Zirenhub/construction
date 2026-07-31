import { TaskWithActions } from "@/lib/types";
import {
  CalendarDays,
  Clock3,
  FolderKanban,
  Hammer,
  User,
  Users,
  Building2,
} from "lucide-react";

type Props = {
  task: TaskWithActions;
};

export default function TaskMeta({ task }: Props) {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-x-5
        gap-y-2
        text-xs
        text-ink-3
      "
    >
      <div className="flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />

        {task.dueDate.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5" />

        {task.isAllDay ? "All day" : "Timed"}
      </div>

      {task.project && (
        <div className="flex items-center gap-1.5">
          <FolderKanban className="h-3.5 w-3.5" />
          {task.project.name}
        </div>
      )}

      {task.podObekt && (
        <div className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          {task.podObekt.name}
        </div>
      )}

      {task.brigade && (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {task.brigade.name}
        </div>
      )}

      {task.brigadeMember && (
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {task.brigadeMember.name}
        </div>
      )}

      {task.smr && (
        <div className="flex items-center gap-1.5">
          <Hammer className="h-3.5 w-3.5" />
          {task.smr.name}
        </div>
      )}
    </div>
  );
}
