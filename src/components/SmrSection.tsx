import { SMR } from '@/types';
import SmrCard from './SmrCard';

type Props = {
  title: string;
  smr: SMR[];
  active: boolean;
  onUpdateAction: (id: string, done: number, note: string) => void;
};

export default function SmrSection({
  title,
  smr,
  active,
  onUpdateAction,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          {title}
        </span>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full
          ${active ? 'bg-green-950 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}
        >
          {smr.length}
        </span>
      </div>

      {smr.length === 0 ? (
        <p className="text-sm text-zinc-600">Няма СМР.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {smr.map((s) => (
            <SmrCard key={s.id} smr={s} onUpdateAction={onUpdateAction} />
          ))}
        </div>
      )}
    </div>
  );
}
