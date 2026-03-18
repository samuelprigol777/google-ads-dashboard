import { getSupabase } from "./supabase";
import type { Account, Campaign, CampaignMetric, SearchTerm, KeywordQuality } from "./supabase";

// Demo data based on actual Google Ads accounts
const demoAccounts: Account[] = [
  { id: 1, google_ads_id: "1206981886", name: "Y-U-P Cosméticos", currency: "BRL", timezone: "America/Sao_Paulo", status: "ENABLED" },
  { id: 2, google_ads_id: "7502967093", name: "Zanfir (Ótica Erechim)", currency: "BRL", timezone: "America/Sao_Paulo", status: "ENABLED" },
];

const demoCampaigns = [
  { id: 1, account_id: 1, name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", type: "SEARCH", status: "ENABLED", daily_budget: 20 },
  { id: 2, account_id: 1, name: "[PMAX] Produtos", type: "PERFORMANCE_MAX", status: "PAUSED", daily_budget: 30 },
  { id: 3, account_id: 1, name: "[DSA] Produtos", type: "SEARCH", status: "PAUSED", daily_budget: 20 },
  { id: 4, account_id: 1, name: "[Pesquisa] Institucional", type: "SEARCH", status: "PAUSED", daily_budget: 40 },
  { id: 5, account_id: 1, name: "[Pesquisa] Atacado e Revenda", type: "SEARCH", status: "PAUSED", daily_budget: 20 },
  { id: 6, account_id: 1, name: "TESTE", type: "SHOPPING", status: "ENABLED", daily_budget: 40 },
  { id: 7, account_id: 1, name: "[YUP] [LEADS] [DISPLAY] [SALÃO DE BELEZA]", type: "DISPLAY", status: "PAUSED", daily_budget: 40 },
  { id: 8, account_id: 1, name: "[YT] [DDC] [VIDEOS SHORTS]", type: "VIDEO", status: "PAUSED", daily_budget: 10 },
  { id: 9, account_id: 1, name: "[INSCRITOS] [YT] [F] #2", type: "DEMAND_GEN", status: "PAUSED", daily_budget: 20 },
  { id: 10, account_id: 2, name: "Ótica em Erechim", type: "PERFORMANCE_MAX", status: "ENABLED", daily_budget: 15 },
  { id: 11, account_id: 2, name: "[SEARCH] [ROTAS]", type: "SEARCH", status: "ENABLED", daily_budget: 17 },
];

// Generate demo metrics for multiple dates (last 60 days)
function generateDemoMetrics(): (CampaignMetric & { campaign_name?: string })[] {
  const metrics: (CampaignMetric & { campaign_name?: string })[] = [];
  const today = new Date();
  let idCounter = 1;

  for (let daysAgo = 0; daysAgo < 60; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split("T")[0];
    const dayVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3

    // Campaign 1 - Sappium SEARCH (account 1, active)
    metrics.push({
      id: idCounter++, campaign_id: 1, date: dateStr,
      impressions: Math.round(540 * dayVariation), clicks: Math.round(175 * dayVariation),
      ctr: 0.3241, avg_cpc: 0.46, conversions: Math.round(2 * dayVariation), cost: +(80.06 * dayVariation).toFixed(2), cpa: 40.03,
    });

    // Campaign 6 - TESTE SHOPPING (account 1, active)
    metrics.push({
      id: idCounter++, campaign_id: 6, date: dateStr,
      impressions: Math.round(120 * dayVariation), clicks: Math.round(15 * dayVariation),
      ctr: 0.125, avg_cpc: 1.20, conversions: Math.round(1 * dayVariation), cost: +(18.00 * dayVariation).toFixed(2), cpa: 18.00,
    });

    // Campaign 10 - Ótica PMax (account 2, active)
    metrics.push({
      id: idCounter++, campaign_id: 10, date: dateStr,
      impressions: Math.round(3698 * dayVariation), clicks: Math.round(142 * dayVariation),
      ctr: 0.0384, avg_cpc: 2.95, conversions: Math.round(24 * dayVariation), cost: +(419.03 * dayVariation).toFixed(2), cpa: 17.46,
    });

    // Campaign 11 - SEARCH ROTAS (account 2, active)
    metrics.push({
      id: idCounter++, campaign_id: 11, date: dateStr,
      impressions: Math.round(887 * dayVariation), clicks: Math.round(66 * dayVariation),
      ctr: 0.0744, avg_cpc: 4.04, conversions: Math.round(26 * dayVariation), cost: +(266.49 * dayVariation).toFixed(2), cpa: 10.25,
    });
  }

  return metrics;
}

const demoMetrics = generateDemoMetrics();

const demoSearchTerms: (SearchTerm & { date?: string })[] = [];
// Generate search terms for multiple dates
(() => {
  const today = new Date();
  const baseTerms = [
    { account_id: 2, campaign_name: "Ótica em Erechim", ad_group: "Ad Group 1", term: "otica erechim", baseImpressions: 320, baseClicks: 45, baseCtr: 0.1406, baseConversions: 8, baseCost: 132.75 },
    { account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", term: "otica perto de mim", baseImpressions: 210, baseClicks: 28, baseCtr: 0.1333, baseConversions: 5, baseCost: 89.20 },
    { account_id: 2, campaign_name: "Ótica em Erechim", ad_group: "Ad Group 1", term: "oculos erechim", baseImpressions: 185, baseClicks: 22, baseCtr: 0.1189, baseConversions: 4, baseCost: 64.90 },
    { account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", term: "lente de contato erechim", baseImpressions: 150, baseClicks: 18, baseCtr: 0.12, baseConversions: 3, baseCost: 52.20 },
    { account_id: 2, campaign_name: "Ótica em Erechim", ad_group: "Ad Group 1", term: "oculos de sol erechim", baseImpressions: 95, baseClicks: 12, baseCtr: 0.1263, baseConversions: 2, baseCost: 35.40 },
    { account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "sappium cosmeticos", baseImpressions: 120, baseClicks: 35, baseCtr: 0.2917, baseConversions: 2, baseCost: 16.10 },
    { account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "produtos capilar profissional", baseImpressions: 95, baseClicks: 18, baseCtr: 0.1895, baseConversions: 1, baseCost: 8.28 },
    { account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "cosmeticos para salao", baseImpressions: 80, baseClicks: 14, baseCtr: 0.175, baseConversions: 1, baseCost: 6.44 },
    { account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "shampoo profissional", baseImpressions: 65, baseClicks: 10, baseCtr: 0.1538, baseConversions: 0, baseCost: 4.60 },
  ];

  let idCounter = 1;
  for (let daysAgo = 0; daysAgo < 60; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split("T")[0];
    const variation = 0.7 + Math.random() * 0.6;

    for (const base of baseTerms) {
      demoSearchTerms.push({
        id: idCounter++,
        account_id: base.account_id,
        campaign_name: base.campaign_name,
        ad_group: base.ad_group,
        term: base.term,
        impressions: Math.round(base.baseImpressions * variation / 30),
        clicks: Math.round(base.baseClicks * variation / 30),
        ctr: base.baseCtr,
        conversions: Math.round(base.baseConversions * variation / 30),
        cost: +((base.baseCost * variation / 30).toFixed(2)),
        date: dateStr,
      });
    }
  }
})();

const demoKeywords: KeywordQuality[] = [
  { id: 1, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "sappium", quality_score: 8, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "ABOVE_AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 2, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "cosmeticos profissionais", quality_score: 6, expected_ctr: "AVERAGE", ad_relevance: "AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 3, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "otica erechim", quality_score: 9, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "ABOVE_AVERAGE", landing_page_exp: "ABOVE_AVERAGE" },
  { id: 4, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "oculos de grau", quality_score: 5, expected_ctr: "AVERAGE", ad_relevance: "BELOW_AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 5, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "lentes de contato", quality_score: 3, expected_ctr: "BELOW_AVERAGE", ad_relevance: "BELOW_AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 6, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "shampoo profissional", quality_score: 7, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 7, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "tratamento capilar", quality_score: 4, expected_ctr: "BELOW_AVERAGE", ad_relevance: "AVERAGE", landing_page_exp: "BELOW_AVERAGE" },
  { id: 8, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "armação de oculos", quality_score: 7, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "AVERAGE", landing_page_exp: "ABOVE_AVERAGE" },
];

// Date filter helper
function isInDateRange(dateStr: string | undefined, from?: string, to?: string): boolean {
  if (!from && !to) return true;
  if (!dateStr) return true; // if no date on record, include it
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export async function getAccounts(): Promise<Account[]> {
  const sb = getSupabase();
  if (!sb) return demoAccounts;
  const { data, error } = await sb.from("accounts").select("*").order("name");
  if (error || !data) return demoAccounts;
  return data;
}

export async function getAccount(id: number): Promise<Account | null> {
  const sb = getSupabase();
  if (!sb) return demoAccounts.find(a => a.id === id) || null;
  const { data } = await sb.from("accounts").select("*").eq("id", id).single();
  return data;
}

export async function getCampaigns(accountId: number): Promise<Campaign[]> {
  const sb = getSupabase();
  if (!sb) return demoCampaigns.filter(c => c.account_id === accountId);
  const { data } = await sb.from("campaigns").select("*").eq("account_id", accountId).order("name");
  return data || [];
}

export async function getCampaignMetrics(accountId: number, dateRange?: DateRange) {
  const sb = getSupabase();
  if (!sb) {
    const campaignIds = demoCampaigns.filter(c => c.account_id === accountId).map(c => c.id);
    const filteredMetrics = demoMetrics.filter(m =>
      campaignIds.includes(m.campaign_id) && isInDateRange(m.date, dateRange?.from, dateRange?.to)
    );

    // Aggregate metrics per campaign
    const campaignAgg = new Map<number, {
      impressions: number; clicks: number; conversions: number; cost: number;
    }>();
    for (const m of filteredMetrics) {
      const existing = campaignAgg.get(m.campaign_id) || { impressions: 0, clicks: 0, conversions: 0, cost: 0 };
      existing.impressions += m.impressions || 0;
      existing.clicks += m.clicks || 0;
      existing.conversions += m.conversions || 0;
      existing.cost += m.cost || 0;
      campaignAgg.set(m.campaign_id, existing);
    }

    return Array.from(campaignAgg.entries()).map(([campaignId, agg]) => {
      const campaign = demoCampaigns.find(c => c.id === campaignId);
      const ctr = agg.impressions > 0 ? agg.clicks / agg.impressions : 0;
      const avgCpc = agg.clicks > 0 ? agg.cost / agg.clicks : 0;
      const cpa = agg.conversions > 0 ? agg.cost / agg.conversions : 0;
      return {
        id: campaignId,
        campaign_id: campaignId,
        date: dateRange?.from || "",
        impressions: agg.impressions,
        clicks: agg.clicks,
        ctr,
        avg_cpc: +avgCpc.toFixed(2),
        conversions: agg.conversions,
        cost: +agg.cost.toFixed(2),
        cpa: +cpa.toFixed(2),
        campaign_name: campaign?.name || "",
        type: campaign?.type || "",
        status: campaign?.status || "",
        daily_budget: campaign?.daily_budget || 0,
      };
    });
  }

  let query = sb
    .from("campaign_metrics")
    .select("*, campaigns(name, type, status, daily_budget)")
    .eq("campaigns.account_id", accountId);
  if (dateRange?.from) query = query.gte("date", dateRange.from);
  if (dateRange?.to) query = query.lte("date", dateRange.to);
  const { data } = await query;
  return data || [];
}

export async function getSearchTerms(accountId: number, dateRange?: DateRange): Promise<SearchTerm[]> {
  const sb = getSupabase();
  if (!sb) {
    const filtered = demoSearchTerms.filter(t =>
      t.account_id === accountId && isInDateRange(t.date, dateRange?.from, dateRange?.to)
    );

    // Aggregate by term
    const termAgg = new Map<string, SearchTerm>();
    for (const t of filtered) {
      const key = `${t.campaign_name}|${t.ad_group}|${t.term}`;
      const existing = termAgg.get(key);
      if (existing) {
        existing.impressions += t.impressions;
        existing.clicks += t.clicks;
        existing.conversions += t.conversions;
        existing.cost = +(existing.cost + t.cost).toFixed(2);
        existing.ctr = existing.impressions > 0 ? existing.clicks / existing.impressions : 0;
      } else {
        termAgg.set(key, { ...t });
      }
    }

    return Array.from(termAgg.values()).sort((a, b) => b.impressions - a.impressions);
  }

  let query = sb.from("search_terms").select("*").eq("account_id", accountId);
  if (dateRange?.from) query = query.gte("date", dateRange.from);
  if (dateRange?.to) query = query.lte("date", dateRange.to);
  const { data } = await query.order("impressions", { ascending: false });
  return data || [];
}

export async function getKeywordsQuality(accountId: number): Promise<KeywordQuality[]> {
  const sb = getSupabase();
  if (!sb) return demoKeywords.filter(k => k.account_id === accountId);
  const { data } = await sb.from("keywords_quality").select("*").eq("account_id", accountId).order("quality_score", { ascending: true });
  return data || [];
}

export async function getOverviewMetrics(dateRange?: DateRange) {
  const accounts = await getAccounts();
  const results = [];

  for (const account of accounts) {
    const metrics = await getCampaignMetrics(account.id, dateRange);
    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
    const totalCost = metrics.reduce((sum, m) => sum + (m.cost || 0), 0);
    const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);
    const ctr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const cpa = totalConversions > 0 ? totalCost / totalConversions : 0;

    results.push({
      account,
      totals: {
        impressions: totalImpressions,
        clicks: totalClicks,
        cost: totalCost,
        conversions: totalConversions,
        ctr,
        cpa,
      },
    });
  }

  return results;
}
