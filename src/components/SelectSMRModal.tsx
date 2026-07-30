import { SMRWithAll } from "@/lib/types";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import SelectionCard from "./SelectionCard";

interface SelectSMRModalProps {
  isOpen: boolean;
  isLoading: boolean;
  smrs: SMRWithAll[];
  selectedSmr: SMRWithAll | null;
  onClose: () => void;
  onSelect: (smr: SMRWithAll) => void;
}

export default function SelectSMRModal({
  isOpen,
  isLoading,
  smrs,
  selectedSmr,
  onClose,
  onSelect,
}: SelectSMRModalProps) {
  const [notesOpen, setNotesOpen] = useState<boolean>(false);

  const sortedSmrs = useMemo(() => {
    return [...smrs].sort((a, b) => {
      const projectA = a.podObekt.project.name.toLowerCase();
      const projectB = b.podObekt.project.name.toLowerCase();

      if (projectA < projectB) return -1;
      if (projectA > projectB) return 1;

      const podObektA = a.podObekt.name.toLowerCase();
      const podObektB = b.podObekt.name.toLowerCase();

      if (podObektA < podObektB) return -1;
      if (podObektA > podObektB) return 1;

      return 0;
    });
  }, [smrs]);

  return (
    <Modal
      isLoading={isLoading}
      title="Избери SMR"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {sortedSmrs.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-line rounded-xl">
            <p className="text-xs text-ink-4">Няма намерени</p>
          </div>
        ) : (
          <>
            {sortedSmrs.map((s) => {
              return (
                <SelectionCard
                  key={s.id}
                  item={s}
                  title={s.name}
                  selected={selectedSmr?.id === s.id}
                  onSelect={(m) => onSelect(m)}
                  subtitle={`${s.brigade?.name ? s.brigade.name : ""}`}
                  meta={
                    <>
                      <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md shrink-0">
                        {s.podObekt.project.name}
                      </span>
                      <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                        {s.podObekt.name}
                      </span>
                    </>
                  }
                  // meta={
                  //   isFromSelectedBrigade ? (
                  //     <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                  //       от {member.brigadeName}
                  //     </span>
                  //   ) : null
                  // }
                />
              );
              /*     {
              <SmrHeader
              name={s.name}
              brigadeName={s.brigade?.name}
              notesCount={s.notes.length}
              onOpenNotes={(e) => {
                e.stopPropagation();
                setNotesOpen(true);
              }}
            /> 
              } */
              // );
            })}
          </>
        )}
      </div>
    </Modal>
  );
}
