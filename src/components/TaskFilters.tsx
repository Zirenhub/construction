import { TaskStatus } from "@/generated/prisma/client";

type Filter = "ALL" | TaskStatus;

type Props = {
  value: Filter;
  onChange: (value: Filter) => void;
};

const filters: {
  label: string;
  value: Filter;
}[] = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

export default function TaskFilters({ value, onChange }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-3
        gap-1
        rounded-xl
        bg-surface
        p-1
        shadow-sm
      "
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`
            rounded-lg
            px-3
            py-1.5
            text-sm
            transition
            ${
              value === filter.value
                ? "bg-accent text-ink-5"
                : "text-ink-3 hover:bg-well"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
