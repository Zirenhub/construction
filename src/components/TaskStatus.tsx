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
  },

  IN_PROGRESS: {
    label: "In Progress",
    icon: LoaderCircle,
  },

  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
  },
} satisfies Record<
  PrismaTaskStatus,
  {
    label: string;
    icon: React.ElementType;
  }
>;

export default function TaskStatus({ status }: Props) {
  const item = config[status];
  const Icon = item.icon;

  return (
    <div
      className="
        flex
        flex-nowrap
        items-center
        gap-1.5
        whitespace-nowrap
        text-xs
        text-ink-3
      "
    >
      <Icon className="h-4 w-4 text-accent" />
      <span>{item.label}</span>
    </div>
  );
}
