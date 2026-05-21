import PodObektiClient from '@/components/PodObektiClient';
import { getBrigadesList, getPodObekt, getProject } from '@/lib/actions';
import { notFound } from 'next/navigation';

export default async function PodObektPage({
  params,
}: {
  params: Promise<{ projectId: string; podId: string }>;
}) {
  const { projectId, podId } = await params;
  const [project, pod, brigades] = await Promise.all([
    getProject(projectId),
    getPodObekt(podId),
    getBrigadesList(),
  ]);
  if (!project || !pod) notFound();

  return <PodObektiClient pod={pod} projectId={projectId} project={project} brigades={brigades} />;
}
