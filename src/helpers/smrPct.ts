import { SMR } from "@/generated/prisma/client";

export default function smrPct(smr: SMR | null | undefined): number {
  if (!smr || !smr.quantity || smr.quantity <= 0) {
    return 0;
  }
  const pct = Math.round(((smr.done || 0) / smr.quantity) * 100);
  return isNaN(pct) ? 0 : pct;
}
