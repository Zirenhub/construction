import { Task } from "@/generated/prisma/client";

export default function PriorityBadge({
  priority,
}: {
  priority: Task["priority"];
}) {
  const getStyle = (p: Task["priority"]) => {
    switch (p) {
      case "URGENT":
        return "bg-red-200 text-black/70 font-semibold";
      case "HIGH":
        return "bg-amber-200 text-black/70 font-semibold";
      case "MEDIUM":
        return "bg-blue-200 text-black/70 font-semibold";
      default:
        return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium";
    }
  };

  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md ${getStyle(
        priority,
      )}`}
    >
      {priority}
    </span>
  );
}
