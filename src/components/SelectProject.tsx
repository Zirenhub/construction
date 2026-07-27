import { ProjectWithRelations } from "@/lib/types";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: ProjectWithRelations[];
  handleSelectProject: (project: ProjectWithRelations) => void;
};

export default function SelectProject({
  projects,
  handleSelectProject,
}: Props) {
  return (
    <div className="flex flex-col justify-between gap-2">
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={p}
          compact
          onClick={handleSelectProject}
        />
      ))}
    </div>
  );
}
