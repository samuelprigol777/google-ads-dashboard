import type { KeywordQuality } from "@/lib/supabase";

function QSBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">N/A</span>;
  }
  let color = "bg-red-500/20 text-red-400";
  if (score >= 7) color = "bg-green-500/20 text-green-400";
  else if (score >= 4) color = "bg-yellow-500/20 text-yellow-400";
  return <span className={`px-2 py-0.5 rounded text-xs font-bold ${color}`}>{score}/10</span>;
}

function RatingBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    ABOVE_AVERAGE: "text-green-400",
    AVERAGE: "text-yellow-400",
    BELOW_AVERAGE: "text-red-400",
  };
  const labels: Record<string, string> = {
    ABOVE_AVERAGE: "Acima",
    AVERAGE: "Média",
    BELOW_AVERAGE: "Abaixo",
  };
  return <span className={`text-xs ${colors[value] || "text-gray-400"}`}>{labels[value] || value}</span>;
}

export function QualityScoreTable({ keywords }: { keywords: KeywordQuality[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <th className="text-left py-3 px-3 font-medium">Palavra-chave</th>
            <th className="text-left py-3 px-3 font-medium">Campanha</th>
            <th className="text-left py-3 px-3 font-medium">Grupo</th>
            <th className="text-center py-3 px-3 font-medium">QS</th>
            <th className="text-center py-3 px-3 font-medium">CTR Esperado</th>
            <th className="text-center py-3 px-3 font-medium">Relevância</th>
            <th className="text-center py-3 px-3 font-medium">Landing Page</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((kw, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-card-hover)] transition-colors">
              <td className="py-3 px-3 text-white font-medium">{kw.keyword}</td>
              <td className="py-3 px-3 text-[var(--color-muted)] max-w-[180px] truncate" title={kw.campaign_name}>{kw.campaign_name}</td>
              <td className="py-3 px-3 text-[var(--color-muted)] max-w-[150px] truncate" title={kw.ad_group}>{kw.ad_group}</td>
              <td className="py-3 px-3 text-center"><QSBadge score={kw.quality_score} /></td>
              <td className="py-3 px-3 text-center"><RatingBadge value={kw.expected_ctr} /></td>
              <td className="py-3 px-3 text-center"><RatingBadge value={kw.ad_relevance} /></td>
              <td className="py-3 px-3 text-center"><RatingBadge value={kw.landing_page_exp} /></td>
            </tr>
          ))}
          {keywords.length === 0 && (
            <tr>
              <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">Nenhum dado de Quality Score</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
