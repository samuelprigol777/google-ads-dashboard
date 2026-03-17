import { MetricCard } from "@/components/MetricCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { getOverviewMetrics } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const overview = await getOverviewMetrics();

  const grandTotals = overview.reduce(
    (acc, o) => ({
      impressions: acc.impressions + o.totals.impressions,
      clicks: acc.clicks + o.totals.clicks,
      cost: acc.cost + o.totals.cost,
      conversions: acc.conversions + o.totals.conversions,
    }),
    { impressions: 0, clicks: 0, cost: 0, conversions: 0 }
  );

  const grandCtr = grandTotals.impressions > 0 ? grandTotals.clicks / grandTotals.impressions : 0;
  const grandCpa = grandTotals.conversions > 0 ? grandTotals.cost / grandTotals.conversions : 0;

  const chartData = overview.map((o) => ({
    name: o.account.name.length > 15 ? o.account.name.slice(0, 15) + "..." : o.account.name,
    impressions: o.totals.impressions,
    clicks: o.totals.clicks,
    conversions: o.totals.conversions,
    cost: o.totals.cost,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-[var(--color-muted)] text-sm mt-1">Visão geral de todas as contas Google Ads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Impressões" value={grandTotals.impressions.toLocaleString("pt-BR")} color="blue" />
        <MetricCard title="Cliques" value={grandTotals.clicks.toLocaleString("pt-BR")} subtitle={`CTR: ${(grandCtr * 100).toFixed(2)}%`} color="blue" />
        <MetricCard title="Custo Total" value={`R$ ${grandTotals.cost.toFixed(2)}`} color="yellow" />
        <MetricCard title="Conversões" value={grandTotals.conversions.toFixed(1)} subtitle={`CPA: R$ ${grandCpa.toFixed(2)}`} color="green" />
      </div>

      <div className="bg-[var(--color-card)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Performance por Conta</h2>
        <PerformanceChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {overview.map((o) => (
          <Link
            key={o.account.id}
            href={`/account/${o.account.id}`}
            className="bg-[var(--color-card)] rounded-xl p-5 hover:bg-[var(--color-card-hover)] transition-colors block"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{o.account.name}</h3>
              <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">{o.account.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--color-muted)]">Impressões</p>
                <p className="text-white font-medium">{o.totals.impressions.toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-[var(--color-muted)]">Cliques</p>
                <p className="text-white font-medium">{o.totals.clicks.toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-[var(--color-muted)]">Custo</p>
                <p className="text-white font-medium">R$ {o.totals.cost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[var(--color-muted)]">Conversões</p>
                <p className="text-white font-medium text-[var(--color-success)]">{o.totals.conversions.toFixed(1)}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--color-primary)] mt-3">Ver detalhes →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
