import { QualityScoreTable } from "@/components/QualityScoreTable";
import { MetricCard } from "@/components/MetricCard";
import { DateFilter } from "@/components/DateFilter";
import { getAccount, getKeywordsQuality } from "@/lib/data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function AccountQuality({
  accountId,
  basePath,
}: {
  accountId: number;
  basePath: string;
}) {
  const account = await getAccount(accountId);
  if (!account) notFound();

  const keywords = await getKeywordsQuality(accountId);

  const withScore = keywords.filter((k) => k.quality_score !== null);
  const avgQS = withScore.length > 0
    ? withScore.reduce((s, k) => s + (k.quality_score || 0), 0) / withScore.length
    : 0;
  const lowQS = withScore.filter((k) => (k.quality_score || 0) <= 4).length;
  const highQS = withScore.filter((k) => (k.quality_score || 0) >= 7).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quality Score</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">{keywords.length} palavras-chave analisadas</p>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl px-4 py-3">
          <Suspense fallback={<div className="h-8" />}>
            <DateFilter />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="QS Médio" value={avgQS.toFixed(1)} subtitle={`${withScore.length} com score`} color="blue" />
        <MetricCard title="QS Alto (≥7)" value={String(highQS)} color="green" />
        <MetricCard title="QS Baixo (≤4)" value={String(lowQS)} color="red" />
      </div>

      <div className="bg-[var(--color-card)] rounded-xl p-5">
        <QualityScoreTable keywords={keywords} />
      </div>
    </div>
  );
}
