import CreatePodObektButton from '@/components/CreatePodObektButton';
import { getProject } from '@/lib/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-800 md:px-6 md:py-5">
        <Link
          href="/obekti"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors shrink-0"
        >
          Обекти
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="text-sm font-medium text-zinc-100 truncate md:text-lg">
          {project.name}
        </h1>
        <span
          className={`ml-auto shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full
          ${project.active ? 'bg-green-950 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}
        >
          {project.active ? 'Активен' : 'Неактивен'}
        </span>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
              Под обекти
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {project.podObekti.length}
            </span>
          </div>
          <CreatePodObektButton projectId={project.id} />
        </div>

        {project.podObekti.length === 0 ? (
          <p className="text-sm text-zinc-600">Няма под обекти.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.podObekti.map((pod) => {
              const activeCount = pod.smr.filter((s) => s.active).length;
              const avgProgress = pod.smr.length
                ? Math.round(
                    pod.smr.reduce(
                      (acc, s) =>
                        acc +
                        (s.quantity > 0 ? (s.done / s.quantity) * 100 : 0),
                      0
                    ) / pod.smr.length
                  )
                : 0;

              return (
                <Link
                  key={pod.id}
                  href={`/obekti/${project.id}/${pod.id}`}
                  className="block border border-zinc-800 rounded-xl p-4 bg-zinc-900 hover:border-zinc-600 transition-colors active:bg-zinc-800"
                >
                  <p className="text-sm font-medium text-zinc-100 mb-3">
                    {pod.name}
                  </p>
                  <div className="w-full bg-zinc-800 rounded-full h-1 mb-3">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{activeCount} активни СМР</span>
                    <span>{avgProgress}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
