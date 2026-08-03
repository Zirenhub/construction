import { Task } from "@/generated/prisma/client";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function StatusBadge({ status }: { status: Task["status"] }) {
  const getStyle = (s: Task["status"]) => {
    switch (s) {
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "IN_PROGRESS":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
      case "CANCELLED":
        return "bg-slate-500/10 text-slate-400 border-slate-300 dark:border-slate-700 line-through";
      default:
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${getStyle(
        status,
      )}`}
    >
      {status === "COMPLETED" ? (
        <CheckCircle2 className="w-3 h-3" />
      ) : (
        <AlertCircle className="w-3 h-3" />
      )}
      {status.replace("_", " ")}
    </span>
  );
}
