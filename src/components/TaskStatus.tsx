import { TaskStatus as PrismaTaskStatus } from "@/lib/types";
import {
  CheckCircle2,
  CircleDashed,
  LoaderCircle,
  XCircle,
} from "lucide-react";

type Props = {
  status: PrismaTaskStatus;
};

const config = {
  PENDING: {
    label: "Pending",
    icon: CircleDashed,
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconClass: "text-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: LoaderCircle,
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconClass: "text-blue-500 animate-spin",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconClass: "text-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    badgeClass:
      "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20 line-through opacity-75",
    iconClass: "text-rose-400",
  },
} satisfies Record<
  PrismaTaskStatus,
  {
    label: string;
    icon: React.ElementType;
    badgeClass: string;
    iconClass: string;
  }
>;

export default function TaskStatus({ status }: Props) {
  const item = config[status] ?? config.PENDING;
  const Icon = item.icon;

  return (
    <div className="mt-auto border-line pt-2 pl-2.5 flex items-center">
      <div
        className={`
          inline-flex
          items-center
          gap-1.5
          px-2
          py-0.5
          rounded-md
          text-xs
          font-medium
          whitespace-nowrap
          transition-colors
          ${item.badgeClass}
        `}
      >
        <Icon className={`h-3.5 w-3.5 shrink-0 ${item.iconClass}`} />
        <span>{item.label}</span>
      </div>
    </div>
  );
}
