import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  if (!_supabase) _supabase = createClient(url, key)
  return _supabase
}

export type Account = {
  id: number
  google_ads_id: string
  name: string
  currency: string
  timezone: string
  status: string
}

export type Campaign = {
  id: number
  account_id: number
  name: string
  type: string
  status: string
  daily_budget: number
}

export type CampaignMetric = {
  id: number
  campaign_id: number
  date: string
  impressions: number
  clicks: number
  ctr: number
  avg_cpc: number
  conversions: number
  cost: number
  cpa: number
}

export type SearchTerm = {
  id: number
  account_id: number
  campaign_name: string
  ad_group: string
  term: string
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  cost: number
}

export type KeywordQuality = {
  id: number
  account_id: number
  campaign_name: string
  ad_group: string
  keyword: string
  quality_score: number | null
  expected_ctr: string
  ad_relevance: string
  landing_page_exp: string
}
