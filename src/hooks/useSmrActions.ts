"use client";

import { useState, useTransition, useOptimistic } from "react";
import { SMRWithUpdates } from "@/lib/types";

type ActionHandlers = {
  onUpdateAction: (id: string, done: number, note: string) => Promise<void>;
  onTogglePaidAction: (smrId: string, paid: boolean) => Promise<void>;
};

export function useSmrActions(smr: SMRWithUpdates, handlers: ActionHandlers) {
  const [updateDone, setUpdateDone] = useState("");
  const [updateNote, setUpdateNote] = useState("");
  const [updateError, setUpdateError] = useState("");

  const [isPending, startTransition] = useTransition();
  const [isPaidPending, startPaidTransition] = useTransition();

  // Optimistic UI updates for immediate feedback
  const [optimisticSmr, setOptimisticSmr] = useOptimistic(
    smr,
    (state, update: { paid?: boolean; addedDone?: number }) => ({
      ...state,
      paid: update.paid ?? state.paid,
      done: update.addedDone ? state.done + update.addedDone : state.done,
    }),
  );

  const handleUpdate = () => {
    const val = Number(updateDone);

    if (!updateDone || isNaN(val) || val <= 0) {
      setUpdateError("Въведете валидно количество");
      return;
    }

    const remaining = smr.quantity - smr.done;
    if (val > remaining) {
      setUpdateError(`Максимум ${remaining} ${smr.unit} остават`);
      return;
    }

    const capturedNote = updateNote.trim();
    setUpdateDone("");
    setUpdateNote("");
    setUpdateError("");

    startTransition(async () => {
      setOptimisticSmr({ addedDone: val });
      await handlers.onUpdateAction(smr.id, val, capturedNote);
    });
  };

  const handleCompleteAll = () => {
    const remaining = smr.quantity - smr.done;
    if (remaining <= 0) return;

    const capturedNote = updateNote.trim() || "Завършено";
    setUpdateNote("");
    setUpdateError("");

    startTransition(async () => {
      setOptimisticSmr({ addedDone: remaining });
      await handlers.onUpdateAction(smr.id, remaining, capturedNote);
    });
  };

  const handleTogglePaid = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextPaid = !optimisticSmr.paid;

    startPaidTransition(async () => {
      setOptimisticSmr({ paid: nextPaid });
      await handlers.onTogglePaidAction(smr.id, nextPaid);
    });
  };

  return {
    smr: optimisticSmr,
    isPending,
    isPaidPending,
    updateDone,
    updateNote,
    updateError,
    setUpdateDone: (val: string) => {
      setUpdateDone(val);
      if (updateError) setUpdateError("");
    },
    setUpdateNote,
    handleUpdate,
    handleCompleteAll,
    handleTogglePaid,
  };
}
