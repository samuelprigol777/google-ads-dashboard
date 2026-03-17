import type { SearchTerm } from "@/lib/supabase";

export function SearchTermsTable({ terms }: { terms: SearchTerm[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <th className="text-left py-3 px-3 font-medium">Termo de Busca</th>
            <th className="text-left py-3 px-3 font-medium">Campanha</th>
            <th className="text-left py-3 px-3 font-medium">Grupo</th>
            <th className="text-right py-3 px-3 font-medium">Impressões</th>
            <th className="text-right py-3 px-3 font-medium">Cliques</th>
            <th className="text-right py-3 px-3 font-medium">CTR</th>
            <th className="text-right py-3 px-3 font-medium">Conversões</th>
            <th className="text-right py-3 px-3 font-medium">Custo</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((t, i) => (
            <tr key={i} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-card-hover)] transition-colors">
              <td className="py-3 px-3 text-white font-medium">{t.term}</td>
              <td className="py-3 px-3 text-[var(--color-muted)] max-w-[180px] truncate">{t.campaign_name}</td>
              <td className="py-3 px-3 text-[var(--color-muted)] max-w-[150px] truncate">{t.ad_group}</td>
              <td className="py-3 px-3 text-right">{t.impressions.toLocaleString("pt-BR")}</td>
              <td className="py-3 px-3 text-right">{t.clicks.toLocaleString("pt-BR")}</td>
              <td className="py-3 px-3 text-right">{(t.ctr * 100).toFixed(2)}%</td>
              <td className="py-3 px-3 text-right font-medium text-[var(--color-success)]">{t.conversions.toFixed(1)}</td>
              <td className="py-3 px-3 text-right">R$ {t.cost.toFixed(2)}</td>
            </tr>
          ))}
          {terms.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-[var(--color-muted)]">Nenhum termo de busca encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
