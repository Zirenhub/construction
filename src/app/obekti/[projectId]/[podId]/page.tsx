import PodObektClient from '@/components/PodObektiClient';
import { getPodObekt, getProject } from '@/lib/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PodObektPage({
  params,
}: {
  params: Promise<{ projectId: string; podId: string }>;
}) {
  const { projectId, podId } = await params;
  const [project, pod] = await Promise.all([
    getProject(projectId),
    getPodObekt(podId),
  ]);
  if (!project || !pod) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-zinc-800 md:px-6 md:py-5">
        <Link
          href="/obekti"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors shrink-0 hidden sm:inline"
        >
          Обекти
        </Link>
        <span className="text-zinc-700 hidden sm:inline">/</span>
        <Link
          href={`/obekti/${project.id}`}
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors shrink-0"
        >
          <span className="sm:hidden">← </span>
          {project.name}
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="text-sm font-medium text-zinc-100 truncate md:text-base">
          {pod.name}
        </h1>
      </div>

      <PodObektClient pod={pod} projectId={projectId} />
    </div>
  );
}
