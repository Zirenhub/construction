import { ProjectWithRelations } from "@/lib/types";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectWithRelations;
  onClick?: (project: ProjectWithRelations) => void;
  compact?: boolean;
}

export default function ProjectCard({
  project,
  compact = false,
  onClick,
}: ProjectCardProps) {
  if (onClick) {
    return (
      <div
        onClick={() => onClick(project)}
        className={`block border border-line rounded-lg p-3 bg-surface hover:border-line-3 transition-colors active:bg-lift
          ${!project.active ? "opacity-50" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${project.active ? "bg-green-500" : "bg-line-3"}`}
            />
            <span className="text-xs font-medium text-ink truncate">
              {project.name}
            </span>
            <p className="text-[11px] text-ink-4 truncate">
              {project.location}
            </p>
          </div>
          <span className="text-[10px] text-ink-5 shrink-0">
            {project.podObekti.length} под обекта
          </span>
        </div>
      </div>
    );
  }
  if (compact) {
    return (
      <Link
        href={`/obekti/${project.id}`}
        className={`block border border-line rounded-lg p-3 bg-surface hover:border-line-3 transition-colors active:bg-lift
          ${!project.active ? "opacity-50" : ""}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${project.active ? "bg-green-500" : "bg-line-3"}`}
            />
            <span className="text-xs font-medium text-ink truncate">
              {project.name}
            </span>
            <p className="text-[11px] text-ink-4 truncate">
              {project.location}
            </p>
          </div>
          <span className="text-[10px] text-ink-5 shrink-0">
            {project.podObekti.length} под обекта
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/obekti/${project.id}`}
      className={`block border border-line rounded-xl p-4 bg-surface hover:border-line-3 transition-colors active:bg-lift
        ${!project.active ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${project.active ? "bg-green-500" : "bg-line-3"}`}
        />
        <span className="text-sm font-medium text-ink truncate">
          {project.name}
        </span>
      </div>
      <p className="text-xs text-ink-4 pl-4 mb-2">{project.location}</p>
      <p className="text-xs text-ink-5 pl-4">
        {project.podObekti.length} под обекта
      </p>
    </Link>
  );
}
