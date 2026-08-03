import smrPct from "@/helpers/smrPct";
import { TaskWithRelations } from "@/lib/types";

export default function SmrProgressBar({
  smr,
}: {
  smr: NonNullable<TaskWithRelations["smr"]>;
}) {
  const percentage = Math.min(100, Math.max(0, smrPct(smr)));

  return (
    <div className="space-y-1 pt-1">
      <div className="flex items-center justify-between text-[10px] text-ink-4">
        <span>Work Progress (SMR)</span>
        <span className="font-mono">
          {smr.done} / {smr.quantity} {smr.unit} ({smrPct(smr)}%)
        </span>
      </div>
      <div className="w-full h-1.5 bg-lift rounded-full overflow-hidden border border-line/50">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
