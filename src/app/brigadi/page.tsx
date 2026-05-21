import BrigadiClient from '@/components/BrigadiClient';
import { getBrigades } from '@/lib/actions';

export default async function BrigadiPage() {
  const brigades = await getBrigades();
  return <BrigadiClient initialBrigades={brigades} />;
}
