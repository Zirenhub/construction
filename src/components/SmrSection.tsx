import { SMR } from '@/types';

export default function SmrSection({
  title,
  smr,
  active,
}: {
  title: string;
  smr: SMR[];
  active: boolean;
}) {
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
        <p className="text-zinc-600 text-sm">Няма СМР.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {smr.map((s) => (
            <div
              key={s.id}
              className={`border border-zinc-800 rounded-xl p-4 bg-zinc-900
                ${!active ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{s.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.brigade}</p>
                </div>
                <span className="text-xs font-medium text-zinc-400 shrink-0">
                  {s.progress}%
                </span>
              </div>

              <div className="w-full bg-zinc-800 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all
                    ${s.progress === 100 ? 'bg-zinc-500' : 'bg-green-500'}`}
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
