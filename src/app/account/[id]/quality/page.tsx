import { QualityScoreTable } from "@/components/QualityScoreTable";
import { MetricCard } from "@/components/MetricCard";
import { getAccount, getKeywordsQuality } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function QualityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = parseInt(id);
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
      <div>
        <Link href={`/account/${accountId}`} className="text-[var(--color-primary)] text-sm hover:underline">
          ← {account.name}
        </Link>
        <h1 className="text-2xl font-bold text-white mt-1">Quality Score</h1>
        <p className="text-[var(--color-muted)] text-sm mt-1">{keywords.length} palavras-chave analisadas</p>
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
