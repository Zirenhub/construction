"use client";

import { useState } from "react";
import { SMRWithUpdates } from "@/lib/types";
import SmrNotesPanel from "./SmrNotesPanel";
import { useSmrActions } from "../hooks/useSmrActions";
import { SmrHeader } from "./SmrHeader";
import { SmrProgress } from "./SmrProgress";
import { SmrMetaGrid } from "./SmrMetaGrid";
import { SmrHistory } from "./SmrHistory";
import { SmrUpdateForm } from "./SmrUpdateForm";
import smrPct from "@/helpers/smrPct";

type Props = {
  smr: SMRWithUpdates;
  onUpdateAction: (id: string, done: number, note: string) => Promise<void>;
  onAddNoteAction: (smrId: string, content: string) => Promise<void>;
  onTogglePaidAction: (smrId: string, paid: boolean) => Promise<void>;
};

export default function SmrCard({
  smr: initialSmr,
  onUpdateAction,
  onAddNoteAction,
  onTogglePaidAction,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const {
    smr,
    isPending,
    isPaidPending,
    updateDone,
    updateNote,
    updateError,
    setUpdateDone,
    setUpdateNote,
    handleUpdate,
    handleCompleteAll,
    handleTogglePaid,
  } = useSmrActions(initialSmr, { onUpdateAction, onTogglePaidAction });

  const pct = smrPct(smr);
  const earned = smr.pricePerUnit * smr.done;

  return (
    <>
      <div
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className={`border rounded-xl bg-surface transition-all focus:outline-none focus:ring-1 focus:ring-line-3 ${
          !smr.active
            ? "border-line opacity-50"
            : "border-line hover:border-line-2"
        }`}
      >
        <div className="p-4 cursor-pointer select-none">
          <SmrHeader
            name={smr.name}
            brigadeName={smr.brigade?.name}
            pct={pct}
            notesCount={smr.notes.length}
            expanded={expanded}
            onOpenNotes={(e) => {
              e.stopPropagation();
              setNotesOpen(true);
            }}
          />

          <SmrProgress
            done={smr.done}
            quantity={smr.quantity}
            unit={smr.unit}
            earned={earned}
            totalValue={smr.totalValue}
            act={smr.act}
            paid={smr.paid}
            isPaidPending={isPaidPending}
            onTogglePaid={handleTogglePaid}
          />
        </div>

        {/* Expanded Panel */}
        {expanded && (
          <div
            className="border-t border-line/60 bg-well/20 px-4 py-4 space-y-4 rounded-b-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <SmrMetaGrid
              unit={smr.unit}
              pricePerUnit={smr.pricePerUnit}
              totalValue={smr.totalValue}
              note={smr.note}
            />

            <SmrHistory updates={smr.updates} unit={smr.unit} />

            {smr.active && (
              <SmrUpdateForm
                unit={smr.unit}
                quantity={smr.quantity}
                done={smr.done}
                updateDone={updateDone}
                updateNote={updateNote}
                updateError={updateError}
                isPending={isPending}
                onDoneChange={setUpdateDone}
                onNoteChange={setUpdateNote}
                onSubmit={handleUpdate}
                onCompleteAll={handleCompleteAll}
              />
            )}
          </div>
        )}
      </div>

      {notesOpen && (
        <SmrNotesPanel
          smrName={smr.name}
          notes={smr.notes}
          onAddNoteAction={(content) => onAddNoteAction(smr.id, content)}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </>
  );
}
