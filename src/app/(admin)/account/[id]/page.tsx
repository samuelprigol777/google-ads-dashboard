import { MetricCard } from "@/components/MetricCard";
import { CampaignTable } from "@/components/CampaignTable";
import { PerformanceChart } from "@/components/PerformanceChart";
import { DateFilter } from "@/components/DateFilter";
import { getAccount, getCampaignMetrics } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = parseInt(id);
  const account = await getAccount(accountId);
  if (!account) notFound();

  const metrics = await getCampaignMetrics(accountId);

  const totalImpressions = metrics.reduce((s, m) => s + (m.impressions || 0), 0);
  const totalClicks = metrics.reduce((s, m) => s + (m.clicks || 0), 0);
  const totalCost = metrics.reduce((s, m) => s + (m.cost || 0), 0);
  const totalConversions = metrics.reduce((s, m) => s + (m.conversions || 0), 0);
  const ctr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const cpa = totalConversions > 0 ? totalCost / totalConversions : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const campaigns = metrics.map((m: any) => ({
    name: (m.campaign_name || m.campaigns?.name || "") as string,
    type: (m.type || m.campaigns?.type || "") as string,
    status: (m.status || m.campaigns?.status || "") as string,
    daily_budget: (m.daily_budget || m.campaigns?.daily_budget || 0) as number,
    impressions: (m.impressions || 0) as number,
    clicks: (m.clicks || 0) as number,
    ctr: (m.ctr || 0) as number,
    avg_cpc: (m.avg_cpc || 0) as number,
    conversions: (m.conversions || 0) as number,
    cost: (m.cost || 0) as number,
    cpa: (m.cpa || 0) as number,
  }));

  const chartData = campaigns
    .filter((c) => c.impressions > 0 || c.clicks > 0)
    .map((c) => ({
      name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
      impressions: c.impressions,
      clicks: c.clicks,
      conversions: c.conversions,
      cost: c.cost,
    }));

  const projectColor = accountId === 1 ? "purple" : "blue";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full bg-${projectColor}-500`}></span>
            <div>
              <h1 className="text-2xl font-bold text-white">{account.name}</h1>
              <p className="text-[var(--color-muted)] text-sm mt-1">
                ID: {account.google_ads_id} · {account.currency} · {account.timezone}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/account/${accountId}/search-terms`}
              className="px-4 py-2 bg-[var(--color-card)] text-sm text-white rounded-lg hover:bg-[var(--color-card-hover)] transition-colors"
            >
              Termos de Busca
            </Link>
            <Link
              href={`/account/${accountId}/quality`}
              className="px-4 py-2 bg-[var(--color-card)] text-sm text-white rounded-lg hover:bg-[var(--color-card-hover)] transition-colors"
            >
              Quality Score
            </Link>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-[var(--color-card)] rounded-xl px-4 py-3">
          <Suspense fallback={<div className="h-8" />}>
            <DateFilter />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Impressões" value={totalImpressions.toLocaleString("pt-BR")} color="blue" />
        <MetricCard title="Cliques" value={totalClicks.toLocaleString("pt-BR")} subtitle={`CTR: ${(ctr * 100).toFixed(2)}%`} color="blue" />
        <MetricCard title="Custo Total" value={`R$ ${totalCost.toFixed(2)}`} color="yellow" />
        <MetricCard title="Conversões" value={totalConversions.toFixed(1)} subtitle={`CPA: R$ ${cpa.toFixed(2)}`} color="green" />
      </div>

      <div className="bg-[var(--color-card)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Performance por Campanha</h2>
        <PerformanceChart data={chartData} />
      </div>

      <div className="bg-[var(--color-card)] rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Campanhas</h2>
        <CampaignTable campaigns={campaigns} />
      </div>
    </div>
  );
}
