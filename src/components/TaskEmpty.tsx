import { ClipboardList } from "lucide-react";

export default function TaskEmpty() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        bg-lift
        py-20
        text-center
      "
    >
      <ClipboardList
        className="
          h-10
          w-10
          text-ink-3
        "
      />

      <h3
        className="
          mt-4
          text-lg
          font-semibold
          text-ink-1
        "
      >
        No tasks
      </h3>

      <p
        className="
          mt-1
          text-sm
          text-ink-3
        "
      >
        Everything is under control.
      </p>
    </div>
  );
}
