import { ArrowLeftCircleIcon } from "lucide-react";

type Props = {
  title: string;
  goBack: () => void;
};

export default function TasksLayoutHeader({ title, goBack }: Props) {
  return (
    <div className="flex items-center gap-2 mb-3 text-sm">
      <button
        onClick={goBack}
        type="button"
        className="rounded-lg text-ink-4 hover:text-ink hover:bg-lift transition-colors cursor-pointer"
      >
        <ArrowLeftCircleIcon size={24} />
      </button>
      <h2 className="font-medium text-ink tracking-tight">{title}</h2>
    </div>
  );
}
