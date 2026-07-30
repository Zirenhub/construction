import { ArrowDownAZ, CalendarDays, Flag } from "lucide-react";

export type TaskSortValue = "created" | "dueDate" | "priority";

type Props = {
  value: TaskSortValue;
  onChange: (value: TaskSortValue) => void;
};

const options = [
  {
    label: "Newest",
    value: "created",
    icon: ArrowDownAZ,
  },
  {
    label: "Due Date",
    value: "dueDate",
    icon: CalendarDays,
  },
  {
    label: "Priority",
    value: "priority",
    icon: Flag,
  },
] satisfies {
  label: string;
  value: TaskSortValue;
  icon: React.ElementType;
}[];

export default function TaskSort({ value, onChange }: Props) {
  return (
    <div
      className="
        flex
        items-center
        gap-1
        rounded-xl
        bg-lift
        p-1
      "
    >
      {options.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-3
              py-1.5
              text-sm
              transition

              ${
                value === item.value
                  ? "bg-accent text-white"
                  : "text-ink-3 hover:bg-surface"
              }
            `}
          >
            <Icon className="h-4 w-4" />

            {item.label}
          </button>
        );
      })}
    </div>
  );
}
