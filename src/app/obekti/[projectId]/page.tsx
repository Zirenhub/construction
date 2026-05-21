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
      <div className="flex items-center gap-2 px-4 py-4 border-b border-line md:px-6 md:py-5">
        <Link
          href="/obekti"
          className="text-ink-4 hover:text-ink-2 text-sm transition-colors shrink-0"
        >
          Обекти
        </Link>
        <span className="text-ink-ghost">/</span>
        <h1 className="text-sm font-medium text-ink truncate md:text-lg">
          {project.name}
        </h1>
        <span
          className={`ml-auto shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full
          ${project.active ? 'bg-green-950 text-green-400' : 'bg-lift text-ink-4'}`}
        >
          {project.active ? 'Активен' : 'Неактивен'}
        </span>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-widest text-ink-4">
              Под обекти
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-lift text-ink-3">
              {project.podObekti.length}
            </span>
          </div>
          <CreatePodObektButton projectId={project.id} />
        </div>

        {project.podObekti.length === 0 ? (
          <p className="text-sm text-ink-5">Няма под обекти.</p>
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
                  className="block border border-line rounded-xl p-4 bg-surface hover:border-line-3 transition-colors active:bg-lift"
                >
                  <p className="text-sm font-medium text-ink mb-3">
                    {pod.name}
                  </p>
                  <div className="w-full bg-line rounded-full h-1 mb-3">
                    <div
                      className="bg-green-500 h-1 rounded-full"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-4">
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
