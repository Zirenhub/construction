import { ProjectWithRelations } from "@/lib/types";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectWithRelations;
  onClick?: (project: ProjectWithRelations) => void;
  compact?: boolean;
  selected?: boolean;
}

export default function ProjectCard({
  project,
  compact = false,
  selected = false,
  onClick,
}: ProjectCardProps) {
  const { id, name, location, active, podObekti } = project;
  const subObjectsCount = podObekti?.length ?? 0;

  // Uses line-3 for prominent selection border and lift for background shift
  const selectionStyles = selected
    ? "border-line-3 bg-lift ring-1 ring-line-3"
    : "border-line bg-surface hover:border-line-2 hover:bg-lift/50";

  // Base layout and interactive styles
  const baseStyles = `block transition-all ${selectionStyles} ${
    compact ? "rounded-lg p-3" : "rounded-xl p-4"
  } ${!active ? "opacity-50" : ""}`;

  // Inner card layout
  const renderCardContent = () => {
    const statusDot = (
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${
          active ? "bg-green-500" : "bg-line-3"
        }`}
      />
    );

    if (compact) {
      return (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {statusDot}
            <span className="text-xs font-medium text-ink truncate">
              {name}
            </span>
            <span className="text-[11px] text-ink-4 truncate">{location}</span>
          </div>
          <span className="text-[10px] text-ink-5 shrink-0">
            {subObjectsCount} под обекта
          </span>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center gap-2 mb-1">
          {statusDot}
          <span className="text-sm font-medium text-ink truncate">{name}</span>
        </div>
        <p className="text-xs text-ink-4 pl-4 mb-2">{location}</p>
        <p className="text-xs text-ink-5 pl-4">{subObjectsCount} под обекта</p>
      </>
    );
  };

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick(project)}
        onKeyDown={(e) => e.key === "Enter" && onClick(project)}
        className={`${baseStyles} cursor-pointer active:bg-lift`}
      >
        {renderCardContent()}
      </div>
    );
  }

  return (
    <Link href={`/obekti/${id}`} className={baseStyles}>
      {renderCardContent()}
    </Link>
  );
}
