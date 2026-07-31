import { Search, Trash2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  clearSearch: () => void;
};

export default function TaskSearch({ value, onChange, clearSearch }: Props) {
  return (
    <div
      className="
        flex
        h-10
        items-center
        bg-surface
        gap-2
        rounded-xl
        px-3
        text-ink-3
        shadow-sm
      "
    >
      <Search size={18} color="#64748b" className="m-2" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          bg-transparent
          text-sm
          text-ink-1
          outline-none
          placeholder:text-ink-3
        "
      />

      <button
        onClick={clearSearch}
        className="cursor-pointer text-ink-5 rounded-full p-1 hover:bg-red-400 hover:text-surface transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
