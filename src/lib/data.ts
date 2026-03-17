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

const demoMetrics: (CampaignMetric & { campaign_name?: string })[] = [
  { id: 1, campaign_id: 1, date: "2025-03-16", impressions: 540, clicks: 175, ctr: 0.3241, avg_cpc: 0.46, conversions: 0, cost: 80.06, cpa: 0 },
  { id: 2, campaign_id: 2, date: "2025-03-16", impressions: 0, clicks: 0, ctr: 0, avg_cpc: 0, conversions: 0, cost: 0, cpa: 0 },
  { id: 3, campaign_id: 6, date: "2025-03-16", impressions: 0, clicks: 0, ctr: 0, avg_cpc: 0, conversions: 0, cost: 0, cpa: 0 },
  { id: 4, campaign_id: 10, date: "2025-03-16", impressions: 3698, clicks: 142, ctr: 0.0384, avg_cpc: 2.95, conversions: 24, cost: 419.03, cpa: 17.46 },
  { id: 5, campaign_id: 11, date: "2025-03-16", impressions: 887, clicks: 66, ctr: 0.0744, avg_cpc: 4.04, conversions: 26, cost: 266.49, cpa: 10.25 },
];

const demoSearchTerms: SearchTerm[] = [
  { id: 1, account_id: 2, campaign_name: "Ótica em Erechim", ad_group: "Ad Group 1", term: "otica erechim", impressions: 320, clicks: 45, ctr: 0.1406, conversions: 8, cost: 132.75 },
  { id: 2, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", term: "otica perto de mim", impressions: 210, clicks: 28, ctr: 0.1333, conversions: 5, cost: 89.20 },
  { id: 3, account_id: 2, campaign_name: "Ótica em Erechim", ad_group: "Ad Group 1", term: "oculos erechim", impressions: 185, clicks: 22, ctr: 0.1189, conversions: 4, cost: 64.90 },
  { id: 4, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "sappium cosmeticos", impressions: 120, clicks: 35, ctr: 0.2917, conversions: 0, cost: 16.10 },
  { id: 5, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", term: "produtos capilar profissional", impressions: 95, clicks: 18, ctr: 0.1895, conversions: 0, cost: 8.28 },
];

const demoKeywords: KeywordQuality[] = [
  { id: 1, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "sappium", quality_score: 8, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "ABOVE_AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 2, account_id: 1, campaign_name: "Sappium [SEARCH] [INSTITUCIONAL] [F]", ad_group: "Institucional", keyword: "cosmeticos profissionais", quality_score: 6, expected_ctr: "AVERAGE", ad_relevance: "AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 3, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "otica erechim", quality_score: 9, expected_ctr: "ABOVE_AVERAGE", ad_relevance: "ABOVE_AVERAGE", landing_page_exp: "ABOVE_AVERAGE" },
  { id: 4, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "oculos de grau", quality_score: 5, expected_ctr: "AVERAGE", ad_relevance: "BELOW_AVERAGE", landing_page_exp: "AVERAGE" },
  { id: 5, account_id: 2, campaign_name: "[SEARCH] [ROTAS]", ad_group: "Rotas", keyword: "lentes de contato", quality_score: 3, expected_ctr: "BELOW_AVERAGE", ad_relevance: "BELOW_AVERAGE", landing_page_exp: "AVERAGE" },
];

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

export async function getCampaignMetrics(accountId: number) {
  const sb = getSupabase();
  if (!sb) {
    const campaignIds = demoCampaigns.filter(c => c.account_id === accountId).map(c => c.id);
    return demoMetrics
      .filter(m => campaignIds.includes(m.campaign_id))
      .map(m => ({
        ...m,
        campaign_name: demoCampaigns.find(c => c.id === m.campaign_id)?.name || "",
        type: demoCampaigns.find(c => c.id === m.campaign_id)?.type || "",
        status: demoCampaigns.find(c => c.id === m.campaign_id)?.status || "",
        daily_budget: demoCampaigns.find(c => c.id === m.campaign_id)?.daily_budget || 0,
      }));
  }
  const { data } = await sb
    .from("campaign_metrics")
    .select("*, campaigns(name, type, status, daily_budget)")
    .eq("campaigns.account_id", accountId);
  return data || [];
}

export async function getSearchTerms(accountId: number): Promise<SearchTerm[]> {
  const sb = getSupabase();
  if (!sb) return demoSearchTerms.filter(t => t.account_id === accountId);
  const { data } = await sb.from("search_terms").select("*").eq("account_id", accountId).order("impressions", { ascending: false });
  return data || [];
}

export async function getKeywordsQuality(accountId: number): Promise<KeywordQuality[]> {
  const sb = getSupabase();
  if (!sb) return demoKeywords.filter(k => k.account_id === accountId);
  const { data } = await sb.from("keywords_quality").select("*").eq("account_id", accountId).order("quality_score", { ascending: true });
  return data || [];
}

export async function getOverviewMetrics() {
  const accounts = await getAccounts();
  const results = [];

  for (const account of accounts) {
    const metrics = await getCampaignMetrics(account.id);
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
