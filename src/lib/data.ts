import { getSupabase } from "./supabase";
import type { Account, Campaign, CampaignMetric, SearchTerm, KeywordQuality } from "./supabase";
import { readFileSync } from "fs";
import { join } from "path";

export interface DateRange {
  from?: string;
  to?: string;
}

// ─── Load real data from JSON file ────────────────────────────
interface RealAccountData {
  id: number;
  google_ads_id: string;
  name: string;
  currency: string;
  timezone: string;
  status: string;
  campaigns: Array<{
    id: number;
    account_id: number;
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
  }>;
  daily_metrics: Array<{
    date_from: string;
    date_to: string;
    campaign_name: string;
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
  }>;
  search_terms: SearchTerm[];
  keywords_quality: KeywordQuality[];
}

interface RealData {
  accounts: RealAccountData[];
  last_updated: string;
}

let _realData: RealData | null = null;

function loadRealData(): RealData | null {
  if (_realData) return _realData;
  try {
    const filePath = join(process.cwd(), "public", "data", "google-ads-data.json");
    const raw = readFileSync(filePath, "utf-8");
    _realData = JSON.parse(raw);
    return _realData;
  } catch {
    return null;
  }
}

// ─── Data functions ────────────────────────────────────────────

export async function getAccounts(): Promise<Account[]> {
  // Try Supabase first
  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.from("accounts").select("*").order("name");
    if (!error && data) return data;
  }

  // Try real JSON data
  const real = loadRealData();
  if (real) {
    return real.accounts.map(a => ({
      id: a.id,
      google_ads_id: a.google_ads_id,
      name: a.name,
      currency: a.currency,
      timezone: a.timezone,
      status: a.status,
    }));
  }

  return [];
}

export async function getAccount(id: number): Promise<Account | null> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("accounts").select("*").eq("id", id).single();
    if (data) return data;
  }

  const real = loadRealData();
  if (real) {
    const acc = real.accounts.find(a => a.id === id);
    if (acc) return {
      id: acc.id,
      google_ads_id: acc.google_ads_id,
      name: acc.name,
      currency: acc.currency,
      timezone: acc.timezone,
      status: acc.status,
    };
  }

  return null;
}

export async function getCampaigns(accountId: number): Promise<Campaign[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("campaigns").select("*").eq("account_id", accountId).order("name");
    if (data) return data;
  }

  const real = loadRealData();
  if (real) {
    const acc = real.accounts.find(a => a.id === accountId);
    if (acc) return acc.campaigns;
  }

  return [];
}

export async function getCampaignMetrics(accountId: number, dateRange?: DateRange) {
  const sb = getSupabase();
  if (sb) {
    let query = sb
      .from("campaign_metrics")
      .select("*, campaigns(name, type, status, daily_budget)")
      .eq("campaigns.account_id", accountId);
    if (dateRange?.from) query = query.gte("date", dateRange.from);
    if (dateRange?.to) query = query.lte("date", dateRange.to);
    const { data } = await query;
    if (data) return data;
  }

  const real = loadRealData();
  if (real) {
    const acc = real.accounts.find(a => a.id === accountId);
    if (!acc) return [];

    // If date range provided, use daily_metrics and aggregate
    if (dateRange?.from || dateRange?.to) {
      const filtered = acc.daily_metrics.filter(m => {
        if (dateRange.from && m.date_to < dateRange.from) return false;
        if (dateRange.to && m.date_from > dateRange.to) return false;
        return true;
      });

      // Aggregate by campaign name
      const agg = new Map<string, {
        name: string; type: string; status: string; daily_budget: number;
        impressions: number; clicks: number; conversions: number; cost: number;
      }>();

      for (const m of filtered) {
        const existing = agg.get(m.campaign_name) || {
          name: m.campaign_name, type: m.type, status: m.status,
          daily_budget: m.daily_budget, impressions: 0, clicks: 0,
          conversions: 0, cost: 0,
        };
        existing.impressions += m.impressions;
        existing.clicks += m.clicks;
        existing.conversions += m.conversions;
        existing.cost += m.cost;
        agg.set(m.campaign_name, existing);
      }

      return Array.from(agg.values()).map((c, i) => ({
        id: i + 1,
        campaign_id: i + 1,
        date: dateRange.from || "",
        campaign_name: c.name,
        type: c.type,
        status: c.status,
        daily_budget: c.daily_budget,
        impressions: c.impressions,
        clicks: c.clicks,
        ctr: c.impressions > 0 ? c.clicks / c.impressions : 0,
        avg_cpc: c.clicks > 0 ? +(c.cost / c.clicks).toFixed(2) : 0,
        conversions: c.conversions,
        cost: +c.cost.toFixed(2),
        cpa: c.conversions > 0 ? +(c.cost / c.conversions).toFixed(2) : 0,
      }));
    }

    // No date range - return full 90-day campaign totals
    return acc.campaigns.map(c => ({
      id: c.id,
      campaign_id: c.id,
      date: "",
      campaign_name: c.name,
      type: c.type,
      status: c.status,
      daily_budget: c.daily_budget,
      impressions: c.impressions,
      clicks: c.clicks,
      ctr: c.ctr,
      avg_cpc: c.avg_cpc,
      conversions: c.conversions,
      cost: c.cost,
      cpa: c.cpa,
    }));
  }

  return [];
}

export async function getSearchTerms(accountId: number, dateRange?: DateRange): Promise<SearchTerm[]> {
  const sb = getSupabase();
  if (sb) {
    let query = sb.from("search_terms").select("*").eq("account_id", accountId);
    if (dateRange?.from) query = query.gte("date", dateRange.from);
    if (dateRange?.to) query = query.lte("date", dateRange.to);
    const { data } = await query.order("impressions", { ascending: false });
    if (data) return data;
  }

  const real = loadRealData();
  if (real) {
    const acc = real.accounts.find(a => a.id === accountId);
    if (acc) return acc.search_terms.sort((a, b) => b.impressions - a.impressions);
  }

  return [];
}

export async function getKeywordsQuality(accountId: number): Promise<KeywordQuality[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("keywords_quality").select("*").eq("account_id", accountId).order("quality_score", { ascending: true });
    if (data) return data;
  }

  const real = loadRealData();
  if (real) {
    const acc = real.accounts.find(a => a.id === accountId);
    if (acc) return acc.keywords_quality.sort((a, b) => (a.quality_score || 0) - (b.quality_score || 0));
  }

  return [];
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
