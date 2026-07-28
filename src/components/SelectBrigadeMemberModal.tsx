"use client";

import { useMemo } from "react";
import { BrigadeMember } from "@/generated/prisma/client";
import { BrigadeWithAll } from "@/lib/types";
import Modal from "./Modal";
import SelectionCard from "./SelectionCard";

interface ExtendedMember extends BrigadeMember {
  brigadeName: string;
}

interface SelectBrigadeMemberModalProps {
  isOpen: boolean;
  isLoading: boolean;
  brigades: BrigadeWithAll[];
  selectedMemberId?: string | null;
  selectedBrigade: BrigadeWithAll | null;
  onClose: () => void;
  onSelect: (member: BrigadeMember, parentBrigade: BrigadeWithAll) => void;
}

export default function SelectBrigadeMemberModal({
  isOpen,
  isLoading,
  brigades,
  selectedMemberId,
  selectedBrigade,
  onClose,
  onSelect,
}: SelectBrigadeMemberModalProps) {
  const { sortedMembers, brigadeMap } = useMemo(() => {
    if (!brigades) return { sortedMembers: [], brigadeMap: new Map() };

    const membersList: ExtendedMember[] = [];
    const bMap = new Map<string, BrigadeWithAll>();
    const targetBrigadeId = selectedBrigade?.id;

    brigades.forEach((b) => {
      b.members.forEach((m) => {
        membersList.push({ ...m, brigadeName: b.name });
        bMap.set(m.id, b);
      });
    });

    membersList.sort((a, b) => {
      const aMatches = a.brigadeId === targetBrigadeId;
      const bMatches = b.brigadeId === targetBrigadeId;

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return a.name.localeCompare(b.name);
    });

    return { sortedMembers: membersList, brigadeMap: bMap };
  }, [brigades, selectedBrigade?.id]);

  return (
    <Modal
      isLoading={isLoading}
      title="Избери член на бригада"
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {sortedMembers.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-line rounded-xl">
            <p className="text-xs text-ink-4">Няма намерени членове</p>
          </div>
        ) : (
          sortedMembers.map((member) => {
            const isFromSelectedBrigade =
              selectedBrigade?.id && member.brigadeId === selectedBrigade.id;
            const parentBrigade = brigadeMap.get(member.id)!;

            return (
              <SelectionCard
                key={member.id}
                item={member}
                title={member.name}
                subtitle={
                  member.role
                    ? `${member.role} • ${member.brigadeName}`
                    : member.brigadeName
                }
                selected={selectedMemberId === member.id}
                onSelect={(m) => onSelect(m, parentBrigade)}
                meta={
                  isFromSelectedBrigade ? (
                    <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md shrink-0">
                      от {member.brigadeName}
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
