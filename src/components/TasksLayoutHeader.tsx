import { ArrowLeftCircleIcon } from "lucide-react";

type Props = {
  title: string;
  goBack: () => void;
};

export default function TasksLayoutHeader({ title, goBack }: Props) {
  return (
    <div className="flex items-center gap-1 mb-3 text-sm">
      <button
        onClick={goBack}
        type="button"
        className="p-1.5 rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors"
      >
        <ArrowLeftCircleIcon size={24} />
      </button>
      <h2 className="font-medium text-ink tracking-tight">{title}</h2>
    </div>
  );
}
