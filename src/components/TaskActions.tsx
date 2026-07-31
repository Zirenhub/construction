import { Check, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { TaskWithActions } from "@/lib/types";

type Props = {
  task: TaskWithActions;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function TaskActions({ task, onComplete, onDelete }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-ink-3
            transition
            hover:bg-lift
            group-hover:opacity-100
          "
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {task.status !== "COMPLETED" && (
          <DropdownMenuItem
            onClick={() => onComplete?.(task.id)}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Mark complete
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete?.(task.id)}
          className="
            gap-2
            text-red-500
            focus:text-red-500
          "
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
