import { projects } from '@/lib/data';
import Link from 'next/link';

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Link
      href={`/obekti/${project.id}`}
      className={`block border border-zinc-800 rounded-xl p-4 bg-zinc-900 hover:border-zinc-600 transition-colors
        ${!project.active ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`w-2 h-2 rounded-full shrink-0
          ${project.active ? 'bg-green-500' : 'bg-zinc-600'}`}
        />
        <span className="text-sm font-medium text-zinc-100 truncate">
          {project.name}
        </span>
      </div>
      <p className="text-xs text-zinc-500 pl-4 mb-3">{project.location}</p>
      <p className="text-xs text-zinc-600 pl-4">
        {project.podObekti.length} под обекта
      </p>
    </Link>
  );
}

export default function ObektiPage() {
  const active = projects.filter((p) => p.active);
  const inactive = projects.filter((p) => !p.active);

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-medium text-zinc-100">Обекти</h1>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
          + Нов обект
        </button>
      </div>

      <div className="p-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Активни
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-950 text-green-400">
              {active.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {active.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        <hr className="border-zinc-800" />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Неактивни
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
              {inactive.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
            {inactive.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
