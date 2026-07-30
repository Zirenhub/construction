import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TaskSearch({ value, onChange }: Props) {
  return (
    <div
      className="
        flex
        h-10
        items-center
        gap-2
        rounded-xl
        bg-lift
        px-3
        text-ink-3
      "
    >
      <Search className="h-4 w-4" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="
          w-full
          bg-transparent
          text-sm
          text-ink-1
          outline-none
          placeholder:text-ink-3
        "
      />
    </div>
  );
}
