import { TaskWithRelations } from "@/lib/types";
import { format } from "date-fns";
import { ListTodo } from "lucide-react";
import { useMemo } from "react";
import TaskCard from "./TaskCard";

type Props = {
  selectedDate: Date;
  tasksByDate: Map<string, TaskWithRelations[]>;
};

export default function CalendarTaskDetails({
  selectedDate,
  tasksByDate,
}: Props) {
  const selectedDayTasks = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate.get(key) || [];
  }, [selectedDate, tasksByDate]);

  return (
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
          {selectedDayTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-ink-5 bg-lift/30 rounded-xl border border-dashed border-line">
          No tasks scheduled for this day
        </div>
      )}
    </div>
  );
}
