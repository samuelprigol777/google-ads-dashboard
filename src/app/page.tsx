import { MetricCard } from "@/components/MetricCard";
import { getOverviewMetrics } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

const projectColors: Record<number, { bg: string; border: string; dot: string }> = {
  1: { bg: "hover:border-purple-500/50", border: "border-purple-500/20", dot: "bg-purple-500" },
  2: { bg: "hover:border-blue-500/50", border: "border-blue-500/20", dot: "bg-blue-500" },
};

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-[var(--color-muted)] text-sm mt-1">Resumo de todas as contas Google Ads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Impressões" value={grandTotals.impressions.toLocaleString("pt-BR")} color="blue" />
        <MetricCard title="Cliques" value={grandTotals.clicks.toLocaleString("pt-BR")} subtitle={`CTR: ${(grandCtr * 100).toFixed(2)}%`} color="blue" />
        <MetricCard title="Custo Total" value={`R$ ${grandTotals.cost.toFixed(2)}`} color="yellow" />
        <MetricCard title="Conversões" value={grandTotals.conversions.toFixed(1)} subtitle={`CPA: R$ ${grandCpa.toFixed(2)}`} color="green" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Selecione um projeto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overview.map((o) => {
            const colors = projectColors[o.account.id] || projectColors[1];
            const ctr = o.totals.impressions > 0 ? o.totals.clicks / o.totals.impressions : 0;
            const cpa = o.totals.conversions > 0 ? o.totals.cost / o.totals.conversions : 0;
            return (
              <Link
                key={o.account.id}
                href={`/account/${o.account.id}`}
                className={`bg-[var(--color-card)] rounded-xl p-6 border-2 ${colors.border} ${colors.bg} transition-all block group`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`w-3 h-3 rounded-full ${colors.dot}`}></span>
                  <h3 className="text-xl font-bold text-white">{o.account.name}</h3>
                  <span className="ml-auto text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                    {o.account.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-[var(--color-background)] rounded-lg p-3">
                    <p className="text-[var(--color-muted)] text-xs mb-1">Impressões</p>
                    <p className="text-white font-semibold text-lg">{o.totals.impressions.toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="bg-[var(--color-background)] rounded-lg p-3">
                    <p className="text-[var(--color-muted)] text-xs mb-1">Cliques</p>
                    <p className="text-white font-semibold text-lg">{o.totals.clicks.toLocaleString("pt-BR")}</p>
                    <p className="text-[var(--color-muted)] text-xs">CTR: {(ctr * 100).toFixed(2)}%</p>
                  </div>
                  <div className="bg-[var(--color-background)] rounded-lg p-3">
                    <p className="text-[var(--color-muted)] text-xs mb-1">Custo</p>
                    <p className="text-yellow-400 font-semibold text-lg">R$ {o.totals.cost.toFixed(2)}</p>
                  </div>
                  <div className="bg-[var(--color-background)] rounded-lg p-3">
                    <p className="text-[var(--color-muted)] text-xs mb-1">Conversões</p>
                    <p className="text-green-400 font-semibold text-lg">{o.totals.conversions.toFixed(1)}</p>
                    <p className="text-[var(--color-muted)] text-xs">CPA: R$ {cpa.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--color-muted)]">
                    ID: {o.account.google_ads_id}
                  </p>
                  <p className="text-sm text-[var(--color-primary)] font-medium group-hover:translate-x-1 transition-transform">
                    Abrir Dashboard →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
