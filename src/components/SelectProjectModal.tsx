"use client";

import { ProjectWithRelations } from "@/lib/types";
import Modal from "./Modal";
import SelectionCard from "./SelectionCard";

interface SelectProjectModalProps {
  isOpen: boolean;
  isLoading: boolean;
  projects: ProjectWithRelations[];
  selectedProjectId?: string;
  onClose: () => void;
  onSelect: (project: ProjectWithRelations) => void;
}

export default function SelectProjectModal({
  isOpen,
  isLoading,
  projects,
  selectedProjectId,
  onClose,
  onSelect,
}: SelectProjectModalProps) {
  return (
    <Modal
      isLoading={isLoading}
      title="Избери обект"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {projects.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-line rounded-xl">
            <p className="text-xs text-ink-4">Няма намерени обекти</p>
          </div>
        ) : (
          projects.map((project) => (
            <SelectionCard
              key={project.id}
              item={project}
              title={project.name}
              subtitle={project.location}
              isActive={project.active}
              selected={selectedProjectId === project.id}
              onSelect={onSelect}
              meta={
                <span className="text-[11px] font-medium text-ink-4 bg-well px-2 py-0.5 rounded-md border border-line">
                  {project.podObekti?.length ?? 0} под обекта
                </span>
              }
            />
          ))
        )}
      </div>
    </Modal>
  );
}
