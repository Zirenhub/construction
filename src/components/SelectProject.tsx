import { ProjectWithRelations } from "@/lib/types";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: ProjectWithRelations[];
};

export default function SelectProject({ projects }: Props) {
  return (
    <div className="flex flex-col justify-between gap-2">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} compact />
      ))}
    </div>
  );
}
