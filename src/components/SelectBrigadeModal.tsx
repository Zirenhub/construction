"use client";

import { useMemo } from "react";
import { BrigadeWithAll, ProjectWithRelations, TPodObekt } from "@/lib/types";
import Modal from "./Modal";
import SelectionCard from "./SelectionCard";

interface SelectBrigadeModalProps {
  isOpen: boolean;
  isLoading: boolean;
  brigades: BrigadeWithAll[];
  selectedBrigadeId?: string;
  selectedProject: ProjectWithRelations | null;
  selectedPodObekt: TPodObekt | null;
  onClose: () => void;
  onSelect: (brigade: BrigadeWithAll) => void;
}

export default function SelectBrigadeModal({
  isOpen,
  isLoading,
  brigades,
  selectedBrigadeId,
  selectedProject,
  selectedPodObekt,
  onClose,
  onSelect,
}: SelectBrigadeModalProps) {
  const sortedBrigades = useMemo(() => {
    if (!brigades) return [];
    const podId = selectedPodObekt?.id;
    const projId = selectedProject?.id;

    return [...brigades].sort((a, b) => {
      const aMatches = a.smr.some(
        (s) => s.podObektId === podId || s.podObekt?.projectId === projId,
      );
      const bMatches = b.smr.some(
        (s) => s.podObektId === podId || s.podObekt?.projectId === projId,
      );

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [brigades, selectedPodObekt?.id, selectedProject?.id]);

  return (
    <Modal
      isLoading={isLoading}
      title="Избери бригада"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {sortedBrigades.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-line rounded-xl">
            <p className="text-xs text-ink-4">Няма намерени бригади</p>
          </div>
        ) : (
          sortedBrigades.map((b) => {
            const isActiveInPodObekt =
              selectedPodObekt?.id &&
              b.smr.some((s) => s.podObektId === selectedPodObekt.id);
            const isActiveInProject =
              selectedProject?.id &&
              b.smr.some((s) => s.podObekt?.projectId === selectedProject.id);

            let badgeText: string | null = null;
            if (isActiveInPodObekt) badgeText = `в ${selectedPodObekt?.name}`;
            else if (isActiveInProject)
              badgeText = `в ${selectedProject?.name}`;

            return (
              <SelectionCard
                key={b.id}
                item={b}
                title={b.name}
                subtitle={`${b.members.length} члена`}
                selected={selectedBrigadeId === b.id}
                onSelect={onSelect}
                meta={
                  badgeText ? (
                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                      {badgeText}
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
