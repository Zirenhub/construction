"use client";

import { useMemo } from "react";
import { ProjectWithRelations, TPodObekt } from "@/lib/types";
import Modal from "./Modal";
import SelectionCard from "./SelectionCard";

interface SelectPodObektModalProps {
  isOpen: boolean;
  isLoading: boolean;
  podObekti: TPodObekt[];
  selectedPodObektId?: string;
  selectedProject: ProjectWithRelations | null;
  onClose: () => void;
  onSelect: (podObekt: TPodObekt) => void;
}

export default function SelectPodObektModal({
  isOpen,
  isLoading,
  podObekti,
  selectedPodObektId,
  selectedProject,
  onClose,
  onSelect,
}: SelectPodObektModalProps) {
  const sortedPodObekti = useMemo(() => {
    if (!podObekti) return [];
    const projId = selectedProject?.id;

    return [...podObekti].sort((a, b) => {
      const aMatches = a.projectId === projId;
      const bMatches = b.projectId === projId;

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [podObekti, selectedProject?.id]);

  return (
    <Modal
      isLoading={isLoading}
      title="Избери подобект"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {sortedPodObekti.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-line rounded-xl">
            <p className="text-xs text-ink-4">Няма намерени подобекти</p>
          </div>
        ) : (
          sortedPodObekti.map((p) => {
            const belongsToProject =
              selectedProject?.id && p.projectId === selectedProject.id;

            return (
              <SelectionCard
                key={p.id}
                item={p}
                title={p.name}
                selected={selectedPodObektId === p.id}
                onSelect={onSelect}
                meta={
                  belongsToProject ? (
                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                      в {selectedProject?.name}
                    </span>
                  ) : null
                }
              />
            );
          })
        )}
      </div>
    </Modal>
  );
}
