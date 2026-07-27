"use client";

import CreateProjectSheet from "@/components/CreateProjectSheet";
import { createProject } from "@/lib/actions";
import { ProjectWithRelations } from "@/lib/types";
import { useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ObektiClient({
  initialProjects,
}: {
  initialProjects: ProjectWithRelations[];
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const active = initialProjects.filter((p) => p.active);
  const inactive = initialProjects.filter((p) => !p.active);

  async function handleCreate(data: { name: string; location: string }) {
    await createProject(data);
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between px-4 py-4 border-b border-line md:px-6 md:py-5">
          <h1 className="text-base font-medium text-ink md:text-lg">Обекти</h1>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-line-2 rounded-lg
              text-ink-2 hover:bg-lift hover:text-ink transition-colors md:px-3.5 md:text-sm"
          >
            + Нов обект
          </button>
        </div>

        <div className="p-4 space-y-6 md:p-6 md:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-medium uppercase tracking-widest text-ink-4">
                Активни
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-950 text-green-400">
                {active.length}
              </span>
            </div>
            {active.length === 0 ? (
              <p className="text-sm text-ink-5">
                Няма активни обекти. Създайте първия.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          <hr className="border-line" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-medium uppercase tracking-widest text-ink-4">
                Неактивни
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lift text-ink-4">
                {inactive.length}
              </span>
            </div>
            {inactive.length === 0 ? (
              <p className="text-sm text-ink-5">Няма неактивни обекти.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {inactive.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectSheet
        open={sheetOpen}
        onCloseAction={() => setSheetOpen(false)}
        onSaveAction={handleCreate}
      />
    </>
  );
}
