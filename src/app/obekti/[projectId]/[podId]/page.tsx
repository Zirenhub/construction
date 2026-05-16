import SmrSection from '@/components/SmrSection';
import { getPodObekt, getProject } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PodObektPage({
  params,
}: {
  params: Promise<{ projectId: string; podId: string }>;
}) {
  const { projectId, podId } = await params;
  const project = getProject(projectId);
  const pod = getPodObekt(projectId, podId);
  if (!project || !pod) notFound();

  const active = pod.smr.filter((s) => s.active);
  const inactive = pod.smr.filter((s) => !s.active);

  return (
    <div>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-800 flex-wrap">
        <Link
          href="/obekti"
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          Обекти
        </Link>
        <span className="text-zinc-700">/</span>
        <Link
          href={`/obekti/${project.id}`}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          {project.name}
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="text-lg font-medium text-zinc-100">{pod.name}</h1>
      </div>

      <div className="p-6 space-y-8">
        <SmrSection title="Активни СМР" smr={active} active />
        <hr className="border-zinc-800" />
        <SmrSection title="Неактивни СМР" smr={inactive} active={false} />
      </div>
    </div>
  );
}
