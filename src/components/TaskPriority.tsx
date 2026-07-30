import { TaskPriority as PrismaTaskPriority } from "@/generated/prisma/client";

type Props = {
  priority: PrismaTaskPriority;
};

const colors = {
  LOW: "bg-emerald-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-500",
} satisfies Record<PrismaTaskPriority, string>;

const labels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
} satisfies Record<PrismaTaskPriority, string>;

export default function TaskPriority({ priority }: Props) {
  return (
    <div className="flex items-start pt-1">
      <span
        title={labels[priority]}
        className={`
          h-2.5
          w-2.5
          rounded-full
          ${colors[priority]}
        `}
      />
    </div>
  );
}
