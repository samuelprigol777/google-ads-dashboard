type Campaign = {
  name: string;
  type: string;
  status: string;
  daily_budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  avg_cpc: number;
  conversions: number;
  cost: number;
  cpa: number;
};

const typeColors: Record<string, string> = {
  SEARCH: "bg-blue-500/20 text-blue-400",
  PERFORMANCE_MAX: "bg-purple-500/20 text-purple-400",
  DISPLAY: "bg-green-500/20 text-green-400",
  VIDEO: "bg-red-500/20 text-red-400",
  SHOPPING: "bg-yellow-500/20 text-yellow-400",
  DEMAND_GEN: "bg-pink-500/20 text-pink-400",
};

const statusColors: Record<string, string> = {
  ENABLED: "bg-green-500/20 text-green-400",
  PAUSED: "bg-yellow-500/20 text-yellow-400",
  REMOVED: "bg-red-500/20 text-red-400",
};

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <th className="text-left py-3 px-3 font-medium">Campanha</th>
            <th className="text-left py-3 px-3 font-medium">Tipo</th>
            <th className="text-left py-3 px-3 font-medium">Status</th>
            <th className="text-right py-3 px-3 font-medium">Orçamento/dia</th>
            <th className="text-right py-3 px-3 font-medium">Impressões</th>
            <th className="text-right py-3 px-3 font-medium">Cliques</th>
            <th className="text-right py-3 px-3 font-medium">CTR</th>
            <th className="text-right py-3 px-3 font-medium">CPC Médio</th>
            <th className="text-right py-3 px-3 font-medium">Conversões</th>
            <th className="text-right py-3 px-3 font-medium">Custo</th>
            <th className="text-right py-3 px-3 font-medium">CPA</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-card-hover)] transition-colors">
              <td className="py-3 px-3 text-white font-medium max-w-[200px] truncate" title={c.name}>{c.name}</td>
              <td className="py-3 px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[c.type] || "bg-gray-500/20 text-gray-400"}`}>
                  {c.type}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[c.status] || "bg-gray-500/20 text-gray-400"}`}>
                  {c.status}
                </span>
              </td>
              <td className="py-3 px-3 text-right">R$ {c.daily_budget.toFixed(2)}</td>
              <td className="py-3 px-3 text-right">{c.impressions.toLocaleString("pt-BR")}</td>
              <td className="py-3 px-3 text-right">{c.clicks.toLocaleString("pt-BR")}</td>
              <td className="py-3 px-3 text-right">{(c.ctr * 100).toFixed(2)}%</td>
              <td className="py-3 px-3 text-right">R$ {c.avg_cpc.toFixed(2)}</td>
              <td className="py-3 px-3 text-right font-medium text-[var(--color-success)]">{c.conversions.toFixed(1)}</td>
              <td className="py-3 px-3 text-right">R$ {c.cost.toFixed(2)}</td>
              <td className="py-3 px-3 text-right">R$ {c.cpa.toFixed(2)}</td>
            </tr>
          ))}
          {campaigns.length === 0 && (
            <tr>
              <td colSpan={11} className="py-8 text-center text-[var(--color-muted)]">Nenhuma campanha encontrada</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
