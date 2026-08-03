import { format } from "date-fns";
import { Building2, Clock, Hammer, MapPin, User, Users } from "lucide-react";
import { TaskWithRelations } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import { TaskCardActions } from "./TaskCardActions";
import StatusBadge from "./StatusBadge";
import SmrProgressBar from "./SmrProgressBar";

type TaskCardProps = {
  task: TaskWithRelations;
  onToggleTaskStatus?: (task: TaskWithRelations) => void;
  onDeleteTask?: (task: TaskWithRelations) => void;
};

export default function TaskCard({
  task,
  onToggleTaskStatus,
  onDeleteTask,
}: TaskCardProps) {
  return (
    <div className="p-3.5 rounded-xl bg-lift/60 border border-line hover:border-line-2 transition-all space-y-2.5">
      {/* Title, Priority & Actions Dropdown */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink leading-snug">
          {task.title}
        </h4>

        <div className="flex items-center gap-1.5 shrink-0">
          <PriorityBadge priority={task.priority} />
          <TaskCardActions
            task={task}
            onToggleStatus={onToggleTaskStatus}
            onDelete={onDeleteTask}
          />
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-ink-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Context Badges */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
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

        {task.project?.location && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-4 border border-line">
            <MapPin className="w-3 h-3 text-red-400" />
            <span>{task.project.location}</span>
          </span>
        )}

        {task.brigade && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-3 border border-line">
            <Users className="w-3 h-3 text-amber-500" />
            <span>{task.brigade.name}</span>
            {task.brigadeMember && (
              <span className="text-ink-4 flex items-center gap-0.5">
                (<User className="w-2.5 h-2.5" /> {task.brigadeMember.name})
              </span>
            )}
          </span>
        )}

        {task.smr && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lift text-ink-3 border border-line">
            <Hammer className="w-3 h-3 text-emerald-500" />
            <span>{task.smr.name}</span>
          </span>
        )}
      </div>

      {/* SMR Progress Bar */}
      {task.smr && <SmrProgressBar smr={task.smr} />}

      {/* Status & Time Footer */}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-line/60">
        <StatusBadge status={task.status} />

        <span className="text-ink-4 font-mono flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {task.isAllDay ? "All day" : format(new Date(task.dueDate), "p")}
        </span>
      </div>
    </div>
  );
}
