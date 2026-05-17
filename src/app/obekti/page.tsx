import ObektiClient from '@/components/ObektiClient';
import { getProjects } from '@/lib/actions';

export default async function ObektiPage() {
  const projects = await getProjects();
  return <ObektiClient initialProjects={projects} />;
}
