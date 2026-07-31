import TaskRow from "./TaskRow";
import TaskEmpty from "./TaskEmpty";
import { TaskWithActions } from "@/lib/types";

type Props = {
  tasks: TaskWithActions[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function TaskList({ tasks, onComplete, onDelete }: Props) {
  if (!tasks.length) {
    return <TaskEmpty />;
  }

  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-sm">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
